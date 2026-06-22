/**
 * Entry route — decides the first screen. If the user chose "não mostrar
 * novamente", skip onboarding and go straight to login; otherwise show
 * onboarding. No auth/session yet — login leads straight to the shelves.
 */
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { getOnboardingSeen } from '@/utils/preferences';

export default function Index() {
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    getOnboardingSeen().then(setSeen);
  }, []);

  // Wait for the stored flag before deciding where to go.
  if (seen === null) return null;

  return <Redirect href={seen ? '/login' : '/onboarding'} />;
}
