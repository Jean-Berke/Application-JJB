import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Mail, Lock, ShieldCheck, Users } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing, beltLabels } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { currentUserId, getAcademy } from '../data/mock';
import { useAuth } from '../auth/AuthProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

type PrivacyOption = 'everyone' | 'academy' | 'nobody';

const PRIVACY_OPTIONS: { key: PrivacyOption; label: string }[] = [
  { key: 'everyone', label: 'Tout le monde' },
  { key: 'academy', label: 'Mon académie' },
  { key: 'nobody', label: 'Personne' },
];

export function SettingsScreen({ navigation }: Props) {
  const { getProfile } = useApp();
  const { session, signOut } = useAuth();
  const me = getProfile(currentUserId);
  const academy = getAcademy(me.academyId);

  const [notifOpenMat, setNotifOpenMat] = useState(true);
  const [notifReplies, setNotifReplies] = useState(true);
  const [notifFollows, setNotifFollows] = useState(true);
  const [notifGrades, setNotifGrades] = useState(true);
  const [privacy, setPrivacy] = useState<PrivacyOption>('academy');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <Card style={styles.groupCard}>
          <View style={styles.row}>
            <Mail color={colors.accent} size={17} />
            <Text style={styles.rowLabel}>E-mail</Text>
            <Text style={styles.rowValue}>{session?.user?.email ?? '—'}</Text>
            <ChevronRight color={colors.textTertiary} size={16} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Lock color={colors.accent} size={17} />
            <Text style={styles.rowLabel}>Mot de passe</Text>
            <Text style={styles.rowValue}>••••••••</Text>
            <ChevronRight color={colors.textTertiary} size={16} />
          </View>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={() => navigation.navigate('Verify')}>
            <ShieldCheck color={colors.accent} size={17} />
            <Text style={styles.rowLabel}>Ma ceinture</Text>
            <Text style={styles.rowValue}>{beltLabels[me.belt]}</Text>
            <ChevronRight color={colors.textTertiary} size={16} />
          </Pressable>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Users color={colors.accent} size={17} />
            <Text style={styles.rowLabel}>Mon académie</Text>
            <Text style={styles.rowValue} numberOfLines={1}>{academy?.name ?? '—'}</Text>
            <ChevronRight color={colors.textTertiary} size={16} />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.groupCard}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Open mats près de moi</Text>
              <Meta>Nouvelles sessions dans ton quartier</Meta>
            </View>
            <Switch value={notifOpenMat} onValueChange={setNotifOpenMat} />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Réponses à mes posts</Text>
              <Meta>Quand quelqu'un commente</Meta>
            </View>
            <Switch value={notifReplies} onValueChange={setNotifReplies} />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Nouveaux abonnés</Text>
              <Meta>Quand quelqu'un te suit</Meta>
            </View>
            <Switch value={notifFollows} onValueChange={setNotifFollows} />
          </View>
          <View style={styles.divider} />
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Grades et validations</Text>
              <Meta>Suivi de tes demandes de ceinture</Meta>
            </View>
            <Switch value={notifGrades} onValueChange={setNotifGrades} />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Confidentialité</Text>
        <Card style={styles.groupCard}>
          <Meta style={styles.privacyLabel}>Qui peut me proposer un roll</Meta>
          <View style={styles.segmented}>
            {PRIVACY_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                style={[styles.segmentButton, privacy === opt.key && styles.segmentButtonActive]}
                onPress={() => setPrivacy(opt.key)}
              >
                <Text style={[styles.segmentLabel, privacy === opt.key && styles.segmentLabelActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Button label="Aide & contact" variant="secondary" style={styles.helpButton} />
        <Button label="Se déconnecter" variant="ghost" onPress={signOut} />
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
  content: { padding: spacing.screenPadding },
  sectionTitle: {
    fontFamily: fonts.condensedSemiBold,
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[2],
    marginTop: spacing[2],
  },
  groupCard: { padding: 0, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  rowLabel: { fontFamily: fonts.bodyMedium, fontSize: 14.5, color: colors.text, flex: 1 },
  rowValue: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.textMuted, marginRight: spacing[2] },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider, marginLeft: spacing[4] },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  privacyLabel: { paddingHorizontal: spacing[4], paddingTop: spacing[3] },
  segmented: { flexDirection: 'row', padding: spacing[3], gap: spacing[2] },
  segmentButton: {
    flex: 1,
    height: 34,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  segmentLabel: { fontFamily: fonts.bodyMedium, fontSize: 11.5, color: colors.textMuted },
  segmentLabelActive: { color: colors.onAccent },
  helpButton: { marginTop: spacing[4], marginBottom: spacing[3] },
});
