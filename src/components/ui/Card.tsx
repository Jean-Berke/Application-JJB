import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardMargin,
  },
});
