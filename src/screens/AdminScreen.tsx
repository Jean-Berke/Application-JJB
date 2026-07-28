import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { academyClasses, currentUserId } from '../data/mock';
import { paymentStatusLabels } from '../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Admin'>;

type AdminTab = 'presences' | 'encaissements';

const PLAN_PRICES: Record<string, number> = {
  'Illimité': 89,
  '2 / semaine': 59,
  'Découverte': 0,
};

export function AdminScreen({ navigation }: Props) {
  const [tab, setTab] = useState<AdminTab>('presences');
  const { getProfile, academyMembers, attendance, toggleClassAttendance } = useApp();

  const me = getProfile(currentUserId);
  const students = me.academyId ? academyMembers(me.academyId).filter((p) => p.id !== currentUserId) : [];
  const academyClass = academyClasses.find((c) => c.academyId === me.academyId);

  const classAttendance = academyClass ? attendance.filter((a) => a.classId === academyClass.id) : [];
  const presentCount = classAttendance.filter((a) => a.present).length;

  const totalCollected = students
    .filter((s) => s.paymentStatus === 'current')
    .reduce((sum, s) => sum + (PLAN_PRICES[s.plan ?? ''] ?? 0), 0);
  const lateCount = students.filter((s) => s.paymentStatus === 'late').length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Espace admin</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => setTab('presences')}>
          <Text style={[styles.tabLabel, tab === 'presences' && styles.tabLabelActive]}>Présences</Text>
          {tab === 'presences' && <View style={styles.tabUnderline} />}
        </Pressable>
        <Pressable style={styles.tab} onPress={() => setTab('encaissements')}>
          <Text style={[styles.tabLabel, tab === 'encaissements' && styles.tabLabelActive]}>Encaissements</Text>
          {tab === 'encaissements' && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'presences' && academyClass && (
          <>
            <Card>
              <Text style={styles.className}>{academyClass.name}</Text>
              <Meta>{academyClass.startTime} – {academyClass.endTime}</Meta>
              <Text style={styles.presentCount}>
                {presentCount} / {students.length} présents
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${students.length ? (presentCount / students.length) * 100 : 0}%` },
                  ]}
                />
              </View>
            </Card>

            {students.map((student) => {
              const record = classAttendance.find((a) => a.profileId === student.id);
              const present = record?.present ?? false;
              return (
                <Pressable
                  key={student.id}
                  style={[styles.attendanceRow, present && styles.attendanceRowActive]}
                  onPress={() => toggleClassAttendance(academyClass.id, student.id)}
                >
                  <Text style={styles.studentName}>{student.displayName}</Text>
                  <View style={[styles.checkbox, present && styles.checkboxActive]}>
                    {present && <Check color={colors.onAccent} size={16} />}
                  </View>
                </Pressable>
              );
            })}
          </>
        )}

        {tab === 'encaissements' && (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statTile}>
                <Text style={styles.statNumber}>{totalCollected} €</Text>
                <Meta>encaissé ce mois</Meta>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statNumber}>{lateCount}</Text>
                <Meta>retards</Meta>
              </View>
            </View>

            {students.map((student) => (
              <View key={student.id} style={styles.duesRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{student.displayName}</Text>
                  <Meta>{student.plan} · échéance {student.nextDueLabel ?? '—'}</Meta>
                </View>
                {student.paymentStatus && (
                  <Tag
                    label={paymentStatusLabels[student.paymentStatus]}
                    variant={student.paymentStatus === 'late' ? 'accent' : student.paymentStatus === 'trial' ? 'outline' : 'neutral'}
                  />
                )}
              </View>
            ))}

            <Button label="Relancer les retards" variant="secondary" style={styles.relanceButton} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  headerTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 17, color: colors.text },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.screenPadding },
  tab: { paddingVertical: spacing[3], marginRight: spacing[6] },
  tabLabel: { fontFamily: fonts.condensedSemiBold, fontSize: 14, color: colors.textTertiary },
  tabLabelActive: { color: colors.text },
  tabUnderline: { height: 2, backgroundColor: colors.accent, marginTop: 6, borderRadius: 1 },
  content: { padding: spacing.screenPadding },
  className: { fontFamily: fonts.condensedSemiBold, fontSize: 17, color: colors.text },
  presentCount: { fontFamily: fonts.condensedBold, fontSize: 20, color: colors.accent, marginTop: spacing[3] },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral200,
    marginTop: spacing[2],
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.accent },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radii.md,
    marginBottom: spacing[2],
  },
  attendanceRowActive: { backgroundColor: colors.accent100, borderWidth: 1, borderColor: colors.accent },
  studentName: { fontFamily: fonts.bodySemiBold, fontSize: 14.5, color: colors.text },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },
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
  statNumber: { fontFamily: fonts.condensedBold, fontSize: 24, color: colors.accent },
  duesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  relanceButton: { marginTop: spacing[4] },
});
