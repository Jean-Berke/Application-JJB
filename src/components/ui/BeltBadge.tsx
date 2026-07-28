import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { BeltLevel, beltLabels } from '../../theme/tokens';

type Props = {
  belt: BeltLevel;
  stripes: number;
  width?: number;
  height?: number;
  showLabel?: boolean;
};

export function BeltBadge({ belt, stripes, width = 44, height = 16, showLabel = false }: Props) {
  const barWidth = width * 0.32;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[styles.rect, { width, height, backgroundColor: colors.belt[belt] }]}>
        {belt !== 'black' && (
          <View style={[styles.bar, { width: barWidth, backgroundColor: colors.beltBar }]}>
            {Array.from({ length: Math.min(stripes, 4) }).map((_, i) => (
              <View key={i} style={[styles.stripe, { backgroundColor: colors.beltStripe }]} />
            ))}
          </View>
        )}
      </View>
      {showLabel && <Text style={styles.label}>{beltLabels[belt].toUpperCase()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  rect: {
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  stripe: {
    width: 2.5,
    height: '70%',
    borderRadius: 1,
  },
  label: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
    color: 'rgba(243,239,233,0.5)',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
});
