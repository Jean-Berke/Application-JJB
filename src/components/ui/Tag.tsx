import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, fontSize, radii, spacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

type Variant = 'accent' | 'neutral' | 'outline';

type Props = {
  label: string;
  variant?: Variant;
  active?: boolean;
  onPress?: () => void;
};

export function Tag({ label, variant = 'neutral', active, onPress }: Props) {
  const isActive = active ?? variant === 'accent';
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper onPress={onPress} style={[styles.base, isActive ? styles.active : styles.inactive, variant === 'outline' && styles.outline]}>
      <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>{label}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing[4],
    height: 30,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  active: { backgroundColor: colors.accent },
  inactive: { backgroundColor: colors.neutral100 },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent },
  label: { fontFamily: fonts.condensedSemiBold, fontSize: 12.5 },
  labelActive: { color: colors.onAccent },
  labelInactive: { color: colors.textMuted },
});
