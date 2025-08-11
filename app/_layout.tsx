import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
         <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="currency-rates" options={{ headerShown: false }} />
        <Stack.Screen name="announcements" options={{ headerShown: false }} />
        <Stack.Screen name="faq" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
        <Stack.Screen name="update-password" options={{ headerShown: false }} />
        <Stack.Screen name="deal-details" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="BookDealScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SelectBranch" options={{ headerShown: false }} />
        <Stack.Screen name="postdeal" options={{ headerShown: false }} />
      



        <Stack.Screen name="network" options={{ headerShown: false }} />

        <Stack.Screen name="details" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
