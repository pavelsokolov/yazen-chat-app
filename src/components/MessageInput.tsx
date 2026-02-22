import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import type { Message } from "../types/Message";
import {
  colors,
  fontSize,
  spacing,
  radius,
  pressedStyle,
  buttonTextStyle,
  buttonDisabledStyle,
} from "../theme";
import { MAX_MESSAGE_LENGTH } from "../constants";

interface Props {
  onSend: (text: string) => Promise<void>;
  editingMessage: Message | null;
  onCancelEdit: () => void;
}

export default function MessageInput({ onSend, editingMessage, onCancelEdit }: Props) {
  const { isConnected } = useNetInfo();
  const [text, setText] = useState(editingMessage?.text ?? "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const offline = isConnected === false;

  function handleCancel() {
    setText("");
    onCancelEdit();
  }

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setError("");
    setSending(true);
    try {
      await onSend(trimmed);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {editingMessage && (
        <View style={styles.editBar}>
          <Text style={styles.editBarText}>Editing message</Text>
          <Pressable onPress={handleCancel}>
            {({ pressed }) => (
              <Text style={[styles.editBarCancel, pressed && pressedStyle]}>Cancel</Text>
            )}
          </Pressable>
        </View>
      )}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          editable={!sending}
          multiline
          maxLength={MAX_MESSAGE_LENGTH}
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!text.trim() || sending || offline) && buttonDisabledStyle,
            pressed && pressedStyle,
          ]}
          onPress={handleSend}
          disabled={!text.trim() || sending || offline}
        >
          {sending ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={buttonTextStyle}>{editingMessage ? "Save" : "Send"}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  error: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  editBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.editBarBg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  editBarText: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
  editBarCancel: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    fontSize: fontSize.lg,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: buttonDisabledStyle,
  buttonText: buttonTextStyle,
});
