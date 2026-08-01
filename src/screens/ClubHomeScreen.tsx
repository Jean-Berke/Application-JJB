import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { currentUserId } from '../data/mock';

export function ClubHomeScreen() {
  const { getProfile, getAcademy, setViewMode } = useApp();
  const me = getProfile(currentUserId);
  const academy = getAcademy(me.academyId);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner} />
        <View style={styles.logoRow}>
          <View style={styles.logo}>
            <Text style={styles.logoLabel}>GB</Text>
          </View>
          <Button
            label="Vue pratiquant"
            variant="secondary"
            block={false}
            onPress={() => setViewMode('practitioner')}
          />
        </View>

        {academy && (
          <Card>
            <Text style={styles.name}>{academy.name}</Text>
            <Meta>{academy.neighborhood} · {academy.city}</Meta>
            <Meta>{academy.memberCount} membres</Meta>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.screenPadding },
  banner: { height: 60 },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.accent200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLabel: { fontFamily: fonts.condensedBold, fontSize: 16, color: colors.accent700 },
  name: { fontFamily: fonts.condensedBold, fontSize: 19, color: colors.text, marginBottom: 4 },
});
