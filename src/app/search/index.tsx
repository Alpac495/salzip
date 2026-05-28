// Route: /(main)/search (S05: 매물 리스트)
import { TabBar } from '@/components/TabBar';
import { LISTING_THUMBNAIL } from '@/constants/listingImages';
import { useDiagnosisStore } from '@/store/useDiagnosisStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* ─── 타입 ─── */
type BadgeVariant = 'safe' | 'mid' | 'danger' | 'hug' | 'budget';

type Listing = {
  id: string;
  kind: string;
  isNew: boolean;
  isSaved: boolean;
  isRecommended: boolean;
  matchPct?: number;
  deposit: string;
  monthly: string;
  area: string;
  commute: string;
  floor: string;
  photoCount: number;
  badges: { variant: BadgeVariant; label: string }[];
};

/* ─── 샘플 데이터 ─── */
const LISTINGS: Listing[] = [
  {
    id: '1', kind: '빌라 · 302호', isNew: true, isSaved: true, isRecommended: true, matchPct: 96,
    deposit: '2,800만', monthly: '58만', area: '15평', commute: '32분', floor: '2층', photoCount: 12,
    badges: [{ variant: 'safe', label: '안전 8%' }, { variant: 'hug', label: 'HUG 가능' }, { variant: 'budget', label: '예산 내' }],
  },
  {
    id: '2', kind: '오피스텔 · 905호', isNew: false, isSaved: false, isRecommended: false,
    deposit: '3,000만', monthly: '60만', area: '12평', commute: '28분', floor: '9층', photoCount: 8,
    badges: [{ variant: 'safe', label: '안전 15%' }, { variant: 'hug', label: 'HUG 가능' }],
  },
  {
    id: '3', kind: '다세대 · 201호', isNew: true, isSaved: true, isRecommended: false,
    deposit: '3,000만', monthly: '55만', area: '14평', commute: '38분', floor: '1층', photoCount: 6,
    badges: [{ variant: 'mid', label: '주의 42%' }, { variant: 'hug', label: 'HUG 가능' }],
  },
  {
    id: '4', kind: '빌라 · 401호', isNew: false, isSaved: false, isRecommended: false,
    deposit: '2,500만', monthly: '65만', area: '16평', commute: '35분', floor: '4층', photoCount: 15,
    badges: [{ variant: 'danger', label: '위험 78%' }],
  },
  {
    id: '5', kind: '오피스텔 · 503호', isNew: false, isSaved: false, isRecommended: false,
    deposit: '2,000만', monthly: '70만', area: '10평', commute: '25분', floor: '5층', photoCount: 4,
    badges: [{ variant: 'safe', label: '안전 22%' }, { variant: 'hug', label: 'HUG 가능' }],
  },
];

const BADGE_STYLE: Record<BadgeVariant, { bg: string; text: string }> = {
  safe:   { bg: '#ECFDF5', text: '#047857' },
  mid:    { bg: '#FEF3C7', text: '#B45309' },
  danger: { bg: '#FEE2E2', text: '#B91C1C' },
  hug:    { bg: '#EFF6FF', text: '#1D4ED8' },
  budget: { bg: '#D1FAE5', text: '#047857' },
};

