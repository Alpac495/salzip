import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SavedListing, RiskLevel } from '@/types/profile';

type Props = {
  listing: SavedListing;
  onPress: () => void;
};

const RISK_TONE: Record<RiskLevel, { dot: string; bg: string; text: string; label: string }> = {
  safe: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', label: '안전' },
  warn: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-800', label: '주의' },
  danger: { dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-800', label: '위험' },
};

export function SavedListingItem({ listing, onPress }: Props) {
  const tone = RISK_TONE[listing.riskLevel];

  return (
    <Pressable
      onPress={onPress}
      className="flex-row gap-3 rounded-xl border border-neutral-200 bg-white p-3.5"
    >
      <View className="h-20 w-20 items-center justify-center rounded-xl bg-neutral-100">
        <Ionicons name="home-outline" size={28} color="#8A8A92" />
      </View>

      <View className="flex-1">
        <Text className="text-xs text-neutral-400">
          {listing.type} · {listing.unit} · {listing.neighborhood}
        </Text>
        <Text className="mt-1 text-[15px] font-bold text-neutral-900">
          보증 <Text className="font-extrabold">{listing.deposit.toLocaleString()}만</Text> / 월{' '}
          <Text className="font-extrabold">{listing.monthly}만</Text>
        </Text>
        <Text className="mt-1 text-xs text-neutral-400">
          {listing.area}평 · 통근 {listing.commuteMin}분 · {listing.floor}층
        </Text>

        <View className="mt-2 flex-row gap-1.5">
          <View className={`flex-row items-center gap-1 rounded ${tone.bg} px-2 py-0.5`}>
            <View className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
            <Text className={`text-[11px] font-semibold ${tone.text}`}>
              {tone.label} {listing.riskPercent}%
            </Text>
          </View>
          {listing.hugAvailable && (
            <View className="rounded bg-blue-50 px-2 py-0.5">
              <Text className="text-[11px] font-semibold text-blue-800">보증금 보호</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="heart" size={20} color="#EF4444" />
    </Pressable>
  );
}
