import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { colors, fontSize, spacing, radius } from "../theme";
import { MAX_DISPLAY_NAME_LENGTH } from "../constants";

export default function DisplayNameScreen() {
  const { setDisplayName } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a display name");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await setDisplayName(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Yazen Chat</Text>
        <Text style={styles.subtitle}>Choose a display name to get started</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!loading}
          maxLength={MAX_DISPLAY_NAME_LENGTH}
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!name.trim() || loading) && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}
          onPress={handleJoin}
          disabled={!name.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Join Chat</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  error: {
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.lg,
    fontSize: fontSize.base,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radius.sm,
    padding: 14,
    fontSize: fontSize.lg,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    padding: 14,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
});
