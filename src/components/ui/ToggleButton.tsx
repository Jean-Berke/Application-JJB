import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radii, spacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

type Props = {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  onPress: () => void;
  block?: boolean;
};

export function ToggleButton({ active, activeLabel, inactiveLabel, onPress, block = true }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, block && styles.block, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {active ? activeLabel : inactiveLabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    borderWidth: 1,
  },
  block: { width: '100%' },
  inactive: { backgroundColor: colors.accent, borderColor: colors.accent },
  active: { backgroundColor: 'transparent', borderColor: colors.accent },
  label: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.meta },
  labelInactive: { color: colors.onAccent },
  labelActive: { color: colors.accent },
});
