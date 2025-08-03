import { EMAIL_BATCH_COLLECTION, EMAIL_LOGS_COLLECTION } from "../constant";
import { Batch, EmailRecipient, RecipientLog } from "../types";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const createEmailBatch = async (batchId: string, data: Batch) => {
  try {
    const docRef = doc(db, EMAIL_BATCH_COLLECTION, batchId);
    await setDoc(docRef, {
      ...data,
      status: "in_progress",
      created_at: new Date().toISOString(),
    });

    return {
      status: true,
      message: "Batch created successfully",
      error: null,
    };
  } catch (error: any) {
    console.error("Failed to create batch:", error?.message | error);
    return {
      status: false,
      message: "Failed to create batch",
      error: error?.message || error,
    };
  }
};

export const createEmailLogs = async (
  batchId: string,
  recipients: EmailRecipient[],
) => {
  const timestamp = new Date().toISOString();

  try {
    for (const recipient of recipients) {
      const logsRef = doc(
        db,
        EMAIL_BATCH_COLLECTION,
        batchId,
        EMAIL_LOGS_COLLECTION,
        recipient.email,
      );

      await setDoc(logsRef, {
        recipient: recipient.email,
        name: recipient.name || null,
        status: "pending",
        updated_at: timestamp,
      });
    }
    return {
      status: true,
      message: "Recipients inserted successfully",
      error: null,
    };
  } catch (error: any) {
    console.error("Failed to insert recipients:", error?.message || error);
    return {
      status: false,
      message: "Failed to insert recipients",
      error: error?.message || error,
    };
  }
};

export const updateEmailLogStatus = async (
  batchId: string,
  email: string,
  updates: any,
) => {
  const ref = doc(
    db,
    EMAIL_BATCH_COLLECTION,
    batchId,
    EMAIL_LOGS_COLLECTION,
    email,
  );
  await updateDoc(ref, {
    ...updates,
    updated_at: new Date().toISOString(),
  });
};

export const updateBatchStatus = async (batchId: string, updates: any) => {
  await updateDoc(doc(db, EMAIL_BATCH_COLLECTION, batchId), {
    ...updates,
    completed_at: new Date().toISOString(),
  });
};

export const getBatchById = async (batchId: string) => {
  try {
    const batchDoc = await getDoc(doc(db, EMAIL_BATCH_COLLECTION, batchId));
    return {
      status: true,
      message: "Batch fetched successfully",
      data: batchDoc.data() as Batch,
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching batch:", error.message || error);
    return {
      status: false,
      message: "Failed to fetch batch",
      data: null,
      error: error.message || error,
    };
  }
};

export const getBatchEmailLogs = async (batchId: string) => {
  try {
    const logsQuery = collection(
      db,
      EMAIL_BATCH_COLLECTION,
      batchId,
      EMAIL_LOGS_COLLECTION,
    );

    const logsSnapshot = await getDocs(logsQuery);
    const logs: RecipientLog[] = logsSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        recipient: data.recipient,
        name: data.name || null,
        status: data.status,
        message_id: data.message_id || null,
        error: data.error || null,
        updated_at: data.updated_at,
      };
    });

    return {
      status: true,
      message: "Logs fetched successfully",
      data: logs,
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching batch logs:", error.message || error);
    return {
      status: false,
      message: "Failed to fetch batch logs",
      data: null,
      error: error.message || error,
    };
  }
};
