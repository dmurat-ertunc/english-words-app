import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { enter } from '@/constants/motion';
import { Radius, Spacing, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

type StudyModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function StudyModal({ visible, title, onClose, children }: StudyModalProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior="padding" style={styles.backdrop}>
        <Animated.View entering={enter()} style={styles.card}>
          <View style={styles.header}>
            <ThemedText type="label" themeColor="textSecondary">
              {title}
            </ThemedText>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Kapat" style={styles.close}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                ✕
              </ThemedText>
            </Pressable>
          </View>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.backdrop,
      justifyContent: 'center',
      padding: Spacing.three,
    },
    card: {
      width: '100%',
      maxWidth: 480,
      maxHeight: '92%',
      alignSelf: 'center',
      borderRadius: Radius.xl,
      borderCurve: 'continuous',
      padding: Spacing.four,
      gap: Spacing.three,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      boxShadow: '0 30px 80px rgba(139, 92, 255, 0.30)',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    close: {
      width: 32,
      height: 32,
      borderRadius: Radius.pill,
      backgroundColor: colors.backgroundSelected,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
