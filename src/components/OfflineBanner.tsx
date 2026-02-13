import { View, Text, StyleSheet } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { colors, fontSize, spacing } from "../theme";

export default function OfflineBanner() {
  const { isConnected } = useNetInfo();

  if (isConnected !== false) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You're offline — messages will send when you reconnect</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.textMuted,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
});
