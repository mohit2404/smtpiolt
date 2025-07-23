import { EmailBatch, SMTPConfig } from "@/lib/types";

export function validateSMTPConfig(config: SMTPConfig): string | null {
  if (!config.host) return "SMTP host is required";
  if (!config.username) return "Username is required";
  if (!config.password) return "Password is required";
  if (config.port < 1 || config.port > 65535)
    return "Port must be between 1 and 65535";
  return null;
}

export function validateEmailBatch(params: EmailBatch): string | null {
  if (!params.senderEmail) return "Sender email is required";
  if (!params.subject) return "Subject is required";
  if (!params.message) return "Message is required";
  if (!params.recipients?.length) return "Recipients are required";
  if (!params.smtpConfig.host) return "SMTP host is required";
  return null;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isFakeEmail(email: string): boolean {
  const fakePatterns = [
    "example.com",
    "test.com",
    "fake.com",
    "mailinator.com",
    "tempmail.com",
    "yopmail.com",
  ];
  return fakePatterns.some((pattern) => email.endsWith(`@${pattern}`));
}
