import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

type Props = {
  name: string;
  size?: number;
};

export function Avatar({ name, size = 36 }: Props) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.accent200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.condensedSemiBold,
    color: colors.accent700,
  },
});
