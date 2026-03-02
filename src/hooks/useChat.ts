import { useCallback, useEffect, useRef, useState } from "react";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import type { Message } from "../types/Message";
import { MAX_MESSAGE_LENGTH } from "../constants";
import * as messageService from "../services/messageService";

function mergeMessages(prev: Message[], incoming: Message[]): Message[] {
  const map = new Map(prev.map((m) => [m.id, m]));
  incoming.forEach((m) => map.set(m.id, m));
  return Array.from(map.values()).sort((a, b) =>
    (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
  );
}

export function useChat(roomId: string) {
  const { user, displayName } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const oldestSnapshotRef = useRef<QueryDocumentSnapshot | null>(null);
  const oldestPaginatedRef = useRef<QueryDocumentSnapshot | null>(null);

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    hasMoreRef.current = true;
    oldestSnapshotRef.current = null;
    oldestPaginatedRef.current = null;

    return messageService.subscribeToMessages(
      roomId,
      (incoming: Message[], oldestDoc: QueryDocumentSnapshot | null) => {
        setMessages((prev) => mergeMessages(prev, incoming));
        if (oldestDoc) oldestSnapshotRef.current = oldestDoc;
        setError(null);
        setLoading(false);
      },
      (err: Error) => {
        setError(err.message);
        setLoading(false);
      },
    );
  }, [roomId]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    const cursor = oldestPaginatedRef.current || oldestSnapshotRef.current;
    if (!cursor) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const result = await messageService.fetchOlderMessages(roomId, cursor);
      hasMoreRef.current = result.hasMore;
      if (result.oldestDoc) oldestPaginatedRef.current = result.oldestDoc;
      if (result.messages.length > 0) {
        setMessages((prev) => mergeMessages(prev, result.messages));
      }
    } catch (err) {
      console.warn("Failed to load more messages:", err);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [roomId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!user || !displayName) return;
      if (text.length > MAX_MESSAGE_LENGTH) {
        throw new Error(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`);
      }

      if (editingMessage) {
        await messageService.editMessage(roomId, editingMessage.id, text);
        setEditingMessage(null);
      } else {
        await messageService.createMessage(roomId, text, user.uid, displayName);
      }
    },
    [user, displayName, editingMessage, roomId],
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      await messageService.deleteMessage(roomId, messageId);
    },
    [roomId],
  );

  return {
    messages,
    error,
    loading,
    loadingMore,
    editingMessage,
    setEditingMessage,
    loadMore,
    sendMessage,
    deleteMessage,
  };
}
