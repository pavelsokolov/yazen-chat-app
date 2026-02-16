import { memo } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { formatDistanceToNow } from "date-fns";
import type { Message } from "../types/Message";
import { colors, fontSize, spacing, radius } from "../theme";

interface Props {
  message: Message;
  isOwn: boolean;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
}

export default memo(function MessageItem({ message, isOwn, onEdit, onDelete }: Props) {
  const time = message.createdAt
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    : "just now";

  const bubble = (
    <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
      {!isOwn && <Text style={styles.sender}>{message.senderName}</Text>}
      <Text style={[styles.text, isOwn && styles.textOwn]}>{message.text}</Text>
      <Text style={[styles.time, isOwn && styles.timeOwn]}>
        {time}
        {message.editedAt ? " (edited)" : ""}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, isOwn && styles.containerOwn]}>
      {isOwn && onEdit ? (
        <Pressable
          onLongPress={() => {
            Alert.alert("Message options", "What would you like to do?", [
              { text: "Edit", onPress: () => onEdit(message) },
              { text: "Delete", style: "destructive", onPress: () => onDelete?.(message.id) },
              { text: "Cancel", style: "cancel" },
            ]);
          }}
          style={({ pressed }) => pressed && styles.pressed}
        >
          {bubble}
        </Pressable>
      ) : (
        bubble
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  containerOwn: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "75%",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
  },
  bubbleOther: {
    backgroundColor: colors.bubbleOther,
  },
  sender: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  textOwn: {
    color: colors.white,
  },
  time: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    color: colors.textMuted,
  },
  timeOwn: {
    color: colors.ownBubbleTimeText,
  },
  pressed: {
    opacity: 0.7,
  },
});