/* ─── ListingCard ─── */
function ListingCard({ item, onToggleSave }: { item: Listing; onToggleSave: (id: string) => void }) {
  const { bg: recBg, border: recBorder } = item.isRecommended
    ? { bg: '#F0FDF9', border: '#10B981' }
    : { bg: '#FFFFFF', border: '#E4E4E7' };

  return (
    <Pressable onPress={() => router.push(`/listing/${item.id}` as never)}
      style={{ borderWidth: item.isRecommended ? 1.5 : 1, borderColor: recBorder,
        borderRadius: 14, backgroundColor: recBg, overflow: 'visible', marginTop: item.isRecommended ? 10 : 0 }}>
      {item.isRecommended && (
        <View style={{ position: 'absolute', top: -10, left: 12,
          backgroundColor: '#10B981', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, zIndex: 1 }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '800', letterSpacing: 0.2 }}>
            내 조건 {item.matchPct}% 일치
          </Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', gap: 12, padding: 12 }}>
        {/* 썸네일 */}
        <View style={{ width: 96, height: 96, borderRadius: 10, backgroundColor: '#E4E4E7',
          flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
          <Image source={LISTING_THUMBNAIL[item.id]} style={{ width: 96, height: 96 }} resizeMode="cover" />
          {item.isNew && (
            <View style={{ position: 'absolute', top: 6, left: 6,
              backgroundColor: '#10B981', borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2 }}>
              <Text style={{ color: 'white', fontSize: 9, fontWeight: '800', letterSpacing: 0.4 }}>NEW</Text>
            </View>
          )}
          <View style={{ position: 'absolute', bottom: 6, right: 6,
            backgroundColor: 'rgba(10,10,11,0.7)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>+{item.photoCount}</Text>
          </View>
        </View>

        {/* 정보 */}
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#71717A', letterSpacing: 0.4 }}>{item.kind}</Text>
            <Pressable onPress={() => onToggleSave(item.id)}
              style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginTop: -4, marginRight: -4 }}>
              <Ionicons name={item.isSaved ? 'heart' : 'heart-outline'} size={18}
                color={item.isSaved ? '#EF4444' : '#A1A1AA'} />
            </Pressable>
          </View>
          <Text style={{ fontSize: 17, fontWeight: '800', letterSpacing: -0.34, color: '#0A0A0B', lineHeight: 22 }}>
            <Text>보증 {item.deposit}</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#3F3F46' }}> / 월 {item.monthly}</Text>
          </Text>
          <Text style={{ fontSize: 12, color: '#71717A' }}>
            {item.area} · 통근 {item.commute} · {item.floor}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
            {item.badges.map(({ variant, label }) => {
              const s = BADGE_STYLE[variant];
              const hasDot = variant === 'safe' || variant === 'mid' || variant === 'danger';
              return (
                <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 3,
                  backgroundColor: s.bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
                  {hasDot && <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: s.text }} />}
                  <Text style={{ fontSize: 11, fontWeight: '700', color: s.text }}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/* ─── FilterSheet ─── */
const PROPERTY_TYPES = ['빌라', '오피스텔', '다세대', '원룸', '투룸'] as const;
const DEPOSIT_OPTIONS = ['500만', '1,000만', '2,000만', '3,000만', '5,000만'] as const;
const MONTHLY_OPTIONS = ['30만', '50만', '60만', '70만', '90만'] as const;

function FilterSheet({ onClose }: { onClose: () => void }) {
  const { depositWan, monthlyRentWan } = useDiagnosisStore();

  const depositChip = `${depositWan.toLocaleString()}만`;
  const monthlyChip = `${monthlyRentWan}만`;

  const [types, setTypes] = useState<Set<string>>(new Set(['빌라', '오피스텔', '다세대']));
  const [deposits, setDeposits] = useState<Set<string>>(
    new Set(DEPOSIT_OPTIONS.includes(depositChip as typeof DEPOSIT_OPTIONS[number]) ? [depositChip] : [])
  );
  const [monthlies, setMonthlies] = useState<Set<string>>(
    new Set(MONTHLY_OPTIONS.includes(monthlyChip as typeof MONTHLY_OPTIONS[number]) ? [monthlyChip] : [])
  );
  const [noBasement, setNoBasement] = useState(true);
  const [hugOnly, setHugOnly] = useState(true);

  const toggle = <T extends string>(set: Set<T>, val: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  const reset = () => {
    setTypes(new Set(['빌라', '오피스텔', '다세대']));
    setDeposits(new Set(DEPOSIT_OPTIONS.includes(depositChip as typeof DEPOSIT_OPTIONS[number]) ? [depositChip] : []));
    setMonthlies(new Set(MONTHLY_OPTIONS.includes(monthlyChip as typeof MONTHLY_OPTIONS[number]) ? [monthlyChip] : []));
    setNoBasement(true);
    setHugOnly(true);
  };

  const Switch = ({ on, onPress }: { on: boolean; onPress: () => void }) => (
    <Pressable onPress={onPress}
      style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: on ? '#10B981' : '#D4D4D8', justifyContent: 'center' }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: 'white',
        position: 'absolute', left: on ? 20 : 2,
        shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 2, elevation: 2 }} />
    </Pressable>
  );

  const ChipRow = ({ options, selected, onToggle }: {
    options: readonly string[];
    selected: Set<string>;
    onToggle: (v: string) => void;
  }) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {options.map((o) => {
        const on = selected.has(o);
        return (
          <Pressable key={o} onPress={() => onToggle(o)}
            style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
              borderWidth: 1, borderColor: on ? '#10B981' : '#E4E4E7',
              backgroundColor: on ? '#ECFDF5' : 'white' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: on ? '#047857' : '#3F3F46' }}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(10,10,11,0.5)' }} onPress={onClose} />
      <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        maxHeight: '75%', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 12 }}>
        {/* 핸들 */}
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#D4D4D8', alignSelf: 'center', marginTop: 8, marginBottom: 4 }} />
        {/* 헤더 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F4F4F5' }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: '#0A0A0B' }}>전체 필터</Text>
          <Pressable onPress={reset}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#71717A' }}>초기화</Text>
          </Pressable>
        </View>
        {/* 바디 */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A0A0B' }}>매물 유형</Text>
            <ChipRow options={PROPERTY_TYPES} selected={types} onToggle={(v) => toggle(types, v, setTypes)} />
          </View>
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A0A0B' }}>보증금</Text>
            <ChipRow options={DEPOSIT_OPTIONS} selected={deposits} onToggle={(v) => toggle(deposits, v, setDeposits)} />
          </View>
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A0A0B' }}>월세</Text>
            <ChipRow options={MONTHLY_OPTIONS} selected={monthlies} onToggle={(v) => toggle(monthlies, v, setMonthlies)} />
          </View>
          {([
            ['반지하 제외', '침수 위험이 높은 매물 제외', noBasement, () => setNoBasement(v => !v)],
            ['HUG 가입 가능만', '전세보증금 반환보증 가능 매물', hugOnly, () => setHugOnly(v => !v)],
          ] as [string, string, boolean, () => void][]).map(([label, desc, on, fn]) => (
            <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#0A0A0B' }}>{label}</Text>
                <Text style={{ fontSize: 11, color: '#71717A', marginTop: 2 }}>{desc}</Text>
              </View>
              <Switch on={on} onPress={fn} />
            </View>
          ))}
        </ScrollView>
        {/* 적용 버튼 */}
        <View style={{ padding: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F4F4F5' }}>
          <Pressable onPress={onClose}
            style={{ backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>매물 24건 보기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ─── EmptyState ─── */
function EmptyState() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#F4F4F5',
        alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Ionicons name="search-outline" size={32} color="#A1A1AA" />
      </View>
      <Text style={{ fontSize: 17, fontWeight: '800', color: '#0A0A0B', textAlign: 'center' }}>
        조건에 맞는 매물이 없어요
      </Text>
      <Text style={{ fontSize: 13, color: '#71717A', textAlign: 'center', lineHeight: 20 }}>
        {'내 조건이 너무 좁아요.\n아래 옵션 중 하나를 시도해보세요.'}
      </Text>
      <View style={{ width: '100%', marginTop: 16, gap: 8 }}>
        {([
          { label: '위험도 "주의"까지 보기 (8건 추가)', primary: true },
          { label: '예산을 보증 4,000만까지 (5건 추가)', primary: false },
          { label: '다른 동네 보기 (왕십리·뚝섬)', primary: false },
        ]).map(({ label, primary }) => (
          <Pressable key={label}
            style={{ paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
              backgroundColor: primary ? '#10B981' : 'white',
              borderWidth: primary ? 0 : 1, borderColor: '#E4E4E7' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: primary ? 'white' : '#3F3F46' }}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/* ─── Main Screen ─── */
const FILTER_CHIPS = ['예산 내', 'HUG 가능', '반지하 제외', '전체필터'] as const;

export default function SearchScreen() {
  const { results } = useDiagnosisStore();
  const topHood = results[0];

  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['예산 내', 'HUG 가능']));
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['1', '3']));

  const listings = LISTINGS.map(l => ({ ...l, isSaved: savedIds.has(l.id) }));
  const isEmpty = false;

  const toggleFilter = (chip: string) => {
    if (chip === '전체필터') { setShowFilterSheet(true); return; }
    const next = new Set(activeFilters);
    next.has(chip) ? next.delete(chip) : next.add(chip);
    setActiveFilters(next);
  };

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* 앱 바 */}
      <View style={{ height: 56, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8,
        borderBottomWidth: 1, borderBottomColor: '#F4F4F5' }}>
        <Pressable onPress={() => router.push('/diagnosis/complete')}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}>
          <Ionicons name="chevron-back" size={22} color="#0A0A0B" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', letterSpacing: -0.16, color: '#0A0A0B' }}>
            {topHood?.name ?? '동네'}
          </Text>
          <Text style={{ fontSize: 11, color: '#71717A', marginTop: 1 }}>
            {topHood ? `매칭점수 ${topHood.score} · 내 조건 일치` : '진단 결과를 먼저 확인해주세요'}
          </Text>
        </View>
        <Pressable style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 999 }}>
          <Ionicons name="map-outline" size={20} color="#0A0A0B" />
        </Pressable>
      </View>

      {/* 필터 칩바 — paddingRight 추가로 마지막 칩 잘림 수정 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        alwaysBounceHorizontal={false}
        style={{ flexShrink: 0, borderBottomWidth: 1, borderBottomColor: '#F4F4F5' }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 8,
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: 24,
        }}>
        {/* 정렬 칩 */}
        <Pressable style={{ flexShrink: 0, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999,
          backgroundColor: '#0A0A0B', borderWidth: 1, borderColor: '#0A0A0B',
          flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: 'white' }}>최신순</Text>
          <Ionicons name="chevron-down" size={12} color="white" />
        </Pressable>
        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilters.has(chip);
          return (
            <Pressable key={chip} onPress={() => toggleFilter(chip)}
              style={{ flexShrink: 0, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999,
                borderWidth: 1,
                borderColor: isActive ? '#10B981' : '#E4E4E7',
                backgroundColor: isActive ? '#ECFDF5' : 'white' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: isActive ? '#047857' : '#3F3F46' }}>{chip}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 결과 수 바 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
        {isEmpty ? (
          <Text style={{ fontSize: 13, color: '#3F3F46' }}><Text style={{ fontWeight: '700', color: '#0A0A0B' }}>0</Text>건</Text>
        ) : (
          <Text style={{ fontSize: 13, color: '#3F3F46' }}>
            <Text style={{ fontWeight: '700', color: '#0A0A0B' }}>24</Text>건 ·{' '}
            <Text style={{ fontWeight: '700', color: '#059669' }}>안전 매물 12건</Text>
          </Text>
        )}
        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E4E4E7', borderRadius: 6, overflow: 'hidden' }}>
          {(['list', 'grid'] as const).map((v, i) => (
            <Pressable key={v} style={{ width: 32, height: 28, alignItems: 'center', justifyContent: 'center',
              backgroundColor: i === 0 ? '#0A0A0B' : 'white' }}>
              <Ionicons name={v === 'list' ? 'list-outline' : 'grid-outline'} size={13}
                color={i === 0 ? 'white' : '#71717A'} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* 리스트 / 빈 상태 */}
      {isEmpty ? (
        <EmptyState />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard item={item} onToggleSave={toggleSave} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TabBar />

      {showFilterSheet && <FilterSheet onClose={() => setShowFilterSheet(false)} />}
    </SafeAreaView>
  );
}