// Route: /listing/[id] (S06: 매물 상세 + S06-1 위험도 모달)
import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { listingDetailImages } from '@/constants/listingImages';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { Ionicons } from '@expo/vector-icons';

/* ─── 타입 & 색상 시스템 ─── */
type RiskLevel = 'safe' | 'warn' | 'danger';

const RISK = {
  safe:   { bg: '#ECFDF5', border: '#D1FAE5', ring: '#10B981', accent: '#047857', label: '안전 등급', tag: '안전' },
  warn:   { bg: '#FFFBEB', border: '#FEF3C7', ring: '#F59E0B', accent: '#B45309', label: '주의 등급', tag: '주의' },
  danger: { bg: '#FEF2F2', border: '#FEE2E2', ring: '#EF4444', accent: '#B91C1C', label: '위험 등급', tag: '위험' },
};

const CTA = {
  safe:   { bg: '#0A0A0B', text: '지원사업 자격 보기', icon: 'arrow-forward' as const },
  warn:   { bg: '#B45309', text: '위험 주의 매물 — 지원사업 자격 보기', icon: 'arrow-forward' as const },
  danger: { bg: '#B91C1C', text: '위험 매물 — 계약 전 반드시 확인', icon: 'warning-outline' as const },
};

/* ─── 데이터 ─── */
type EvidenceItem = { label: string; value: string; badge: string; level: RiskLevel; icon: keyof typeof Ionicons.glyphMap };
type FactorCard   = { name: string; weight: string; data: string; source: string; score: number; level: RiskLevel };
type MetaTag      = { text: string; highlighted?: boolean; level?: RiskLevel };

type Detail = {
  title: string;
  priceLabel: string;
  area: string; kind: string;
  riskPct: number; riskLevel: RiskLevel;
  riskDesc: string;
  metaTags: MetaTag[];
  evidence: EvidenceItem[];
  factors: FactorCard[];
};

