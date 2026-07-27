import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

function styled(base: TextStyle) {
  return function StyledText({ style, ...props }: TextProps) {
    return <Text style={[base, style]} {...props} />;
  };
}

export const H3 = styled({
  fontFamily: fonts.condensedBold,
  fontSize: fontSize.h3,
  lineHeight: fontSize.h3 * 1.12,
  color: colors.text,
});

export const H4 = styled({
  fontFamily: fonts.condensedBold,
  fontSize: fontSize.h4,
  lineHeight: fontSize.h4 * 1.12,
  color: colors.text,
});

export const H5 = styled({
  fontFamily: fonts.condensedSemiBold,
  fontSize: fontSize.h5,
  lineHeight: fontSize.h5 * 1.12,
  color: colors.text,
});

export const H6 = styled({
  fontFamily: fonts.condensedSemiBold,
  fontSize: fontSize.h6,
  letterSpacing: fontSize.h6 * 0.1,
  color: colors.textMuted,
  textTransform: 'uppercase',
});

export const Kicker = styled({
  fontFamily: fonts.condensedSemiBold,
  fontSize: 11.5,
  letterSpacing: 11.5 * 0.1,
  color: colors.accent,
  textTransform: 'uppercase',
});

export const Body = styled({
  fontFamily: fonts.bodyRegular,
  fontSize: fontSize.body,
  lineHeight: fontSize.body * 1.5,
  color: colors.text,
});

export const PostBody = styled({
  fontFamily: fonts.bodyRegular,
  fontSize: fontSize.postBody,
  lineHeight: fontSize.postBody * 1.42,
  color: colors.text,
});

export const Meta = styled({
  fontFamily: fonts.bodyRegular,
  fontSize: fontSize.meta,
  color: colors.textMuted,
});

export const MetaSmall = styled({
  fontFamily: fonts.bodyRegular,
  fontSize: fontSize.metaSmall,
  color: colors.textMuted,
});

export const StatNumber = styled({
  fontFamily: fonts.condensedBold,
  fontSize: fontSize.statLarge,
  color: colors.text,
});
