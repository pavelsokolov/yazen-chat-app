import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { ROOMS } from "../constants";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { colors, fontSize, spacing, radius, pressedStyle } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "RoomSelector">;

export default function RoomSelectorScreen({ navigation }: Props) {
  const { displayName, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Yazen Chat</Text>
        <View style={styles.headerRight}>
          <Text style={styles.username}>{displayName}</Text>
          <Pressable onPress={logout}>
            {({ pressed }) => (
              <Text style={[styles.leaveText, pressed && pressedStyle]}>Leave</Text>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.subtitle}>Choose a room</Text>
        {ROOMS.map((room) => (
          <Pressable
            key={room.id}
            style={({ pressed }) => [styles.roomCard, pressed && pressedStyle]}
            onPress={() => navigation.navigate("Chat", { roomId: room.id, roomName: room.name })}
          >
            <Text style={styles.roomName}>{room.name}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  title: {
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
  leaveText: {
    fontSize: fontSize.base,
    color: colors.error,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  roomCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  roomName: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.primary,
  },
});
