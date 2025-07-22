import { EmailBatch, SMTPConfig } from "@/lib/types";
import apiClient from "@/lib/utils/axios";

class ApiHandler {
  // fetch data of a batchId
  async fetchBatch(batchId: string) {
    try {
      const res = await apiClient.get(`/api/process-batch/${batchId}`);
      return res.data;
    } catch (error) {
      console.error("Error in fetchBatch:", error);
      throw error;
    }
  }

  // fetch data of a batchId
  async testSmtpConnection(smtpConfig: SMTPConfig) {
    try {
      const res = await apiClient.post(`/api/test-smtp`, { smtpConfig });
      return res.data;
    } catch (error) {
      console.error("Error in testSmtpConnection:", error);
      throw error;
    }
  }

  // fetch data of a batchId
  async processEmailBatch(params: EmailBatch) {
    try {
      const res = await apiClient.post(`/api/process-batch`, {
        senderEmail: params.senderEmail,
        senderName: params.senderName,
        subject: params.subject,
        message: params.message,
        recipients: params.recipients,
        smtpConfig: params.smtpConfig,
      });
      return res.data;
    } catch (error) {
      console.error("Error in processEmailBatch:", error);
      throw error;
    }
  }
}

export const apiHandler = new ApiHandler();
