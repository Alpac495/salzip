// Route: /(onboarding)/signup
import { useState } from 'react';
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signup } from '@/api/session';
import { useSessionStore, SESSION_KEY, SESSION_EXPIRES_KEY } from '@/store/useSessionStore';

type Field = 'name' | 'email' | 'password' | 'confirm';

function validate(name: string, email: string, password: string, confirm: string): string {
  if (!name.trim()) return '이름을 입력해주세요.';
  if (!email.trim() || !email.includes('@')) return '올바른 이메일을 입력해주세요.';
  if (password.length < 8) return '비밀번호는 8자 이상이어야 해요.';
  if (password !== confirm) return '비밀번호가 일치하지 않아요.';
  return '';
}

export default function SignupScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const nextRoute = from === 'diagnosis'
    ? '/(onboarding)/diagnosis/complete'
    : '/(main)/hsubsidy';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focused, setFocused] = useState<Field | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError('');
    const msg = validate(name, email, password, confirm);
    if (msg) { setError(msg); return; }
    if (!agreed) { setError('서비스 이용약관에 동의해주세요.'); return; }
    setLoading(true);
    try {
      const { token, expires_at } = await signup(name.trim(), email.trim(), password);
      if (!token || !expires_at) throw new Error('invalid_response');
      await AsyncStorage.setItem(SESSION_KEY, token);
      await AsyncStorage.setItem(SESSION_EXPIRES_KEY, expires_at);
      useSessionStore.getState().setSession(token, expires_at);
      router.replace(nextRoute as never);
    } catch {
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있어요.');
    } finally {
      setLoading(false);
    }
  };

  const border = (field: Field) => ({
    borderColor: focused === field ? '#0A0A0B' : '#E4E4E7',
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pb-8">

            {/* 뒤로가기 */}
            <Pressable
              onPress={() => router.back()}
              className="mt-4 mb-8 w-9 h-9 items-center justify-center -ml-1 active:opacity-60"
            >
              <Ionicons name="arrow-back" size={22} color="#0A0A0B" />
            </Pressable>

            {/* 타이틀 */}
            <Text className="text-[28px] font-extrabold tracking-[-0.56px] text-[#0A0A0B] mb-1">
              계정 만들기
            </Text>
            <Text className="text-[14px] text-[#71717A] mb-8">
              살집 고민, 지금 시작해볼까요?
            </Text>

            {/* 입력 폼 */}
            <View className="gap-3 mb-4">

              {/* 이름 */}
              <View>
                <Text className="text-[11px] font-semibold text-[#3F3F46] mb-1.5">이름</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  placeholder="이름을 입력하세요"
                  placeholderTextColor="#A1A1AA"
                  autoCorrect={false}
                  style={{
                    borderWidth: 1, borderRadius: 12, paddingHorizontal: 16,
                    paddingVertical: 14, fontSize: 14, color: '#0A0A0B',
                    ...border('name'),
                  }}
                />
              </View>

              {/* 이메일 */}
              <View>
                <Text className="text-[11px] font-semibold text-[#3F3F46] mb-1.5">이메일</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="이메일을 입력하세요"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    borderWidth: 1, borderRadius: 12, paddingHorizontal: 16,
                    paddingVertical: 14, fontSize: 14, color: '#0A0A0B',
                    ...border('email'),
                  }}
                />
              </View>

              {/* 비밀번호 */}
              <View>
                <Text className="text-[11px] font-semibold text-[#3F3F46] mb-1.5">
                  비밀번호
                  <Text className="text-[#A1A1AA] font-normal"> (8자 이상)</Text>
                </Text>
                <View style={{
                  borderWidth: 1, borderRadius: 12, paddingHorizontal: 16,
                  flexDirection: 'row', alignItems: 'center', ...border('password'),
                }}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="비밀번호를 입력하세요"
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showPw}
                    textContentType="none"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1, paddingVertical: 14, fontSize: 14, color: '#0A0A0B' }}
                  />
                  <Pressable onPress={() => setShowPw((v) => !v)} className="pl-2 active:opacity-60">
                    <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color="#A1A1AA" />
                  </Pressable>
                </View>
              </View>

              {/* 비밀번호 확인 */}
              <View>
                <Text className="text-[11px] font-semibold text-[#3F3F46] mb-1.5">비밀번호 확인</Text>
                <View style={{
                  borderWidth: 1, borderRadius: 12, paddingHorizontal: 16,
                  flexDirection: 'row', alignItems: 'center', ...border('confirm'),
                }}>
                  <TextInput
                    value={confirm}
                    onChangeText={setConfirm}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused(null)}
                    placeholder="비밀번호를 다시 입력하세요"
                    placeholderTextColor="#A1A1AA"
                    secureTextEntry={!showConfirm}
                    textContentType="none"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ flex: 1, paddingVertical: 14, fontSize: 14, color: '#0A0A0B' }}
                  />
                  <Pressable onPress={() => setShowConfirm((v) => !v)} className="pl-2 active:opacity-60">
                    <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color="#A1A1AA" />
                  </Pressable>
                </View>
                {confirm.length > 0 && password !== confirm && (
                  <Text className="text-[11px] text-[#EF4444] mt-1">비밀번호가 일치하지 않아요.</Text>
                )}
              </View>
            </View>

            {/* 약관 동의 */}
            <Pressable
              onPress={() => setAgreed((v) => !v)}
              className="flex-row items-start gap-2.5 mb-6 active:opacity-70"
            >
              <View style={{
                width: 20, height: 20, borderRadius: 6, marginTop: 1,
                backgroundColor: agreed ? '#0A0A0B' : 'white',
                borderWidth: 1.5, borderColor: agreed ? '#0A0A0B' : '#D4D4D8',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {agreed && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <View className="flex-1">
                <Text className="text-[13px] text-[#18181B] leading-[1.5]">
                  <Text className="font-semibold">서비스 이용약관</Text>
                  <Text className="text-[#71717A]"> 및 </Text>
                  <Text className="font-semibold">개인정보 처리방침</Text>
                  <Text className="text-[#71717A]">에 동의합니다.</Text>
                </Text>
              </View>
            </Pressable>

            {/* 에러 */}
            {!!error && (
              <View className="flex-row items-center gap-1.5 mb-3 px-3 py-2.5 bg-[#FEF2F2] rounded-lg">
                <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                <Text className="text-[12px] text-[#EF4444] flex-1">{error}</Text>
              </View>
            )}

            {/* 가입 버튼 */}
            <Pressable
              onPress={handleSignup}
              disabled={loading}
              className="w-full bg-[#0A0A0B] rounded-xl py-4 items-center active:opacity-75 mb-6"
            >
              {loading
                ? <ActivityIndicator size="small" color="white" />
                : <Text className="text-white text-[15px] font-bold">가입하기</Text>
              }
            </Pressable>

            {/* 로그인 링크 */}
            <View className="flex-row items-center justify-center gap-1">
              <Text className="text-[13px] text-[#71717A]">이미 계정이 있으신가요?</Text>
              <Pressable
                onPress={() => router.replace('/(onboarding)/login' as never)}
                className="active:opacity-60"
              >
                <Text className="text-[13px] font-bold text-[#0A0A0B]">로그인</Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
