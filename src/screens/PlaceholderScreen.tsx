import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Bientôt disponible.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.screenPadding },
  title: { fontFamily: fonts.condensedBold, fontSize: 21, color: colors.text, marginBottom: spacing[2] },
  subtitle: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.textMuted },
});
