/**
 * Fullscreen image viewer — a dark modal that shows an image (contain) with a
 * close button. Tap anywhere or the × to dismiss.
 */
import React from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from './AppText';

interface ImageViewerProps {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
}

export function ImageViewer({ visible, uri, onClose }: ImageViewerProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />
        {uri && <Image source={{ uri }} style={styles.image} resizeMode="contain" />}
        <Pressable
          onPress={onClose}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          style={[styles.close, { top: insets.top + 12 }]}
        >
          <AppText color="#FFFFFF" style={styles.closeGlyph}>
            ×
          </AppText>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8,14,13,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '92%',
    height: '80%',
  },
  close: {
    position: 'absolute',
    right: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  closeGlyph: {
    fontSize: 26,
    lineHeight: 30,
  },
});
