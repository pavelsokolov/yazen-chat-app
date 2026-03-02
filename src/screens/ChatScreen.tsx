import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../hooks/useChat";
import { colors, fontSize, spacing, pressedStyle } from "../theme";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import OfflineBanner from "../components/OfflineBanner";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ route, navigation }: Props) {
  const { roomId, roomName } = route.params;
  const { user, displayName } = useAuth();
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
  } = useChat(roomId);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => navigation.goBack()}>
              {({ pressed }) => (
                <Text style={[styles.backText, pressed && pressedStyle]}>← Rooms</Text>
              )}
            </Pressable>
            <Text style={styles.headerTitle}>{roomName}</Text>
          </View>
          <Text style={styles.username}>{displayName}</Text>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  backText: {
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.primary,
  },
  username: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
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
