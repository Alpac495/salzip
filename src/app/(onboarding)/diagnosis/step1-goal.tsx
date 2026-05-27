// Route: /(onboarding)/diagnosis/step1-goal (Step1: 직장·근무지)
import { DiagnosisShell } from '@/components/DiagnosisShell';
import { JOB_TYPES, useDiagnosisStore } from '@/store/useDiagnosisStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function Step1GoalScreen() {
  const { companyName, workAddress, jobType, setCompanyName, setWorkAddress, setJobType } =
    useDiagnosisStore();
  const canNext = companyName.trim().length > 0 && workAddress.trim().length > 0;

  return (
    <DiagnosisShell
      step={1}
      onBack={() => router.back()}
      onClose={() => router.replace('/(onboarding)/start')}
      footer={
        <Pressable
          className={`w-full rounded-xl py-4 flex-row items-center justify-center gap-2 ${canNext ? 'bg-[#0A0A0B] active:opacity-75' : 'bg-[#E4E4E7]'}`}
          onPress={() => { if (canNext) router.push('/(onboarding)/diagnosis/step2-commute'); }}
          disabled={!canNext}
        >
          <Text className={`text-base font-bold ${canNext ? 'text-white' : 'text-[#A1A1AA]'}`}>다음</Text>
          <Ionicons name="arrow-forward" size={15} color={canNext ? 'white' : '#A1A1AA'} />
        </Pressable>
      }
    >
      <Text className="text-[22px] font-extrabold leading-[1.3] tracking-[-0.44px] text-[#0A0A0B] mb-2">
        {'먼저, '}
        <Text style={{ color: '#059669' }}>회사</Text>
        {'는\n어디인가요?'}
      </Text>
      <Text className="text-[13px] leading-[1.5] text-[#71717A] mb-5">
        {'근무지 기준으로\n통근 시간을 계산해요'}
      </Text>

      <View className="flex-1 gap-3">
        <View className="gap-1.5">
          <Text className="text-[12px] font-semibold text-[#3F3F46] tracking-[0.02em]">회사명</Text>
          <View className="flex-row items-center gap-2 px-3 py-3 bg-white border border-[#E4E4E7] rounded-xl">
            <Ionicons name="business-outline" size={16} color="#A1A1AA" />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: '#18181B' }}
              placeholder="예: 카카오, 네이버"
              placeholderTextColor="#A1A1AA"
              value={companyName}
              onChangeText={setCompanyName}
              returnKeyType="next"
            />
          </View>
        </View>

        <View className="gap-1.5">
          <Text className="text-[12px] font-semibold text-[#3F3F46] tracking-[0.02em]">근무지 주소</Text>
          <View className="flex-row items-center gap-2 px-3 py-3 bg-white border border-[#E4E4E7] rounded-xl">
            <Ionicons name="location-outline" size={16} color="#A1A1AA" />
            <TextInput
              style={{ flex: 1, fontSize: 14, color: '#18181B' }}
              placeholder="예: 강남구 테헤란로 152"
              placeholderTextColor="#A1A1AA"
              value={workAddress}
              onChangeText={setWorkAddress}
              returnKeyType="done"
            />
          </View>
        </View>

        <View className="gap-1.5">
          <Text className="text-[12px] font-semibold text-[#3F3F46] tracking-[0.02em]">직종</Text>
          <View className="flex-row flex-wrap gap-2">
            {JOB_TYPES.map((job) => (
              <Pressable
                key={job}
                onPress={() => setJobType(job)}
                className={`px-3 py-[7px] rounded-full border ${
                  jobType === job ? 'bg-[#0A0A0B] border-[#0A0A0B]' : 'bg-white border-[#E4E4E7]'
                }`}
              >
                <Text className={`text-[12px] font-semibold ${jobType === job ? 'text-white' : 'text-[#3F3F46]'}`}>
                  {job}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

    </DiagnosisShell>
  );
}
