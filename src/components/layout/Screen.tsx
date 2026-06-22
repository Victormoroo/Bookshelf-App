/**
 * Screen — themed background + safe-area padding wrapper. Optionally scrolls.
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
  const paddingTop = edgeTop ? insets.top : 0;

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: colors.bg }, style]}
        contentContainerStyle={[{ paddingTop }, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...scrollProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: colors.bg, paddingTop }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
