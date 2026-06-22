/**
 * Entry route — decides the first screen:
 * - logged in (active Supabase session) → straight to the shelves
 * - otherwise → login, unless onboarding hasn't been dismissed yet
 */
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthProvider';
import { getOnboardingSeen } from '@/utils/preferences';

export default function Index() {
  const { session, loading } = useAuth();
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    getOnboardingSeen().then(setSeen);
  }, []);

  // Wait for the session and the stored flag before deciding where to go.
  if (loading || seen === null) return null;

  if (session) return <Redirect href="/(tabs)" />;
  return <Redirect href={seen ? '/login' : '/onboarding'} />;
}