const DETAILS: Record<string, Detail> = {
  '1': {
    title: '성수동 빌라 · 2층', priceLabel: '보증 3,000만 / 월 60만',
    area: '33㎡ (10평)', kind: '원룸',
    riskPct: 12, riskLevel: 'safe',
    riskDesc: '전세가율 65% · 침수이력 0건 · HUG 가능',
    metaTags: [{ text: '33㎡ (10평)' }, { text: '원룸' }, { text: '2025년 리모델링' }],
    evidence: [
      { label: '전세가율',   value: '65%',    badge: '안전', level: 'safe',   icon: 'cash-outline' },
      { label: '유형 사고율', value: '2.1%',   badge: '안전', level: 'safe',   icon: 'shield-outline' },
      { label: '침수 이력',  value: '없음',    badge: '0건',  level: 'safe',   icon: 'water-outline' },
      { label: 'HUG 보증',  value: '가입 가능', badge: '가능', level: 'safe',   icon: 'checkmark-circle-outline' },
    ],
    factors: [
      { name: '전세가율',    weight: '가중 40%', data: '매매 4,600만 대비 전세 3,000만 = 65%', source: '국토부 실거래가 (최근 6개월)', score: 100, level: 'safe' },
      { name: '유형 사고율', weight: '가중 20%', data: '빌라·다세대 전세사기 사고율 2.1% (성동구 평균)', source: 'HUG 보증사고 통계', score: 90, level: 'safe' },
      { name: '침수 이력',   weight: '가중 20%', data: '최근 10년 침수 흔적 0건 · 침수예상 구역 해당 없음', source: '행안부 침수흔적도 + 침수예상도', score: 100, level: 'safe' },
      { name: 'HUG 보증 가입', weight: '가중 20%', data: '전세가율 90% 이하 + 주택 유형 충족 → 가입 가능', source: 'HUG 전세보증금 반환보증 기준', score: 80, level: 'safe' },
    ],
  },
  '3': {
    title: '신림동 다세대 · 반지하', priceLabel: '전세 8,000만',
    area: '43㎡ (13평)', kind: '투룸',
    riskPct: 45, riskLevel: 'warn',
    riskDesc: '전세가율 82% · 침수이력 1건 · HUG 조건부',
    metaTags: [{ text: '43㎡ (13평)' }, { text: '투룸' }, { text: '반지하', highlighted: true, level: 'warn' }],
    evidence: [
      { label: '전세가율',   value: '82%',    badge: '주의',  level: 'warn',   icon: 'cash-outline' },
      { label: '유형 사고율', value: '8.4%',   badge: '주의',  level: 'warn',   icon: 'shield-outline' },
      { label: '침수 이력',  value: '2022년',  badge: '1건',   level: 'warn',   icon: 'water-outline' },
      { label: 'HUG 보증',  value: '심사 필요', badge: '조건부', level: 'warn',   icon: 'alert-circle-outline' },
    ],
    factors: [
      { name: '전세가율',    weight: '가중 40%', data: '매매 9,800만 대비 전세 8,000만 = 82%', source: '국토부 실거래가 (최근 6개월)', score: 45, level: 'warn' },
      { name: '유형 사고율', weight: '가중 20%', data: '다세대 전세사기 사고율 8.4% (관악구 평균)', source: 'HUG 보증사고 통계', score: 55, level: 'warn' },
      { name: '침수 이력',   weight: '가중 20%', data: '최근 10년 침수 흔적 1건 · 2022년 기록', source: '행안부 침수흔적도', score: 50, level: 'warn' },
      { name: 'HUG 보증 가입', weight: '가중 20%', data: '전세가율 90% 미만이나 반지하로 심사 필요', source: 'HUG 전세보증금 반환보증 기준', score: 55, level: 'warn' },
    ],
  },
  '4': {
    title: '봉천동 원룸 · 1층', priceLabel: '전세 12,000만',
    area: '26㎡ (8평)', kind: '원룸',
    riskPct: 78, riskLevel: 'danger',
    riskDesc: '전세가율 95% · 사고율 12% · 침수 3건',
    metaTags: [{ text: '26㎡ (8평)' }, { text: '원룸' }, { text: '⚠ 고위험', highlighted: true, level: 'danger' }],
    evidence: [
      { label: '전세가율',   value: '95%',    badge: '위험', level: 'danger', icon: 'cash-outline' },
      { label: '유형 사고율', value: '12.3%',  badge: '위험', level: 'danger', icon: 'shield-outline' },
      { label: '침수 이력',  value: '2020·22·23', badge: '3건', level: 'danger', icon: 'water-outline' },
      { label: 'HUG 보증',  value: '가입 불가',  badge: '불가', level: 'danger', icon: 'close-circle-outline' },
    ],
    factors: [
      { name: '전세가율',    weight: '가중 40%', data: '매매 1.26억 대비 전세 1.2억 = 95%', source: '국토부 실거래가 (최근 6개월)', score: 5, level: 'danger' },
      { name: '유형 사고율', weight: '가중 20%', data: '원룸·고시원 전세사기 사고율 12.3% (관악구)', source: 'HUG 보증사고 통계', score: 15, level: 'danger' },
      { name: '침수 이력',   weight: '가중 20%', data: '최근 10년 침수 흔적 3건 · 2020·22·23년', source: '행안부 침수흔적도 + 침수예상도', score: 10, level: 'danger' },
      { name: 'HUG 보증 가입', weight: '가중 20%', data: '전세가율 90% 초과 → 보증 가입 불가', source: 'HUG 전세보증금 반환보증 기준', score: 0, level: 'danger' },
    ],
  },
};

const DEFAULT_ID = '1';

/* ─── 서브 컴포넌트 ─── */

function RiskCircle({ pct, level, size = 52 }: { pct: number; level: RiskLevel; size?: number }) {
  const r = RISK[level];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2,
      borderWidth: size * 0.1, borderColor: r.ring,
      backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ fontSize: size * 0.26, fontWeight: '800', color: r.accent, letterSpacing: -0.5 }}>
        {pct}%
      </Text>
    </View>
  );
}

