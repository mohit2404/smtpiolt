import { Container } from "@/components/container";
import { Section } from "@/components/section";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen text-gray-900">
      <Section>
        <Container className="text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Send Bulk Emails with Your Own SMTP
          </h1>
          <p className="mx-auto max-w-xl text-lg text-gray-700 md:text-xl">
            SMTPilot lets you send thousands of emails using your own Gmail,
            Outlook, or custom SMTP credentials. No limits. No middleman. No
            fees.
          </p>
          <div className="mt-8">
            <Link
              href="/send-emails"
              className="inline-grid h-10 w-full place-items-center rounded-full border px-6 text-sm font-medium tracking-wide transition-colors duration-300 hover:border-transparent hover:bg-gray-100 sm:h-12 sm:w-auto sm:text-base md:w-fit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Send Emails
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-100">
        <Container className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Bring Your Own SMTP</h3>
            <p>
              Use your own Gmail, Outlook, Zoho, or private SMTP. You&apos;re fully
              in control.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold">Live Status Tracking</h3>
            <p>
              See real-time delivery status, retries, and success/failure rates.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold">No Limits. Ever.</h3>
            <p>We never restrict your sending. Your SMTP, your rules.</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="mb-6 text-3xl font-bold">FAQs</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">Is SMTPilot free?</h4>
              <p>
                Yes! You use your own SMTP account, so we don’t charge anything.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">
                Do you store my emails or credentials?
              </h4>
              <p>
                No. Everything is processed temporarily and securely via your
                session.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">
                What email providers are supported?
              </h4>
              <p>
                Gmail, Outlook, Zoho, Mailgun, SendGrid, and any SMTP-compatible
                service.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <footer className="py-16 text-center text-sm text-gray-500">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/mohit2404"
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-wide hover:underline"
          >
            Mohit
          </a>
        </p>
        <p>
          <a
            href="https://github.com/mohit2404/smtpiolt"
            className="text-sm tracking-wide text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
