import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../theme";
import DisplayNameScreen from "../screens/DisplayNameScreen";
import ChatScreen from "../screens/ChatScreen";

export type RootStackParamList = {
  DisplayName: undefined;
  Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, displayName, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user && displayName ? (
          <Stack.Screen name="Chat" component={ChatScreen} />
        ) : (
          <Stack.Screen name="DisplayName" component={DisplayNameScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