function EvidenceGrid({ items }: { items: EvidenceItem[] }) {
  return (
    <View style={{ marginHorizontal: 16, marginTop: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#0A0A0B', marginBottom: 8 }}>산출 근거 4종</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {items.map((item) => {
          const r = RISK[item.level];
          return (
            <View key={item.label} style={{ width: '47.5%', backgroundColor: '#FAFAFA',
              borderWidth: 1, borderColor: '#F4F4F5', borderRadius: 10, padding: 10, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: r.bg,
                  alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={item.icon} size={13} color={r.accent} />
                </View>
                <View style={{ backgroundColor: r.bg, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: r.accent }}>{item.badge}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 10, color: '#71717A', fontWeight: '500' }}>{item.label}</Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: item.level === 'danger' ? r.accent : '#0A0A0B',
                letterSpacing: -0.3 }}>{item.value}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ─── RiskModal (S06-1) ─── */
function RiskModal({ detail, onClose }: { detail: Detail; onClose: () => void }) {
  const r = RISK[detail.riskLevel];
  const gradeLegend = [
    { label: '0~30% 안전', bg: '#D1FAE5', text: '#047857' },
    { label: '31~60% 주의', bg: '#FEF3C7', text: '#B45309' },
    { label: '61%+ 위험', bg: '#FEE2E2', text: '#B91C1C' },
  ];

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(10,10,11,0.5)' }} onPress={onClose} />
      <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        maxHeight: '85%', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 12 }}>
        {/* 핸들 */}
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#D4D4D8',
          alignSelf: 'center', marginTop: 10, marginBottom: 6 }} />

        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          {/* 히어로 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14,
            borderBottomWidth: 1, borderBottomColor: '#F4F4F5', marginBottom: 14 }}>
            <RiskCircle pct={detail.riskPct} level={detail.riskLevel} size={64} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0A0A0B', letterSpacing: -0.36, marginBottom: 4 }}>
                깡통전세 위험도
              </Text>
              <View style={{ backgroundColor: r.bg, alignSelf: 'flex-start',
                paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4, marginBottom: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: r.accent, letterSpacing: 0.4 }}>
                  {r.label}
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: '#71717A' }}>{detail.title} · {detail.priceLabel}</Text>
            </View>
          </View>

          {/* 팩터 카드 4종 */}
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#71717A', letterSpacing: 0.8,
            textTransform: 'uppercase', marginBottom: 10 }}>산출 근거 4종</Text>
          <View style={{ gap: 6 }}>
            {detail.factors.map((f) => {
              const fr = RISK[f.level];
              const leftBorderColor = { safe: '#10B981', warn: '#F59E0B', danger: '#EF4444' }[f.level];
              return (
                <View key={f.name} style={{ borderWidth: 1, borderColor: '#E4E4E7', borderRadius: 10,
                  borderLeftWidth: 3, borderLeftColor: leftBorderColor,
                  paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#0A0A0B' }}>{f.name}</Text>
                      <Text style={{ fontSize: 9, color: '#71717A', fontFamily: 'Courier' }}>{f.weight}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: '#71717A', lineHeight: 16 }}>{f.data}</Text>
                    <Text style={{ fontSize: 8, color: '#A1A1AA', marginTop: 2 }}>출처: {f.source}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: fr.accent, minWidth: 36, textAlign: 'right' }}>
                    {f.score}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* 등급 범례 */}
          <View style={{ flexDirection: 'row', borderRadius: 8, overflow: 'hidden', marginTop: 14 }}>
            {gradeLegend.map(({ label, bg, text }) => (
              <View key={label} style={{ flex: 1, backgroundColor: bg, padding: 6, alignItems: 'center' }}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: text }}>{label}</Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 10, fontWeight: '700', color: r.accent, marginTop: 4, paddingLeft: 4 }}>
            ▲ 현재 {detail.riskPct}%
          </Text>

          {/* 알고리즘 링크 */}
          <View style={{ alignItems: 'center', marginTop: 14 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#047857',
              borderBottomWidth: 1, borderBottomColor: '#A7F3D0', paddingBottom: 1 }}>
              이 알고리즘은 어떻게 계산되나요? →
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

