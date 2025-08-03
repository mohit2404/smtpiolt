import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { EMAIL_BATCH_COLLECTION, EMAIL_LOGS_COLLECTION } from "@/lib/constant";
import { Batch, RecipientLog } from "@/lib/types";

export function useBatchRealtime(batchId: string) {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [recipients, setRecipients] = useState<RecipientLog[]>([]);

  useEffect(() => {
    if (!batchId) return;

    // 1. Realtime logs
    const logsQuery = query(
      collection(db, EMAIL_BATCH_COLLECTION, batchId, EMAIL_LOGS_COLLECTION),
      orderBy("updated_at"),
    );

    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const updatedLogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RecipientLog[];
      setRecipients(updatedLogs);
    });

    // 2. Realtime batch metadata
    const batchDocRef = doc(db, EMAIL_BATCH_COLLECTION, batchId);
    const unsubscribeBatch = onSnapshot(batchDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setBatch({ id: docSnap.id, ...docSnap.data() } as Batch);
      }
    });

    return () => {
      unsubscribeLogs();
      unsubscribeBatch();
    };
  }, [batchId]);

  return { batch, recipients };
}
