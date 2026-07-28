import React from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, radii, spacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

type Props = TextInputProps & { label?: string };

export function Input({ label, style, ...props }: Props) {
  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, style]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing[4] },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.metaSmall,
    color: colors.textMuted,
    marginBottom: spacing[1],
  },
  input: {
    height: 46,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[4],
    fontFamily: fonts.bodyRegular,
    fontSize: fontSize.body,
    color: colors.text,
  },
});
