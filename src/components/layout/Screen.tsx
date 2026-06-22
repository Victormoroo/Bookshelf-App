/**
 * Screen — themed background + safe-area padding wrapper. Optionally scrolls.
 *
 * The top safe-area inset is ADDED to whatever top padding the caller requests
 * (instead of being overridden by it), so content never slides under the status
 * bar / notch.
 */
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  /** Apply top safe-area inset (screens without a header). */
  edgeTop?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  scrollProps?: ScrollViewProps;
}

/** Reads a numeric paddingTop out of a (possibly composed) style. */
function basePaddingTop(style?: ViewStyle): number {
  const flat = StyleSheet.flatten(style) as ViewStyle | undefined;
  return typeof flat?.paddingTop === 'number' ? flat.paddingTop : 0;
}

export function Screen({
  children,
  scroll = false,
  edgeTop = true,
  contentContainerStyle,
  style,
  scrollProps,
}: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topInset = edgeTop ? insets.top : 0;

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: colors.bg }, style]}
        contentContainerStyle={[
          contentContainerStyle,
          { paddingTop: topInset + basePaddingTop(contentContainerStyle) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...scrollProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.flex,
        { backgroundColor: colors.bg },
        style,
        { paddingTop: topInset + basePaddingTop(style) },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
