import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function Switch({ value, onValueChange }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  function toggle() {
    const next = !value;
    Animated.timing(anim, { toValue: next ? 1 : 0, duration: 150, useNativeDriver: false }).start();
    onValueChange(next);
  }

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 20] });
  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.neutral300, colors.accent],
  });

  return (
    <Pressable onPress={toggle}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
});
