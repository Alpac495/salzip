// Route: /(main)/mypage (마이페이지)
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppHeader } from '@/components/AppHeader';
import { TabBar } from '@/components/TabBar';
import { logout } from '@/api/session';
import { useSessionStore, SESSION_KEY, SESSION_EXPIRES_KEY } from '@/store/useSessionStore';

export default function MypageScreen() {
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 서버 로그아웃 실패해도 로컬 세션은 제거
    }
    await AsyncStorage.removeItem(SESSION_KEY);
    await AsyncStorage.removeItem(SESSION_EXPIRES_KEY);
    useSessionStore.getState().clearSession();
    router.replace('/(onboarding)/start' as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <AppHeader title="마이페이지" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-[13px] text-[#A1A1AA]">마이페이지 화면 준비 중</Text>
      </View>
      <View className="px-6 pb-4">
        <Pressable
          onPress={handleLogout}
          className="w-full rounded-xl py-4 items-center active:opacity-75"
          style={{ borderWidth: 1, borderColor: '#E4E4E7' }}
        >
          <Text className="text-[15px] font-bold text-[#EF4444]">로그아웃</Text>
        </Pressable>
      </View>
      <TabBar />
    </SafeAreaView>
  );
}
