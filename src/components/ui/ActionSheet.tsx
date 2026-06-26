/**
 * ActionSheet — a styled bottom sheet of actions, matching the app (dark
 * backdrop fades in, white sheet slides up). Use instead of the native
 * Alert/ActionSheet when the menu should follow the Design System.
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { elevation, fonts, palette, useTheme } from '@/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

export interface SheetAction {
  label: string;
  icon?: IconName;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  visible: boolean;
  title?: string;
  actions: SheetAction[];
  cancelLabel?: string;
  /** When set, a trash icon is shown at the left of the title. */
  onDelete?: () => void;
  onClose: () => void;
}

export function ActionSheet({
  visible,
  title,
  actions,
  cancelLabel = 'Cancelar',
  onDelete,
  onClose,
}: ActionSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(height);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, height, translateY]);

  // Close first, then run after the dismiss animation so native pickers don't
  // try to present while this modal is still dismissing (iOS).
  const run = (fn: () => void) => {
    onClose();
    setTimeout(fn, 320);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />
        <Animated.View
          style={[
            styles.sheet,
            elevation[3],
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + 16,
              transform: [{ translateY }],
            },
          ]}
        >
          {(title || onDelete) && (
            <View style={styles.header}>
              {title && (
                <AppText variant="label" color={palette.primaryMuted} style={styles.title}>
                  {title}
                </AppText>
              )}
              {onDelete && (
                <Pressable
                  onPress={() => run(onDelete)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Remover foto"
                >
                  <Icon name="trash" size={22} color={palette.error} />
                </Pressable>
              )}
            </View>
          )}

          {actions.map((action, i) => (
            <Pressable
              key={i}
              onPress={() => run(action.onPress)}
              style={({ pressed }) => [
                styles.row,
                { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              {action.icon && (
                <Icon
                  name={action.icon}
                  size={20}
                  color={action.destructive ? palette.error : colors.textSecondary}
                />
              )}
              <AppText
                color={action.destructive ? palette.error : colors.text}
                style={styles.label}
              >
                {action.label}
              </AppText>
            </Pressable>
          ))}

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.cancel, { opacity: pressed ? 0.6 : 1 }]}
          >
            <AppText color={colors.textMuted} style={styles.cancelLabel}>
              {cancelLabel}
            </AppText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(12,24,22,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 10,
    letterSpacing: 0.12 * 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 13,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 2,
  },
  cancelLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
});
