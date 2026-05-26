// Route: /(onboarding)/diagnosis/step5-environment (Step5: 진단 실행)
import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDiagnosisStore, computeDiagnosisResults } from '@/store/useDiagnosisStore';
import type { Hood } from '@/store/useDiagnosisStore';

/* ─── Kakao REST API ─── */
const REST_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY ?? '';

const RADIUS_MAP: Record<string, number> = {
  '30분 이내': 5000,
  '45분 이내': 8000,
  '1시간 이내': 12000,
};

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!REST_KEY || !address.trim()) return null;
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}&size=1`,
      { headers: { Authorization: `KakaoAK ${REST_KEY}` } }
    );
    const data = await res.json() as { documents: Array<{ x: string; y: string }> };
    if (!data.documents.length) return null;
    return { lat: parseFloat(data.documents[0].y), lng: parseFloat(data.documents[0].x) };
  } catch {
    return null;
  }
}

// 지번 주소("서울 성동구 성수동1가 12-3")에서 동 이름 추출
function extractDong(address: string): string | null {
  const parts = address.split(/\s+/);
  for (let i = 0; i < parts.length - 1; i++) {
    if (/[구군]$/.test(parts[i])) {
      const next = parts[i + 1];
      if (/동\d*가?$|읍$|면$/.test(next)) return next;
    }
  }
  return null;
}

function extractGu(address: string): string | null {
  const match = address.match(/(\S+[구군])\s/);
  return match ? match[1] : null;
}

type KakaoDoc = { address_name: string; road_address_name: string; x: string; y: string };

async function fetchKeyword(query: string, lat: number, lng: number, radius: number, page: number): Promise<KakaoDoc[]> {
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&x=${lng}&y=${lat}&radius=${radius}&size=15&page=${page}&sort=distance`,
      { headers: { Authorization: `KakaoAK ${REST_KEY}` } }
    );
    const data = await res.json() as { documents: KakaoDoc[] };
    return data.documents ?? [];
  } catch {
    return [];
  }
}

async function searchNeighborhoods(lat: number, lng: number, radius: number): Promise<Hood[]> {
  // 아파트 2페이지 + 빌라 1페이지 병렬 조회 (최대 45건)
  const [apt1, apt2, villa] = await Promise.all([
    fetchKeyword('아파트', lat, lng, radius, 1),
    fetchKeyword('아파트', lat, lng, radius, 2),
    fetchKeyword('빌라', lat, lng, radius, 1),
  ]);

  // 동별 건수·좌표 집계 (지번 주소 기준)
  const dongMap = new Map<string, { gu: string; count: number; lats: number[]; lngs: number[] }>();
  for (const doc of [...apt1, ...apt2, ...villa]) {
    const address = doc.address_name;
    const dong = extractDong(address);
    if (!dong) continue;
    const gu = extractGu(address) ?? '';
    if (!dongMap.has(dong)) dongMap.set(dong, { gu, count: 0, lats: [], lngs: [] });
    const entry = dongMap.get(dong)!;
    entry.count++;
    entry.lats.push(parseFloat(doc.y));
    entry.lngs.push(parseFloat(doc.x));
  }

  const sorted = [...dongMap.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, 5);
  if (sorted.length < 2) return [];

  const maxCount = sorted[0][1].count;
  return sorted.map(([name, data], i) => {
    const centLat = data.lats.reduce((s, v) => s + v, 0) / data.lats.length;
    const centLng = data.lngs.reduce((s, v) => s + v, 0) / data.lngs.length;
    const score = Math.round(60 + (data.count / maxCount) * 35);
    return {
      rank: i + 1,
      name,
      meta: `${data.gu} · 주거 ${data.count}건 확인`,
      score,
      tier: (i === 0 ? 1 : i < 3 ? 2 : 3) as Hood['tier'],
      lat: centLat,
      lng: centLng,
      commuteMinutes: 0,
      scores: { work: Math.max(55, 95 - i * 10), life: score, safe: Math.max(60, 80 - i * 4) },
    };
  });
}

/* ─── 진행 항목 ─── */
const LABELS = [
  '직장 분석 · 워크넷 1,200건',
  '라이프 매칭 · 서울 생활인구',
  '안전 검증 · 침수·전세가율',
  '지원사업 자격 자동 판정',
];

// step: 현재 active 인덱스. step 이하 = done, step 초과 = pending
const STEP_DELAYS = [0, 800, 1700, 2600, 3500]; // 각 단계 진입 시각(ms)

function itemState(index: number, step: number): 'done' | 'active' | 'pending' {
  if (index < step) return 'done';
  if (index === step) return 'active';
  return 'pending';
}

export default function Step5EnvironmentScreen() {
  const scale = useRef(new Animated.Value(1)).current;
  const { workAddress, commuteLimit, setResults } = useDiagnosisStore();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const radius = RADIUS_MAP[commuteLimit] ?? 8000;

    setResults(computeDiagnosisResults(commuteLimit));

    geocodeAddress(workAddress).then(async (coord) => {
      if (!coord) return;
      const hoods = await searchNeighborhoods(coord.lat, coord.lng, radius);
      if (hoods.length >= 2) setResults(hoods);
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    const stepTimers = STEP_DELAYS.slice(1).map((delay, i) =>
      setTimeout(() => setStep(i + 1), delay)
    );
    const nav = setTimeout(() => router.replace('/(onboarding)/signup?from=diagnosis' as never), 4000);

    return () => { stepTimers.forEach(clearTimeout); clearTimeout(nav); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="h-9 px-[14px] flex-row items-center justify-center">
        <Text className="text-[13px] font-bold tracking-[-0.13px] text-[#0A0A0B]">진단 중</Text>
      </View>

      <View className="px-4 flex-row items-center gap-2 pt-[14px] mb-[14px]">
        <View className="flex-1 h-[3px] bg-[#10B981] rounded-full" />
        <Text className="text-[9px] font-bold text-[#71717A] tracking-[0.05em]">5 / 5</Text>
      </View>

      <View className="flex-1 px-4 pb-4 items-center justify-center gap-4">
        <Animated.View
          className="w-20 h-20 rounded-full bg-[#ECFDF5] border-2 border-[#10B981] items-center justify-center"
          style={{ transform: [{ scale }] }}
        >
          <Ionicons name="search-outline" size={32} color="#059669" />
        </Animated.View>

        <View className="items-center gap-2">
          <Text className="text-[18px] font-extrabold text-[#0A0A0B] tracking-[-0.36px] text-center">
            {'맞춤 동네를\n찾고 있어요'}
          </Text>
          <Text className="text-[13px] text-[#71717A]">평균 3~5초 소요</Text>
        </View>

        <View className="w-full gap-2.5 mt-2">
          {LABELS.map((label, i) => {
            const state = itemState(i, step);
            return (
              <View key={label} className="flex-row items-center gap-2.5">
                <View className={`w-[18px] h-[18px] rounded-full items-center justify-center ${
                  state === 'done' ? 'bg-[#10B981]'
                  : state === 'active' ? 'bg-[#ECFDF5] border border-[#10B981]'
                  : 'bg-[#E4E4E7]'
                }`}>
                  {state === 'done' && <Ionicons name="checkmark" size={10} color="white" />}
                  {state === 'active' && <View className="w-2 h-2 rounded-full bg-[#10B981]" />}
                </View>
                <Text className={`text-[12px] ${
                  state === 'done' ? 'text-[#0A0A0B] font-medium'
                  : state === 'active' ? 'text-[#059669] font-semibold'
                  : 'text-[#71717A]'
                }`}>
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
