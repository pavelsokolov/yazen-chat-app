import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../hooks/useChat";
import { colors, fontSize, spacing } from "../theme";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import OfflineBanner from "../components/OfflineBanner";

export default function ChatScreen() {
  const { user, displayName, logout } = useAuth();
  const {
    messages,
    error,
    loading,
    loadingMore,
    editingMessage,
    setEditingMessage,
    loadMore,
    sendMessage,
    deleteMessage,
  } = useChat();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Yazen Chat</Text>
          <View style={styles.headerRight}>
            <Text style={styles.username}>{displayName}</Text>
            <Pressable onPress={logout}>
              {({ pressed }) => (
                <Text style={[styles.logoutText, pressed && styles.pressed]}>Leave</Text>
              )}
            </Pressable>
          </View>
        </View>

        <OfflineBanner />

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>Failed to load messages: {error}</Text>
          </View>
        )}

        <MessageList
          messages={messages}
          currentUserId={user!.uid}
          loading={loading}
          onEdit={setEditingMessage}
          onDelete={deleteMessage}
          onLoadMore={loadMore}
          loadingMore={loadingMore}
        />
        <MessageInput
          key={editingMessage?.id ?? "new"}
          onSend={sendMessage}
          editingMessage={editingMessage}
          onCancelEdit={() => setEditingMessage(null)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  username: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  logoutText: {
    fontSize: fontSize.base,
    color: colors.error,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
  errorBanner: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  errorText: {
    color: colors.white,
    fontSize: fontSize.sm,
  },
});
