/**
 * Entry route — sends the user to onboarding (the visual "login"/welcome flow).
 * No auth/session yet: completing onboarding goes straight to the shelves.
 */
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/onboarding" />;
}
