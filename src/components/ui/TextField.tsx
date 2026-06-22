/**
 * Text field — labeled input matching the Design System (Components / 05).
 * Default and focused states (focus highlights the border in petrol primary).
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { fonts, palette, radius, useTheme } from '@/theme';
import { AppText } from './AppText';

interface TextFieldProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
}

export function TextField({ label, containerStyle, style, ...rest }: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label && (
        <AppText
          color={colors.textSecondary}
          style={styles.label}
        >
          {label}
        </AppText>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: focused ? palette.primary : colors.border,
            borderWidth: focused ? 1.5 : 1,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    marginBottom: 6,
  },
  input: {
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: fonts.body,
    fontSize: 14,
  },
});
