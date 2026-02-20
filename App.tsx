import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./src/components/ErrorBoundary";
import { StrictMode } from "react";

export default function App() {
  return (
    <StrictMode>
      <SafeAreaProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </StrictMode>
  );
}
