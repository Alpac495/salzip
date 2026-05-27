import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ProfileHero } from '@/components/profile/ProfileHero';
import { DiagnoseCard } from '@/components/profile/DiagnoseCard';
import { ActiveApplicationCard } from '@/components/profile/ActiveApplicationCard';
import { SavedTabs, type SavedTabKey } from '@/components/profile/SavedTabs';
import { SavedListingItem } from '@/components/profile/SavedListingItem';
import { SectionHeader, MenuItem } from '@/components/profile/MenuItem';
import { TabBar } from '@/components/TabBar';
import { logout } from '@/api/session';
import { useSessionStore, SESSION_KEY, SESSION_EXPIRES_KEY } from '@/store/useSessionStore';

import {
  MOCK_PROFILE,
  MOCK_STATS,
  MOCK_DIAGNOSE,
  MOCK_ACTIVE_APPLICATION,
  MOCK_SAVED_LISTINGS,
} from '@/constants/mypageMock';

export function MyPageScreen() {
  const [savedTab, setSavedTab] = useState<SavedTabKey>('listing');

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 서버 로그아웃 실패해도 로컬 세션 제거
    }
    await AsyncStorage.removeItem(SESSION_KEY);
    await AsyncStorage.removeItem(SESSION_EXPIRES_KEY);
    useSessionStore.getState().clearSession();
    router.replace('/(onboarding)/start' as never);
  };

  const noop = () => {
    // TODO: 라우팅 연결
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* AppBar */}
      <View className="flex-row items-center justify-between px-6 pb-3 pt-4">
        <Text className="text-2xl font-extrabold text-neutral-900">마이</Text>
        <Pressable onPress={noop} className="h-9 w-9 items-center justify-center">
          <Ionicons name="settings-outline" size={22} color="#0A0A0B" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-6"
      >
        {/* 1. 프로필 히어로 */}
        <ProfileHero profile={MOCK_PROFILE} stats={MOCK_STATS} onPressEdit={noop} />

        {/* 2. 재진단 카드 */}
        <DiagnoseCard
          daysAgo={MOCK_DIAGNOSE.lastDiagnoseDaysAgo}
          onPress={noop}
        />

        {/* 3. 진행 중 신청 */}
        <View className="mt-6 px-6">
          <SectionHeader title="진행 중 신청" action="전체 보기" onPressAction={noop} />
        </View>
        <View className="mx-5">
          <ActiveApplicationCard application={MOCK_ACTIVE_APPLICATION} />
        </View>

        {/* 4. 저장한 항목 */}
        <View className="mt-6 px-6">
          <SectionHeader title="저장한 항목" action="정렬 · 관리" onPressAction={noop} />
          <SavedTabs
            active={savedTab}
            listingCount={MOCK_STATS.savedListings}
            neighborhoodCount={MOCK_STATS.savedNeighborhoods}
            onChange={setSavedTab}
          />
        </View>
        <View className="mx-5 gap-2.5">
          {savedTab === 'listing' &&
            MOCK_SAVED_LISTINGS.map((listing) => (
              <SavedListingItem
                key={listing.id}
                listing={listing}
                onPress={noop}
              />
            ))}
          {savedTab === 'neighborhood' && (
            <View className="items-center rounded-xl bg-white py-10">
              <Text className="text-sm text-neutral-400">저장한 동네가 없어요</Text>
            </View>
          )}
        </View>

        {/* 5. 설정 메뉴 */}
        <View className="mt-6 px-6">
          <SectionHeader title="설정" />
        </View>
        <View className="mx-5 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <MenuItem
            iconName="notifications-outline"
            title="알림 설정"
            desc="신청 단계 알림 · 마감 임박 · 마케팅"
            onPress={noop}
          />
          <MenuItem
            iconName="moon-outline"
            title="화면 모드"
            desc="시스템 기본"
            onPress={noop}
          />
          <MenuItem
            iconName="lock-closed-outline"
            title="계정 · 보안"
            desc="이메일·비밀번호·로그인 기기"
            onPress={noop}
          />
          <MenuItem
            iconName="document-text-outline"
            title="내 데이터 관리"
            desc="진단 내역·저장 항목 다운로드 / 삭제"
            onPress={noop}
          />
          <MenuItem
            iconName="help-circle-outline"
            title="고객센터 · 도움말"
            desc="자주 묻는 질문 · 문의하기"
            onPress={noop}
          />
          <MenuItem
            iconName="information-circle-outline"
            title="약관 · 정책"
            desc="이용약관 · 개인정보처리방침"
            onPress={noop}
            isLast
          />
        </View>

        {/* 로그아웃 */}
        <Pressable
          onPress={handleLogout}
          className="mx-5 mt-4 items-center rounded-xl bg-neutral-100 py-3.5"
        >
          <Text className="text-sm font-semibold text-neutral-500">로그아웃</Text>
        </Pressable>

        {/* 푸터 */}
        <View className="items-center px-6 py-6">
          <Text className="text-[11px] text-neutral-400">Salzip v0.1.0</Text>
          <Text className="mt-1 text-[11px] text-neutral-400">
            © 2026 Salzip Team
          </Text>
        </View>
      </ScrollView>

      <TabBar />
    </SafeAreaView>
  );
}
