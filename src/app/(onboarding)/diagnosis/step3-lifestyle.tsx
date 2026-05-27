// Route: /(onboarding)/diagnosis/step3-lifestyle (Step3: 예산)
import { DiagnosisShell } from '@/components/DiagnosisShell';
import { useDiagnosisStore } from '@/store/useDiagnosisStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';

const DEPOSIT_MAX = 10000;
const DEPOSIT_STEP = 500;
const RENT_MAX = 100;
const RENT_STEP = 5;

function DragSlider({ value, min, max, step, onChange, label, rangeMaxLabel, displayValue }: {
  value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
  label: string; rangeMaxLabel: string; displayValue: string;
}) {
  const trackWidthRef = useRef(0);
  const startPercentRef = useRef(0);
  const percent = (value - min) / (max - min);

  const snap = (ratio: number) => {
    const clamped = Math.max(0, Math.min(1, ratio));
    return Math.max(min, Math.min(max, Math.round((min + clamped * (max - min)) / step) * step));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const ratio = evt.nativeEvent.locationX / trackWidthRef.current;
        startPercentRef.current = Math.max(0, Math.min(1, ratio));
        onChange(snap(ratio));
      },
      onPanResponderMove: (_, g) => {
        onChange(snap(startPercentRef.current + g.dx / trackWidthRef.current));
      },
    })
  ).current;

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#3F3F46' }}>{label}</Text>
        <Text style={{ fontSize: 15, fontWeight: '800', color: '#0A0A0B', letterSpacing: -0.15 }}>
          {displayValue}
        </Text>
      </View>

      {/* 터치 영역 (thumb 고려해 위아래 여유 포함) */}
      <View
        style={{ height: 28, position: 'relative' }}
        onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        {/* 트랙 */}
        <View style={{
          position: 'absolute', left: 0, right: 0, top: 11, height: 6,
          borderRadius: 3, backgroundColor: '#E4E4E7', overflow: 'hidden',
        }}>
          <View style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: `${percent * 100}%`,
            backgroundColor: '#0A0A0B', borderRadius: 3,
          }} />
        </View>

        {/* 썸 */}
        <View style={{
          position: 'absolute',
          width: 22, height: 22, borderRadius: 11,
          backgroundColor: 'white',
          borderWidth: 2.5, borderColor: '#0A0A0B',
          left: `${percent * 100}%`,
          marginLeft: -11,
          top: 3,
          shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
        }} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 10, color: '#A1A1AA' }}>0</Text>
        <Text style={{ fontSize: 10, color: '#A1A1AA' }}>{rangeMaxLabel}</Text>
      </View>
    </View>
  );
}

function HintCard({ text, active }: { text: string; active: boolean }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, borderWidth: 1,
      backgroundColor: active ? '#ECFDF5' : '#FAFAFA',
      borderColor: active ? '#D1FAE5' : '#E4E4E7',
    }}>
      <Ionicons name={active ? 'checkmark' : 'close'} size={14} color={active ? '#059669' : '#A1A1AA'} />
      <Text style={{ fontSize: 12, fontWeight: '600', flex: 1, color: active ? '#059669' : '#A1A1AA' }}>
        {text}
      </Text>
    </View>
  );
}

export default function Step3LifestyleScreen() {
  const { depositWan, monthlyRentWan, setDepositWan, setMonthlyRentWan } = useDiagnosisStore();

  const depositDisplay =
    depositWan >= 10000 ? `${depositWan / 10000}억` : `${depositWan.toLocaleString()}만`;
  const rentDisplay = `${monthlyRentWan}만`;

  return (
    <DiagnosisShell
      step={3}
      onBack={() => router.back()}
      onClose={() => router.replace('/(onboarding)/start')}
      footer={
        <Pressable
          className="w-full bg-[#0A0A0B] rounded-xl py-4 flex-row items-center justify-center gap-2 active:opacity-75"
          onPress={() => router.push('/(onboarding)/diagnosis/step4-budget')}
        >
          <Text className="text-base font-bold text-white">다음</Text>
          <Ionicons name="arrow-forward" size={15} color="white" />
        </Pressable>
      }
    >
      <Text className="text-[22px] font-extrabold leading-[1.3] tracking-[-0.44px] text-[#0A0A0B] mb-2">
        <Text style={{ color: '#059669' }}>예산</Text>
        {'은\n어느 정도인가요?'}
      </Text>
      <Text className="text-[13px] leading-[1.5] text-[#71717A] mb-5">
        {'청년 지원사업 한도와\n자동으로 매칭해드려요'}
      </Text>

      <View className="flex-1 gap-5">
        <DragSlider
          label="보증금"
          value={depositWan}
          min={0}
          max={DEPOSIT_MAX}
          step={DEPOSIT_STEP}
          onChange={setDepositWan}
          displayValue={depositDisplay}
          rangeMaxLabel="1억"
        />
        <DragSlider
          label="월세"
          value={monthlyRentWan}
          min={0}
          max={RENT_MAX}
          step={RENT_STEP}
          onChange={setMonthlyRentWan}
          displayValue={rentDisplay}
          rangeMaxLabel="100만"
        />
        <HintCard
          text={
            monthlyRentWan <= 60
              ? '청년월세 한도 충족 · 월 20만 지원 가능'
              : '청년월세 한도 초과 (월세 60만 이하 시 적용)'
          }
          active={monthlyRentWan <= 60}
        />
        <HintCard
          text={
            depositWan <= 7000
              ? '버팀목 대출 한도 7,000만 적용'
              : '버팀목 대출 한도 초과 (보증금 7,000만 이하 시 적용)'
          }
          active={depositWan <= 7000}
        />
      </View>

    </DiagnosisShell>
  );
}