/* ─── Main Screen ─── */
export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = DETAILS[id ?? DEFAULT_ID] ?? DETAILS[DEFAULT_ID];
  const r = RISK[detail.riskLevel];
  const cta = CTA[detail.riskLevel];

  const saved = useFavoriteStore((s) => (id ? s.ids.has(id) : false));
  const toggleFav = useFavoriteStore((s) => s.toggle);
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* 앱 바 */}
      <View style={{ height: 44, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.back()}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chevron-back" size={22} color="#0A0A0B" />
        </Pressable>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A0A0B' }}>매물 상세</Text>
        <View style={{ flexDirection: 'row', gap: 0 }}>
          <Pressable style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="share-outline" size={20} color="#18181B" />
          </Pressable>
          <Pressable onPress={() => id && toggleFav(id)}
            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#EF4444' : '#18181B'} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* 사진 영역 */}
        <View style={{ height: 200, position: 'relative' }}>
          <Image
            source={listingDetailImages(id ?? DEFAULT_ID)[0]}
            style={{ width: '100%', height: 200 }}
            resizeMode="cover"
          />
          {/* 페이지 도트 */}
          <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            {listingDetailImages(id ?? DEFAULT_ID).map((_, i) => (
              <View key={i} style={{ height: 5, borderRadius: 3,
                width: i === 0 ? 14 : 5,
                backgroundColor: i === 0 ? 'white' : 'rgba(255,255,255,0.5)' }} />
            ))}
          </View>
        </View>

        {/* 매물 정보 */}
        <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#0A0A0B', letterSpacing: -0.32, marginBottom: 4 }}>
            {detail.title}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#18181B', marginBottom: 8 }}>
            {detail.priceLabel}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
            {detail.metaTags.map(({ text, highlighted, level }) => {
              const tagR = level ? RISK[level] : null;
              return (
                <View key={text} style={{
                  backgroundColor: tagR ? tagR.bg : '#FAFAFA',
                  borderWidth: 1,
                  borderColor: tagR ? tagR.border : '#F4F4F5',
                  paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                  <Text style={{ fontSize: 10, fontWeight: highlighted ? '700' : '500',
                    color: tagR ? tagR.accent : '#3F3F46' }}>{text}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 위험도 카드 (탭 → 모달) */}
        <Pressable onPress={() => setShowModal(true)}
          style={{ marginHorizontal: 16, marginTop: 14, borderRadius: 12,
            backgroundColor: r.bg, borderWidth: 1, borderColor: r.border,
            flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 }}>
          <RiskCircle pct={detail.riskPct} level={detail.riskLevel} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: r.accent, letterSpacing: 0.5, marginBottom: 2 }}>
              깡통전세 위험도
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#0A0A0B', marginBottom: 2 }}>
              {r.label}
            </Text>
            <Text style={{ fontSize: 11, color: '#71717A' }}>{detail.riskDesc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={r.accent} />
        </Pressable>

        {/* 산출 근거 4종 */}
        <EvidenceGrid items={detail.evidence} />

        {/* 하단 여백 (CTA 높이만큼) */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 고정 CTA */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16,
        borderTopWidth: 1, borderTopColor: '#F4F4F5', backgroundColor: 'white' }}>
        <Pressable style={{ backgroundColor: cta.bg, borderRadius: 12, paddingVertical: 14,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>{cta.text}</Text>
          <Ionicons name={cta.icon} size={14} color="white" />
        </Pressable>
      </View>

      {/* S06-1 위험도 모달 */}
      {showModal && <RiskModal detail={detail} onClose={() => setShowModal(false)} />}
    </SafeAreaView>
  );
}
