// Route: /(main)/hsubsidy (S07 지원사업 진단)
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TabBar } from '@/components/TabBar';

type CardKey = 'monthly' | 'jeonse';

type RuleRow = { label: string; value: string; pass: boolean };

const RULES: Record<CardKey, RuleRow[]> = {
  monthly: [
    { label: '만 나이 19~34세', value: '27세', pass: true },
    { label: '보증금 5,000만 이하', value: '3,000만', pass: true },
    { label: '월세 70만 이하', value: '60만', pass: true },
    { label: '중위소득 60% 이하 (1인)', value: '124만/월', pass: true },
    { label: '무주택 여부', value: '무주택 ✓', pass: true },
    { label: '1인 독립 가구', value: '1인 가구', pass: true },
  ],
  jeonse: [
    { label: '만 나이 19~34세', value: '27세', pass: true },
    { label: '연소득 5,000만 이하', value: '4,500만', pass: true },
    { label: '무주택 세대주', value: '무주택 ✓', pass: true },
    { label: '보증금 3억 이하', value: '3,000만', pass: true },
    { label: '주택 유형 적합', value: '빌라', pass: true },
  ],
};

type CardInfo = {
  name: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  reason: string;
  sheetPassTotal: string;
  amount: string;
  amountDetail: string;
  source: string;
};

const CARDS: Record<CardKey, CardInfo> = {
  monthly: {
    name: '청년월세 한시 특별지원',
    icon: 'cash-outline',
    reason: '나이·소득·무주택·보증금·월세 모든 조건 충족',
    sheetPassTotal: '6개 충족',
    amount: '240만원',
    amountDetail: '월 20만원 × 12개월',
    source: '출처: 국토교통부 청년월세 한시 특별지원 사업 안내 (2025)',
  },
  jeonse: {
    name: '버팀목 전세대출 (청년)',
    icon: 'home-outline',
    reason: '소득·나이·무주택·보증금 한도 충족',
    sheetPassTotal: '5개 충족',
    amount: '7,000만원',
    amountDetail: '대출 한도 · 연 1.5~2.7% 금리',
    source: '출처: 주택도시기금 버팀목 전세자금대출 안내 (2025)',
  },
};

const CARD_KEYS: CardKey[] = ['monthly', 'jeonse'];

function BenefitText({ cardKey }: { cardKey: CardKey }) {
  const base = { fontSize: 11, color: '#71717A', lineHeight: 15.4, marginBottom: 4 } as const;
  const hi = { color: '#047857', fontWeight: '700' as const };
  if (cardKey === 'monthly') return (
    <Text style={base}>월 <Text style={hi}>20만원</Text> × 12개월 = 연 <Text style={hi}>240만원</Text></Text>
  );
  return (
    <Text style={base}>한도 <Text style={hi}>7,000만원</Text> · 금리 <Text style={hi}>1.5~2.7%</Text></Text>
  );
}

function RuleModal({ cardKey, onClose }: { cardKey: CardKey; onClose: () => void }) {
  const card = CARDS[cardKey];
  const rules = RULES[cardKey];

  return (
    <>
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,10,11,0.5)', zIndex: 20 }}
        onPress={onClose}
      />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20, zIndex: 21 }}>
        <View style={{ width: 36, height: 4, backgroundColor: '#D4D4D8', borderRadius: 99, alignSelf: 'center', marginBottom: 14 }} />

        <Text style={{ fontSize: 16, fontWeight: '800', color: '#0A0A0B', letterSpacing: -0.32, marginBottom: 4 }}>{card.name}</Text>
        <Text style={{ fontSize: 11, color: '#71717A', marginBottom: 14 }}>
          박지원님 자격 자동 판정 결과 — <Text style={{ color: '#047857', fontWeight: '700' }}>{card.sheetPassTotal}</Text>
        </Text>

        <View style={{ backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#D1FAE5', borderRadius: 10, padding: 12, marginBottom: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 10, color: '#047857', fontWeight: '600', marginBottom: 2 }}>예상 수혜 금액</Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#047857', letterSpacing: -0.72 }}>{card.amount}</Text>
          <Text style={{ fontSize: 10, color: '#059669', marginTop: 2 }}>{card.amountDetail}</Text>
        </View>

        <View style={{ gap: 4 }}>
          {rules.map((rule, i) => (
            <View key={i} style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8,
              backgroundColor: rule.pass ? '#ECFDF5' : '#FEF2F2',
            }}>
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: rule.pass ? '#10B981' : '#EF4444', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ionicons name={rule.pass ? 'checkmark' : 'close'} size={10} color="white" />
              </View>
              <Text style={{ flex: 1, fontSize: 11, fontWeight: '500', color: rule.pass ? '#047857' : '#B91C1C' }}>{rule.label}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: rule.pass ? '#047857' : '#B91C1C' }}>{rule.value}</Text>
            </View>
          ))}
        </View>

        <Text style={{ marginTop: 14, fontSize: 9, color: '#A1A1AA', textAlign: 'center' }}>{card.source}</Text>
      </View>
    </>
  );
}

