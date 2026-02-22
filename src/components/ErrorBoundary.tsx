import { View, Text, Pressable, StyleSheet } from "react-native";
import type { FallbackProps } from "react-error-boundary";
import {
  colors,
  fontSize,
  spacing,
  radius,
  pressedStyle,
  buttonTextStyle,
  centeredContainer,
} from "../theme";

export default function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>The app ran into an unexpected error.</Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && pressedStyle]}
        onPress={resetErrorBoundary}
      >
        <Text style={buttonTextStyle}>Reload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...centeredContainer,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
