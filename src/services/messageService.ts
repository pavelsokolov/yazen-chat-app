import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  startAfter,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
  type Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Message } from "../types/Message";
import { MESSAGES_COLLECTION, PAGE_SIZE } from "../constants";

function docToMessage(doc: QueryDocumentSnapshot<DocumentData>): Message {
  const data = doc.data();
  return {
    id: doc.id,
    text: typeof data.text === "string" ? data.text : "",
    senderId: typeof data.senderId === "string" ? data.senderId : "",
    senderName: typeof data.senderName === "string" ? data.senderName : "Unknown",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null,
    editedAt: data.editedAt instanceof Timestamp ? data.editedAt.toDate().toISOString() : null,
  };
}

export function subscribeToMessages(
  onMessages: (messages: Message[], oldestDoc: QueryDocumentSnapshot<DocumentData>) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map(docToMessage).reverse();
      const oldest = snapshot.docs[snapshot.docs.length - 1];
      onMessages(messages, oldest);
    },
    onError,
  );
}

export async function fetchOlderMessages(cursor: QueryDocumentSnapshot<DocumentData>) {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    orderBy("createdAt", "desc"),
    startAfter(cursor),
    limit(PAGE_SIZE),
  );
  const snapshot = await getDocs(q);

  return {
    messages: snapshot.docs.map(docToMessage).reverse(),
    oldestDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore: snapshot.docs.length >= PAGE_SIZE,
  };
}

export async function createMessage(text: string, senderId: string, senderName: string) {
  await addDoc(collection(db, MESSAGES_COLLECTION), {
    text,
    senderId,
    senderName,
    createdAt: serverTimestamp(),
    editedAt: null,
  });
}

export async function editMessage(messageId: string, text: string) {
  await updateDoc(doc(db, MESSAGES_COLLECTION, messageId), {
    text,
    editedAt: serverTimestamp(),
  });
}
