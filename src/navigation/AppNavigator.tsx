import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { colors, centeredContainer } from "../theme";
import DisplayNameScreen from "../screens/DisplayNameScreen";
import RoomSelectorScreen from "../screens/RoomSelectorScreen";
import ChatScreen from "../screens/ChatScreen";

export type RootStackParamList = {
  DisplayName: undefined;
  RoomSelector: undefined;
  Chat: { roomId: string; roomName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, displayName, loading } = useAuth();

  if (loading) {
    return (
      <View style={centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user && displayName ? (
          <>
            <Stack.Screen name="RoomSelector" component={RoomSelectorScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        ) : (
          <Stack.Screen name="DisplayName" component={DisplayNameScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
