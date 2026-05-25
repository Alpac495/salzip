// Route: _layout (루트 - 테마 프로바이더 + Stack)
import '../../global.css';
import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSession } from '@/api/session';
import { useSessionStore, SESSION_KEY, SESSION_EXPIRES_KEY } from '@/store/useSessionStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { setSession, isExpired } = useSessionStore();

  useEffect(() => {
    async function initSession() {
      const token = await AsyncStorage.getItem(SESSION_KEY);
      const expiresAt = await AsyncStorage.getItem(SESSION_EXPIRES_KEY);

      if (token && expiresAt && new Date(expiresAt) > new Date()) {
        setSession(token, expiresAt);
        console.log('[Session] 기존 토큰 사용:', token, '만료:', expiresAt);
        return;
      }

      const session = await createSession();
      await AsyncStorage.setItem(SESSION_KEY, session.token);
      await AsyncStorage.setItem(SESSION_EXPIRES_KEY, session.expires_at);
      setSession(session.token, session.expires_at);
      console.log('[Session] 신규 발급:', session.token, '만료:', session.expires_at);
    }

    initSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
