import { useMemo, useRef } from "react";
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import type { Message } from "../types/Message";
import { colors, fontSize, spacing } from "../theme";
import MessageItem from "./MessageItem";

interface Props {
  messages: Message[];
  currentUserId: string;
  loading: boolean;
  onEdit: (message: Message) => void;
  onLoadMore: () => void;
  loadingMore: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  loading,
  onEdit,
  onLoadMore,
  loadingMore,
}: Props) {
  const listRef = useRef<FlatList<Message>>(null);

  const invertedData = useMemo(() => [...messages].reverse(), [messages]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.statusText}>Loading messages...</Text>
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>No messages yet. Say hello!</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      inverted
      data={invertedData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageItem message={item} isOwn={item.senderId === currentUserId} onEdit={onEdit} />
      )}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loadingMore} />
        ) : null
      }
      contentContainerStyle={styles.list}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
    marginTop: spacing.sm,
  },
  list: {
    paddingVertical: spacing.md,
  },
  loadingMore: {
    paddingVertical: spacing.md,
  },
});
