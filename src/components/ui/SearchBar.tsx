/**
 * Search bar — rounded input with a magnifier glyph and an optional clear "×"
 * (Design System, Components / 05).
 */
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { fonts, radius, useTheme } from '@/theme';
import { AppText } from './AppText';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Buscar por título ou autor…',
  autoFocus,
}: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Circle cx={11} cy={11} r={7} stroke="#8A9491" strokeWidth={1.8} />
        <Path d="m20 20-3.5-3.5" stroke="#8A9491" strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoFocus={autoFocus}
        autoCorrect={false}
        returnKeyType="search"
        style={[styles.input, { color: colors.text }]}
      />
      {value.length > 0 && onClear && (
        <Pressable onPress={onClear} hitSlop={8} accessibilityLabel="Limpar busca">
          <AppText color="#B7BFBD" style={styles.clear}>
            ×
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  clear: {
    fontSize: 18,
    lineHeight: 20,
  },
});
