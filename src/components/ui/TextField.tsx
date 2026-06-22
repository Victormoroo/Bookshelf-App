/**
 * Text field — labeled input matching the Design System (Components / 05).
 * Default and focused states (focus highlights the border in petrol primary).
 * When `password` is set, the field is masked and shows an eye toggle to reveal
 * the text.
 */
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { fonts, palette, radius, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface TextFieldProps extends TextInputProps {
  label?: string;
  /** Masks the input and shows a show/hide (eye) toggle. */
  password?: boolean;
  containerStyle?: ViewStyle;
}

export function TextField({
  label,
  password = false,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={containerStyle}>
      {label && (
        <AppText color={colors.textSecondary} style={styles.label}>
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: colors.surface,
            borderColor: focused ? palette.primary : colors.border,
            borderWidth: focused ? 1.5 : 1,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={password ? hidden : rest.secureTextEntry}
          style={[styles.input, { color: colors.text }, style]}
          {...rest}
        />
        {password && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            style={styles.toggle}
          >
            <Icon name={hidden ? 'eye' : 'eye-off'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  toggle: {
    paddingLeft: 10,
  },
});
