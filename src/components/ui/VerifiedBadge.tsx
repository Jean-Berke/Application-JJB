import React from 'react';
import Svg, { Path, Polygon } from 'react-native-svg';
import { colors } from '../../theme/tokens';

// 12-point rosette with an inner check — marks a coach-verified belt.
export function VerifiedBadge({ size = 14 }: { size?: number }) {
  const points = Array.from({ length: 12 })
    .map((_, i) => {
      const angle = (Math.PI * 2 * i) / 12;
      const r = i % 2 === 0 ? 12 : 9.2;
      const x = 12 + r * Math.cos(angle);
      const y = 12 + r * Math.sin(angle);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polygon points={points} fill={colors.accent} />
      <Path
        d="M8.2 12.3l2.4 2.4 5-5.2"
        stroke={colors.onAccent}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
