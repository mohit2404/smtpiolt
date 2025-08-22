import { EmailBatch, SMTPConfig } from "@/lib/types";
import apiClient from "@/lib/utils/axios";

class ApiHandler {
  // test smtp connection
  async testSmtpConnection(smtpConfig: SMTPConfig) {
    try {
      const res = await apiClient.post(`/api/test-smtp`, { smtpConfig });
      return res.data;
    } catch (error: any) {
      console.error("Error in testSmtpConnection:", error?.message || error);
      throw error;
    }
  }

  // process email batch
  async processEmailBatch(params: EmailBatch) {
    try {
      const res = await apiClient.post(`/api/process-batch`, {
        senderEmail: params.senderEmail,
        senderName: params.senderName,
        subject: params.subject,
        emailFormat: params.emailFormat,
        mailBody: params.mailBody,
        recipients: params.recipients,
        smtpConfig: params.smtpConfig,
      });
      return res.data;
    } catch (error: any) {
      console.error("Error in processEmailBatch:", error?.message || error);
      throw error;
    }
  }
}

export const apiHandler = new ApiHandler();
