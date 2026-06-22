/**
 * Shelf tabs — underline tabs for the four statuses with counts
 * (Design System, Components / 08; Home).
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { fonts, palette, shelfOrder, statusMeta, useTheme } from '@/theme';
import type { BookStatus } from '@/types';

interface ShelfTabsProps {
  active: BookStatus;
  counts: Record<BookStatus, number>;
  onChange: (status: BookStatus) => void;
}

export function ShelfTabs({ active, counts, onChange }: ShelfTabsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      {shelfOrder.map((status) => {
        const isActive = status === active;
        return (
          <Pressable
            key={status}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(status)}
            style={[
              styles.tab,
              { borderBottomColor: isActive ? palette.accent : 'transparent' },
            ]}
          >
            <AppText
              color={isActive ? colors.text : colors.textMuted}
              style={{
                fontFamily: isActive ? fonts.bodySemiBold : fonts.body,
                fontSize: 13,
              }}
            >
              {statusMeta[status].label}{' '}
              <AppText
                color={isActive ? colors.text : colors.textMuted}
                style={{ fontFamily: fonts.body, fontSize: 13, opacity: 0.55 }}
              >
                {counts[status]}
              </AppText>
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 18,
  },
  tab: {
    paddingBottom: 9,
    borderBottomWidth: 2,
  },
});
