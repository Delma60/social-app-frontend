import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        
        headerShown: false,
        
        animation: 'fade', 
      }}
    >
      <Stack.Screen name="login" />
      {/* When you are ready to build a sign-up screen, it will automatically register here: */}
      <Stack.Screen name="signup" />
      <Stack.Screen name="choose-handle" />
    </Stack>
  );
}