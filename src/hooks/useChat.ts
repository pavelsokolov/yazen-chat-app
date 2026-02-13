import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import type { Message } from "../types/Message";
import { MESSAGES_COLLECTION, PAGE_SIZE, MAX_MESSAGE_LENGTH } from "../constants";

function docToMessage(doc: QueryDocumentSnapshot<DocumentData>): Message {
  const data = doc.data();
  return {
    id: doc.id,
    text: data.text,
    senderId: data.senderId,
    senderName: data.senderName,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null,
    editedAt: data.editedAt instanceof Timestamp ? data.editedAt.toDate().toISOString() : null,
  };
}

export function useChat() {
  const { user, displayName } = useAuth();
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [olderMessages, setOlderMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const oldestSnapshotRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const oldestPaginatedRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Real-time listener for latest messages
  useEffect(() => {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(docToMessage).reverse();
      setLiveMessages(messages);
      if (snapshot.docs.length > 0) {
        oldestSnapshotRef.current = snapshot.docs[snapshot.docs.length - 1];
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Merge: older paginated messages + live snapshot, deduplicated
  const messages = useMemo(() => {
    const liveIds = new Set(liveMessages.map((m) => m.id));
    const unique = olderMessages.filter((m) => !liveIds.has(m.id));
    return [...unique, ...liveMessages];
  }, [liveMessages, olderMessages]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    const cursor = oldestPaginatedRef.current || oldestSnapshotRef.current;
    if (!cursor) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, MESSAGES_COLLECTION),
        orderBy("createdAt", "desc"),
        startAfter(cursor),
        limit(PAGE_SIZE),
      );
      const snapshot = await getDocs(q);

      if (snapshot.docs.length < PAGE_SIZE) {
        hasMoreRef.current = false;
      }

      if (snapshot.docs.length > 0) {
        oldestPaginatedRef.current = snapshot.docs[snapshot.docs.length - 1];
        const older = snapshot.docs.map(docToMessage).reverse();
        setOlderMessages((prev) => [...older, ...prev]);
      }
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!user || !displayName) return;
      if (text.length > MAX_MESSAGE_LENGTH) {
        throw new Error(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`);
      }

      if (editingMessage) {
        await updateDoc(doc(db, MESSAGES_COLLECTION, editingMessage.id), {
          text,
          editedAt: serverTimestamp(),
        });
        setEditingMessage(null);
      } else {
        await addDoc(collection(db, MESSAGES_COLLECTION), {
          text,
          senderId: user.uid,
          senderName: displayName,
          createdAt: serverTimestamp(),
          editedAt: null,
        });
      }
    },
    [user, displayName, editingMessage],
  );

  return {
    messages,
    loading,
    loadingMore,
    editingMessage,
    setEditingMessage,
    loadMore,
    sendMessage,
  };
}
