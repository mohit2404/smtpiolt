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

export interface RecipientLog {
  id: string | null;
  recipient: string;
  name: string | null;
  status: string;
  message_id: string | null;
  error: string | null;
  updated_at: string;
}

export interface Batch {
  id: string;
  sender_email: string;
  sender_name?: string;
  subject: string;
  html_content: string;
  smtp_config?: any;
  status: string;
  total_sent: number;
  total_failed: number;
  completed_at?: string;
  created_at: string;
}
