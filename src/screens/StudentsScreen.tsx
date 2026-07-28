import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing, beltLabels } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { BeltBadge } from '../components/ui/BeltBadge';
import { Button } from '../components/ui/Button';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { currentUserId } from '../data/mock';

type Props = NativeStackScreenProps<RootStackParamList>;

export function StudentsScreen({ navigation }: Props) {
  const { getProfile, academyMembers, promotions, approvePromotion, declinePromotion } = useApp();
  const [search, setSearch] = useState('');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const me = getProfile(currentUserId);
  const members = me.academyId ? academyMembers(me.academyId) : [];
  const students = members.filter((m) => m.id !== currentUserId);

  const pendingRequests = promotions.filter(
    (p) => p.status === 'pending' && students.some((s) => s.id === p.profileId) && !dismissed.has(p.id)
  );

  const filteredStudents = students.filter((s) =>
    s.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = students.length;
  const pendingCount = promotions.filter(
    (p) => p.status === 'pending' && students.some((s) => s.id === p.profileId)
  ).length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Élèves</Text>
        <Pressable style={styles.adminButton} onPress={() => navigation.navigate('Admin')}>
          <Text style={styles.adminButtonLabel}>Admin</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.counters}>
          <View style={styles.counterTile}>
            <Text style={styles.counterNumber}>{activeCount}</Text>
            <Meta>Actifs</Meta>
          </View>
          <View style={styles.counterTile}>
            <Text style={[styles.counterNumber, styles.counterAccent]}>{pendingCount}</Text>
            <Meta>Grades à valider</Meta>
          </View>
          <View style={styles.counterTile}>
            <Text style={styles.counterNumber}>{Math.max(activeCount - 1, 0)}</Text>
            <Meta>Présents cette semaine</Meta>
          </View>
        </View>

        <Input placeholder="Rechercher un élève" value={search} onChangeText={setSearch} />

        {pendingRequests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Demandes de validation</Text>
            {pendingRequests.map((request) => {
              const student = getProfile(request.profileId);
              return (
                <Card key={request.id} style={styles.requestCard}>
                  <View style={styles.requestRow}>
                    <Avatar name={student.displayName} size={40} />
                    <View style={{ marginLeft: spacing[3], flex: 1 }}>
                      <Text style={styles.studentName}>{student.displayName}</Text>
                      <Text style={styles.requestLabel}>
                        Demande : {request.stripes > 0 ? `${request.stripes}e barrette · ` : ''}
                        ceinture {beltLabels[request.belt].toLowerCase()}
                      </Text>
                      <Meta>{student.sessionCount} séances · dernier grade {beltLabels[student.belt]}</Meta>
                    </View>
                    <BeltBadge belt={request.belt} stripes={request.stripes} width={44} height={16} />
                  </View>
                  <View style={styles.requestActions}>
                    <Button
                      label="Valider le grade"
                      block={false}
                      style={styles.validateButton}
                      onPress={() => approvePromotion(request.id)}
                    />
                    <Pressable
                      onPress={() => setDismissed((prev) => new Set(prev).add(request.id))}
                    >
                      <Text style={styles.laterLabel}>Plus tard</Text>
                    </Pressable>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        <Text style={styles.sectionTitle}>Tous les élèves</Text>
        {filteredStudents.map((student) => (
          <View key={student.id} style={styles.studentRow}>
            <Avatar name={student.displayName} size={36} />
            <View style={{ marginLeft: spacing[3], flex: 1 }}>
              <Text style={styles.studentName}>{student.displayName}</Text>
              <Meta>{student.sessionCount} séances</Meta>
            </View>
            <BeltBadge belt={student.belt} stripes={student.stripes} width={36} height={13} />
          </View>
        ))}
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
  headerTitle: { fontFamily: fonts.condensedBold, fontSize: 21, color: colors.text },
  adminButton: {
    paddingHorizontal: spacing[3],
    height: 32,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminButtonLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  content: { padding: spacing.screenPadding },
  counters: { flexDirection: 'row', gap: spacing[3], marginBottom: spacing[4] },
  counterTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: spacing[3],
    alignItems: 'center',
    gap: 4,
  },
  counterNumber: { fontFamily: fonts.condensedBold, fontSize: 26, color: colors.text },
  counterAccent: { color: colors.accent },
  sectionTitle: {
    fontFamily: fonts.condensedSemiBold,
    fontSize: 15,
    color: colors.text,
    marginTop: spacing[6],
    marginBottom: spacing[3],
  },
  requestCard: {},
  requestRow: { flexDirection: 'row', alignItems: 'center' },
  studentName: { fontFamily: fonts.bodySemiBold, fontSize: 14.5, color: colors.text },
  requestLabel: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  requestActions: { flexDirection: 'row', alignItems: 'center', gap: spacing[4], marginTop: spacing[3] },
  validateButton: { paddingHorizontal: spacing[4] },
  laterLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
});
