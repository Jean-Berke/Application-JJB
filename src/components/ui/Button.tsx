import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fontSize, radii, spacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  block?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled, block = true, style }: Props) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        block && styles.block,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.labelPrimary,
          variant === 'secondary' && styles.labelSecondary,
          variant === 'ghost' && styles.labelGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 46,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  block: { width: '100%' },
  primary: { backgroundColor: colors.accent },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSize.body,
  },
  labelPrimary: { color: colors.onAccent },
  labelSecondary: { color: colors.text },
  labelGhost: { color: colors.textMuted },
});
