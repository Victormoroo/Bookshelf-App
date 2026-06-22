/**
 * Tab navigator — Estante / Buscar / Perfil, with a custom tab bar matching the
 * Design System bottom nav.
 */
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Icon, type IconName } from '@/components/ui';
import { fonts, palette, useTheme } from '@/theme';

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'index', label: 'Estante', icon: 'shelf' },
  { name: 'search', label: 'Buscar', icon: 'search' },
  { name: 'profile', label: 'Perfil', icon: 'profile' },
];

const ACTIVE = palette.primary;
const INACTIVE = '#A9B2B0';

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <View
          style={[
            styles.bar,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, 11),
            },
          ]}
        >
          {state.routes.map((route, i) => {
            const tab = TABS.find((t) => t.name === route.name);
            if (!tab) return null;
            const focused = state.index === i;
            const color = focused ? ACTIVE : INACTIVE;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                style={styles.item}
              >
                <Icon name={tab.icon} color={color} />
                <AppText
                  style={{ fontFamily: fonts.bodySemiBold, fontSize: 10 }}
                  color={color}
                >
                  {tab.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 9,
  },
  item: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
});
