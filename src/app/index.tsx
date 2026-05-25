// Route: / (시작 - 온보딩 분기)
import { Redirect } from 'expo-router';

export default function Index() {
  const hasCompletedOnboarding = false; // TODO: Zustand/AsyncStorage에서 읽기

  if (hasCompletedOnboarding) {
    return <Redirect href="/(main)/hsubsidy" />;
  }

  return <Redirect href="/(onboarding)/start" />;
}
