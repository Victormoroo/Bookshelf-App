/**
 * Toast/snackbar host — renders the current toast from ToastProvider, pinned
 * above the tab bar. Mount once near the navigation root.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '@/context/ToastProvider';
import { elevation, fonts, palette, radius } from '@/theme';
import { AppText } from './AppText';

export function Toast() {
  const { toast, runAction } = useToast();
  const insets = useSafeAreaInsets();

  if (!toast) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: insets.bottom + 78 }]}
    >
      <View style={[styles.toast, elevation[2]]}>
        <AppText color={palette.onPrimary} variant="caption" style={styles.message}>
          {toast.message}
        </AppText>
        {toast.action && (
          <Pressable onPress={runAction} hitSlop={8}>
            <AppText
              color={palette.accentSoft}
              style={{ fontFamily: fonts.bodySemiBold, fontSize: 12.5 }}
            >
              {toast.action}
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: palette.primaryDark,
    borderRadius: 13,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  message: {
    flex: 1,
  },
});
