import client from './client';
import type { Hood } from '@/store/useDiagnosisStore';

export type RecommendRequest = {
  workplace_name: string;
  workplace_address: string;
  job_type: string;
  max_commute_minutes: number;
  lifestyle_tags: string[];
  deposit_max_wan: number;
  monthly_rent_max_wan: number;
  age: number;
  annual_income_wan: number;
  household_type: string;
  home_ownerless: boolean;
};

export type RecommendResponse = {
  hoods: Hood[];
};

export async function postRecommend(body: RecommendRequest): Promise<RecommendResponse> {
  console.log('[api] postRecommend body', body);
  const { data } = await client.post<RecommendResponse>('/api/v1/recommend', body);
  console.log('[api] postRecommend response', data);
  return data;
}
