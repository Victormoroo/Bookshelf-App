/**
 * Tiny local-preferences helper (AsyncStorage). Used only for lightweight
 * navigation/UX flags such as "don't show onboarding again". This is local,
 * on-device storage — not a backend or remote persistence.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_SEEN_KEY = '@bookshelf/onboarding-seen';

export async function getOnboardingSeen(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_SEEN_KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingSeen(seen: boolean): Promise<void> {
  try {
    if (seen) await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
    else await AsyncStorage.removeItem(ONBOARDING_SEEN_KEY);
  } catch {
    // best-effort; ignore storage failures at this stage
  }
}
