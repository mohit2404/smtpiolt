"use client";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Modal } from "@/components/modal";
import { Textarea } from "@/components/textarea";
import { apiHandler } from "@/lib/class/apiHandler";
import { EmailRecipient, SMTPConfig } from "@/lib/types";
import {
  isFakeEmail,
  validateEmail,
  validateEmailBatch,
  validateSMTPConfig,
} from "@/lib/utils/validate";
import {
  CheckCircle,
  Eye,
  Mail,
  Plus,
  Send,
  Settings,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SendEmailPage() {
  const router = useRouter();

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [manualEmails, setManualEmails] = useState("");
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [smtpConfig, setSMTPConfig] = useState<SMTPConfig>({
    host: "",
    port: 465,
    secure: true,
    username: "",
    password: "",
  });

  const [sending, setSending] = useState(false);
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [showSMTPModal, setShowSMTPModal] = useState(false);
  const [testingSMTP, setTestingSMTP] = useState(false);
  const [smtpTestResult, setSMTPTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    let emails: EmailRecipient[] = [];
    const rejectedEmails: string[] = [];

    try {
      if (file.name.endsWith(".json")) {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          emails = data.map((item) => {
            if (typeof item === "string") {
              return { email: item.trim() };
            }
            return {
              email: item.email?.trim(),
              name: item.name?.trim(),
            };
          });
        }
      } else if (file.name.endsWith(".txt")) {
        const lines = text.split("\n").filter((line) => line.trim());
        emails = lines.map((line) => {
          const trimmed = line.trim();
          if (trimmed.includes(",")) {
            const [email, name] = trimmed.split(",").map((s) => s.trim());
            return { email, name };
          }
          return { email: trimmed };
        });
      }

      const validEmails = emails.filter((item) => {
        const email = item.email?.toLowerCase();
        const isValid = validateEmail(email) && !isFakeEmail(email);
        if (!isValid) rejectedEmails.push(email || "");
        return isValid;
      });

      // Remove duplicates
      const uniqueEmails = validEmails.filter(
        (email, index, self) =>
          index === self.findIndex((e) => e.email === email.email),
      );

      setRecipients((prev) => {
        const combined = [...prev, ...uniqueEmails];
        return combined.filter(
          (email, index, self) =>
            index === self.findIndex((e) => e.email === email.email),
        );
      });

      // Optional: Show user any rejected emails
      setInvalidEmails(rejectedEmails);
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  };

  const handleAddManualEmails = () => {
    if (!manualEmails.trim()) return;

    const emailList: EmailRecipient[] = [];
    const rejectedEmails: string[] = [];

    // Split by newlines and commas
    const lines = manualEmails.split(/[\n,]/).filter((line) => line.trim());

    lines.forEach((line) => {
      const trimmed = line.trim();

      let email = "";
      let name: string | undefined;

      // Try to parse "Name <email@domain.com>" format
      if (trimmed.includes(" ")) {
        const match = trimmed.match(/^(.+?)\s*<(.+?)>$/);
        if (match) {
          [, name, email] = match;
        } else {
          // Try parsing "email name" format
          const parts = trimmed.split(/\s+/);
          email = parts[0];
          name = parts.slice(1).join(" ");
        }
      } else {
        // Parse just email
        email = trimmed;
      }

      email = email?.trim().toLowerCase();

      if (validateEmail(email) && !isFakeEmail(email)) {
        emailList.push({ email, name: name?.trim() || undefined });
      } else {
        rejectedEmails.push(trimmed);
      }
    });

    // Update recipients and reset manualEmails
    setRecipients((prev) => {
      const combined = [...prev, ...emailList];
      return combined.filter(
        (email, index, self) =>
          index === self.findIndex((e) => e.email === email.email),
      );
    });

    // Show invalids
    setInvalidEmails(rejectedEmails);
    setManualEmails("");
  };

  const handleRemoveRecipient = (emailToRemove: string) => {
    setRecipients((prev) =>
      prev.filter((recipient) => recipient.email !== emailToRemove),
    );
  };

  const handleClearAllRecipients = () => {
    setRecipients([]);
  };

  const handleTestSMTP = async () => {
    const validationError = validateSMTPConfig(smtpConfig);
    if (validationError) {
      setSMTPTestResult({
        success: false,
        message: validationError,
      });
      return;
    }

    setTestingSMTP(true);
    setSMTPTestResult(null);

    try {
      const data = await apiHandler.testSmtpConnection(smtpConfig);

      setSMTPTestResult({
        success: data.success,
        message: data.success ? data.message : data.error,
      });

      if (data.success) {
        setShowSMTPModal(false);
      }
    } catch (error: any) {
      console.error("Error testing SMTP connection:", error?.message || error);
      setSMTPTestResult({
        success: false,
        message: "Failed to test SMTP connection",
      });
    } finally {
      setTestingSMTP(false);
    }
  };

  const handleSendEmails = async () => {
    const obj = {
      senderEmail,
      senderName,
      subject,
      message,
      recipients,
      smtpConfig,
    };

    const validationError = validateEmailBatch(obj);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSending(true);

    try {
      const data = await apiHandler.processEmailBatch(obj);

      if (!data.batchId) {
        throw new Error(data.error || "Failed to send emails");
      }

      // redirect to live progress view
      router.push(`/send-emails/${data.batchId}`);
    } catch (error) {
      console.error("Error sending emails:", error);
    } finally {
      setSending(false);
    }
  };

  const handleSMTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSMTPConfig((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value || 576) : value,
    }));

    setSMTPTestResult(null);
    setTestingSMTP(false);
  };

  return (
    <>
      <Head>
        <title>Send Bulk Emails</title>
        <meta name="canonical" content="/send-emails" />
      </Head>

      <section>
        <Container className="max-w-6xl py-7">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Bulk Email Sender
            </h1>
            <p className="text-gray-600">
              Upload email lists and send personalized emails to multiple
              recipients via SMTP
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* File Upload Section */}
            <div className="rounded-2xl border p-6">
              <div className="mb-2 flex items-center gap-2">
                <Upload className="h-5 w-5 text-black" />
                <h2 className="text-xl font-semibold">Manage Recipients</h2>
              </div>
              <p className="mb-4 text-gray-600">
                Upload files or add emails manually
              </p>

              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <Label key="file-upload" text="Upload Email File" />
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".json,.txt"
                    onChange={handleFileUpload}
                    className="text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:text-black file:has-open:text-gray-300"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Supports JSON and TXT files
                  </p>
                </div>

                {/* Manual Email Input - Multiple */}
                <div>
                  <label
                    htmlFor="manual-emails"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Add Multiple Emails
                  </label>
                  <Textarea
                    id="manual-emails"
                    placeholder={`One email per line or comma-separated`}
                    rows={2}
                    value={manualEmails}
                    onChange={(e) => setManualEmails(e.target.value)}
                    className="scrollbar-hide"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Supports: email@domain.com, Name &lt;email@domain.com&gt;
                      or email@domain.com, Name
                    </p>
                    <Button
                      onClick={handleAddManualEmails}
                      disabled={!manualEmails.trim()}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      <Plus className="h-3 w-3" />
                      Add Emails
                    </Button>
                  </div>
                  {invalidEmails.length > 0 && (
                    <p className="text-xs text-red-600">
                      {invalidEmails.length}{" "}
                      {invalidEmails.length > 1 ? "Email" : "Emails"} were not
                      added (invalid or fake)
                    </p>
                  )}
                </div>

                {/* Recipients List */}
                {recipients.length > 0 && (
                  <div>
                    <div className="mb-2 flex h-full items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Recipients ({recipients.length})
                      </label>
                      <div className="space-x-4">
                        <Button
                          onClick={() => setShowAllEmails(!showAllEmails)}
                          size="sm"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          See All
                        </Button>
                        <Button
                          onClick={handleClearAllRecipients}
                          variant="outline"
                          size="sm"
                          className="bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Clear All
                        </Button>
                      </div>
                    </div>
                    <div className="scrollbar-hide max-h-28 space-y-2 overflow-y-scroll rounded-lg border border-gray-200 bg-gray-50 p-4">
                      {recipients.map((recipient, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between rounded border bg-white px-2 py-1 ${index === recipients.length - 1 && "mb-6"}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {recipient.name ? recipient.name : ""}{" "}
                              {recipient.email}
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              handleRemoveRecipient(recipient.email)
                            }
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Composition Section */}
            <div className="rounded-2xl border p-6">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-5 w-5 text-black" />
                <h2 className="text-xl font-semibold">Compose Email</h2>
              </div>
              <p className="mb-4 text-gray-600">Create your email content</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label key="sender-name" text="Sender Name" />
                    <Input
                      id="sender-name"
                      placeholder="Your Name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label key="sender-email" text="Sender Email" required />
                    <Input
                      id="sender-email"
                      type="email"
                      placeholder="sender@example.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label key="subject" text="Subject" required />
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div>
                  <Label key="message" text="Message" required />
                  <Textarea
                    id="message"
                    placeholder="Your email message..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowSMTPModal(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    SMTP Settings
                  </Button>
                  <Button
                    onClick={handleSendEmails}
                    disabled={!smtpConfig.host}
                    className="flex flex-1 items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sending
                      ? "Sending..."
                      : `Send to ${recipients.length} Recipients`}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* All Emails Modal */}
          <Modal
            isOpen={showAllEmails}
            onClose={() => setShowAllEmails(!showAllEmails)}
          >
            <div className="flex h-[75vh] w-full flex-col">
              <div className="inxet-x-0 sticky top-0 flex justify-between bg-white p-6">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold">All Emails</h2>
                  <p className="text-gray-600">
                    List of all added emails to the batch
                  </p>
                </div>
                <div>
                  <Button
                    onClick={() => setShowAllEmails(!showAllEmails)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="scrollbar-hide h-fit space-y-2.5 overflow-y-scroll px-6">
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded border bg-white px-2 py-1.5 ${index === recipients.length - 1 && "mb-6"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {recipient.name ? recipient.name : ""} {recipient.email}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleRemoveRecipient(recipient.email)}
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Modal>

          {/* SMTP Configuration Modal */}
          <Modal
            isOpen={showSMTPModal}
            onClose={() => setShowSMTPModal(!showSMTPModal)}
          >
            <div className="w-full p-6">
              <h2 className="mb-2 text-2xl font-semibold">
                SMTP Configuration
              </h2>
              <p className="mb-6 text-gray-600">
                Configure your SMTP server settings to send emails
              </p>

              <div className="space-y-4">
                <div>
                  <Label key="host" text="SMTP Host" required />
                  <Input
                    id="host"
                    name="host"
                    placeholder="smtp.gmail.com"
                    value={smtpConfig.host}
                    onChange={handleSMTPChange}
                  />
                </div>

                <div>
                  <Label key="smtp-port" text="SMTP Port" required />
                  <Input
                    id="smtp-port"
                    type="number"
                    placeholder="456"
                    value={smtpConfig.port}
                    onChange={handleSMTPChange}
                  />
                </div>

                {/* <div className="w-full">
                  <Label key="secure" text="SMTP Port" />
                  <input
                    type="checkbox"
                    id="react-option"
                    className="hidden peer"
                    required
                  />
                  <label
                    htmlFor="react-option"
                    className="inline-flex items-center justify-between py-1.5 w-full border border-gray-300 rounded-lg cursor-pointer peer-checked:border-green-500 hover:text-gray-600 peer-checked:text-green-500 hover:bg-gray-50"
                  >
                    <div className="w-full text-lg font-semibold">True</div>
                  </label>
                </div> */}

                <div>
                  <Label key="username" text="SMTP Username" required />
                  <Input
                    id="username"
                    name="username"
                    placeholder="your-email@domain"
                    value={smtpConfig.username}
                    onChange={handleSMTPChange}
                  />
                </div>

                <div>
                  <Label key="password" text="SMTP Password" required />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your app password"
                    value={smtpConfig.password}
                    onChange={handleSMTPChange}
                  />
                </div>

                {smtpTestResult && (
                  <div className="flex items-center gap-2">
                    {smtpTestResult.success ? (
                      <>
                        <CheckCircle className="size-4 text-green-600" />
                        <span className="text-green-600">
                          {smtpTestResult.message}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4 text-red-600" />
                        <span className="text-red-600">
                          Failed: Username and Password not accepted.
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowSMTPModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleTestSMTP}
                    className="flex-1"
                    disabled={
                      !smtpConfig.host ||
                      !smtpConfig.username ||
                      !smtpConfig.password
                    }
                  >
                    {testingSMTP ? "Testing..." : "Save Configuration"}
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </Container>
      </section>
    </>
  );
}
