import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  startAfter,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type Unsubscribe,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Message } from "../types/Message";
import { ROOMS_COLLECTION, PAGE_SIZE } from "../constants";

function messagesCol(roomId: string) {
  return collection(db, ROOMS_COLLECTION, roomId, "messages");
}

function docToMessage(doc: QueryDocumentSnapshot): Message {
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
  roomId: string,
  onMessages: (messages: Message[], oldestDoc: QueryDocumentSnapshot | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const q = query(messagesCol(roomId), orderBy("createdAt", "desc"), limit(PAGE_SIZE));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map(docToMessage);
      const oldest = snapshot.docs[snapshot.docs.length - 1] ?? null;
      onMessages(messages, oldest);
    },
    onError,
  );
}

export async function fetchOlderMessages(roomId: string, cursor: QueryDocumentSnapshot) {
  const q = query(
    messagesCol(roomId),
    orderBy("createdAt", "desc"),
    startAfter(cursor),
    limit(PAGE_SIZE),
  );
  const snapshot = await getDocs(q);

  return {
    messages: snapshot.docs.map(docToMessage),
    oldestDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore: snapshot.docs.length >= PAGE_SIZE,
  };
}

export async function createMessage(
  roomId: string,
  text: string,
  senderId: string,
  senderName: string,
) {
  await addDoc(messagesCol(roomId), {
    text,
    senderId,
    senderName,
    createdAt: serverTimestamp(),
    editedAt: null,
  });
}

export async function editMessage(roomId: string, messageId: string, text: string) {
  await updateDoc(doc(db, ROOMS_COLLECTION, roomId, "messages", messageId), {
    text,
    editedAt: serverTimestamp(),
  });
}

export async function deleteMessage(roomId: string, messageId: string) {
  await deleteDoc(doc(db, ROOMS_COLLECTION, roomId, "messages", messageId));
}