export default function HsubsidyScreen() {
  const [activeCard, setActiveCard] = useState<CardKey | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* AppBar */}
      <View style={{ height: 44, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.back()} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chevron-back" size={22} color="#18181B" />
        </Pressable>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#0A0A0B' }}>지원사업 진단</Text>
        <Pressable style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="information-circle-outline" size={22} color="#18181B" />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        {/* Hero */}
        <View style={{ margin: 12, borderRadius: 14, padding: 18, backgroundColor: '#0A0A0B', overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <View style={{ position: 'absolute', bottom: -20, right: -10, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(4,120,87,0.45)' }} />

          <View style={{ position: 'relative', zIndex: 1 }}>
            <View style={{ alignSelf: 'flex-start', backgroundColor: '#6EE7B7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#047857', letterSpacing: 0.4 }}>🎉 모든 자격 충족</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: 'white', letterSpacing: -0.5, lineHeight: 28, marginBottom: 4 }}>{'박지원님, 2가지\n지원을 받을 수 있어요!'}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 18 }}>청년월세 + 버팀목 전세대출 모두 가능합니다</Text>

            <View style={{ flexDirection: 'row', gap: 20, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' }}>
              {[
                { value: '2종', label: '자격 충족' },
                { value: '연 240만', label: '예상 수혜' },
                { value: '7,000만', label: '대출 한도' },
              ].map(stat => (
                <View key={stat.label}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: 'white', letterSpacing: -0.6 }}>{stat.value}</Text>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Section header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#0A0A0B' }}>자격 진단 결과</Text>
          <Text style={{ fontSize: 11, color: '#71717A' }}>2 / 2 가능</Text>
        </View>

        {/* Eligibility cards */}
        <View style={{ paddingHorizontal: 16, gap: 8, paddingBottom: 16 }}>
          {CARD_KEYS.map(key => {
            const card = CARDS[key];
            return (
              <View
                key={key}
                style={{
                  borderRadius: 12, backgroundColor: 'white',
                  borderWidth: 1, borderColor: '#E4E4E7',
                  borderLeftWidth: 4, borderLeftColor: '#10B981',
                  overflow: 'hidden', flexDirection: 'row',
                }}
              >
                {/* 자격 정보 영역 — 탭하면 상세 모달 */}
                <Pressable
                  onPress={() => setActiveCard(key)}
                  style={{ flex: 1, padding: 14, gap: 12, flexDirection: 'row' }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Ionicons name={card.icon} size={20} color="#047857" />
                  </View>

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A0A0B', letterSpacing: -0.13, flex: 1, marginRight: 8 }} numberOfLines={1}>{card.name}</Text>
                      <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: '#047857', letterSpacing: 0.36 }}>✓ 가능</Text>
                      </View>
                    </View>
                    <BenefitText cardKey={key} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#ECFDF5' }}>
                      <Ionicons name="checkmark" size={12} color="#047857" />
                      <Text style={{ fontSize: 10, color: '#047857', flex: 1, lineHeight: 14 }}>{card.reason}</Text>
                    </View>
                  </View>
                </Pressable>

                {/* 로드맵 이동 — 티켓 stub */}
                <Pressable
                  onPress={() => router.push({ pathname: '/(main)/hsubsidy/apply', params: { policy: key } } as never)}
                  style={{ width: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981' }}
                >
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TabBar />

      {activeCard && <RuleModal cardKey={activeCard} onClose={() => setActiveCard(null)} />}
    </SafeAreaView>
  );
}
