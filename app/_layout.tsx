import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="login"
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="home"
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="movies/[id]"
          options={{headerShown:false}}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
