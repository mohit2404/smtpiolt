export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

export interface TestSMTPRequest {
  smtpConfig: SMTPConfig;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailBatch {
  senderEmail: string;
  senderName: string;
  subject: string;
  message: string;
  recipients: EmailRecipient[];
  smtpConfig: SMTPConfig;
}
