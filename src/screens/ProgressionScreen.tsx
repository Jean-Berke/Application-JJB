import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { BookOpen, MapPin, Users, ShieldCheck } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing, beltLabels } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BeltBadge } from '../components/ui/BeltBadge';
import { Tag } from '../components/ui/Tag';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { currentUserId } from '../data/mock';

type Props = NativeStackScreenProps<RootStackParamList>;

const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const WEEK_MINUTES_PCT = [60, 90, 0, 100, 45, 20, 0];

export function ProgressionScreen({ navigation }: Props) {
  const { getProfile, promotions } = useApp();
  const me = getProfile(currentUserId);
  const history = promotions
    .filter((p) => p.profileId === currentUserId && p.status === 'approved')
    .concat({
      id: 'current',
      profileId: currentUserId,
      belt: me.belt,
      stripes: me.stripes,
      status: 'approved',
      requestedAtLabel: '',
      reviewedBy: null,
      reviewedAtLabel: 'Actuelle',
    });

  const shortcuts = [
    { label: 'Mon carnet', icon: BookOpen, onPress: () => navigation.navigate('Notebook') },
    { label: 'Open mats près de moi', icon: MapPin, onPress: () => navigation.navigate('OpenMats') },
    { label: 'Mon académie', icon: Users, onPress: undefined },
    { label: 'Vérification ceinture', icon: ShieldCheck, onPress: () => navigation.navigate('Verify') },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Progression</Text>

        <View style={styles.grid}>
          {shortcuts.map((s) => (
            <Pressable key={s.label} style={styles.shortcut} onPress={s.onPress}>
              <s.icon color={colors.accent} size={19} />
              <Text style={styles.shortcutLabel}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statNumber}>12</Text>
            <Meta>jours de série</Meta>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statNumber}>{me.sessionCount}</Text>
            <Meta>rounds combattus</Meta>
          </View>
        </View>

        <Card>
          <Text style={styles.weekTitle}>Cette semaine</Text>
          <Text style={styles.weekHours}>4 h 20 sur le tapis</Text>
          <View style={styles.histogram}>
            {WEEK_MINUTES_PCT.map((pct, i) => (
              <View key={i} style={styles.histogramBarWrap}>
                <View
                  style={[
                    styles.histogramBar,
                    { height: `${Math.max(pct, 4)}%` },
                    pct >= 90 ? styles.histogramBarFull : pct === 0 ? styles.histogramBarEmpty : styles.histogramBarPartial,
                  ]}
                />
                <Text style={styles.histogramLabel}>{WEEK_DAYS[i]}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Parcours des ceintures</Text>
        {history.map((h) => (
          <View key={h.id} style={styles.beltRow}>
            <BeltBadge belt={h.belt} stripes={h.stripes} width={44} height={16} />
            <View style={{ flex: 1, marginLeft: spacing[3] }}>
              <Text style={styles.beltName}>{beltLabels[h.belt]}</Text>
              <Meta>{h.reviewedAtLabel === 'Actuelle' ? '' : h.reviewedAtLabel}</Meta>
            </View>
            {h.reviewedAtLabel === 'Actuelle' && <Tag label="Actuelle" variant="accent" />}
          </View>
        ))}

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${(me.stripes / 4) * 100}%` }]} />
        </View>
        <Meta>{me.stripes} / 4 barrettes vers le grade suivant</Meta>

        <Button
          label="Vérification par le coach"
          variant="secondary"
          onPress={() => navigation.navigate('Verify')}
          style={styles.verifyButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.screenPadding, paddingBottom: spacing[8] },
  headerTitle: { fontFamily: fonts.condensedBold, fontSize: 25, color: colors.text, marginBottom: spacing[4] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], marginBottom: spacing[4] },
  shortcut: {
    width: '47%',
    minHeight: 74,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: spacing[3],
    justifyContent: 'space-between',
  },
  shortcutLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  statsRow: { flexDirection: 'row', gap: spacing[3], marginBottom: spacing[4] },
  statTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: spacing[3],
    alignItems: 'center',
    gap: 4,
  },
  statNumber: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.accent },
  weekTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 15, color: colors.text },
  weekHours: { fontFamily: fonts.condensedBold, fontSize: 20, color: colors.accent, marginTop: 2, marginBottom: spacing[3] },
  histogram: { flexDirection: 'row', justifyContent: 'space-between', height: 90, alignItems: 'flex-end' },
  histogramBarWrap: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  histogramBar: { width: 14, borderRadius: 4 },
  histogramBarFull: { backgroundColor: colors.accent },
  histogramBarPartial: { backgroundColor: colors.accent300 },
  histogramBarEmpty: { backgroundColor: 'transparent' },
  histogramLabel: { fontFamily: fonts.bodyRegular, fontSize: 11, color: colors.textMuted, marginTop: spacing[2] },
  sectionTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 16, color: colors.text, marginTop: spacing[6], marginBottom: spacing[3] },
  beltRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  beltName: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral200,
    marginTop: spacing[4],
    marginBottom: spacing[1],
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: colors.accent },
  verifyButton: { marginTop: spacing[4] },
});
