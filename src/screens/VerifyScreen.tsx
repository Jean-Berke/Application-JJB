import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing, beltLabels } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { BeltBadge } from '../components/ui/BeltBadge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { currentUserId } from '../data/mock';

type Props = NativeStackScreenProps<RootStackParamList, 'Verify'>;

export function VerifyScreen({ navigation }: Props) {
  const { getProfile, promotions, requestVerification, academyMembers } = useApp();
  const me = getProfile(currentUserId);
  const coachProfile = me.academyId
    ? academyMembers(me.academyId).find((p) => p.isCoach && p.id !== me.id) ?? null
    : null;

  const pending = promotions.find((p) => p.profileId === currentUserId && p.status === 'pending');
  const history = promotions.filter((p) => p.profileId === currentUserId && p.status === 'approved');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Vérification de ceinture</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.centeredCard}>
          <BeltBadge belt={me.belt} stripes={me.stripes} width={100} height={26} />
          <Text style={styles.beltTitle}>
            Ceinture {beltLabels[me.belt].toLowerCase()}
            {me.stripes > 0 ? ` · ${me.stripes} barrette${me.stripes > 1 ? 's' : ''}` : ''}
          </Text>
          {pending ? (
            <Tag label="En attente de validation" variant="outline" />
          ) : me.beltVerified ? (
            <Tag label="Ceinture vérifiée par le coach" variant="accent" />
          ) : (
            <Tag label="Non vérifiée" variant="neutral" />
          )}
        </Card>

        <Card>
          <Text style={styles.explainTitle}>Pourquoi vérifier ta ceinture ?</Text>
          <Text style={styles.explainBody}>
            Une fois validé par ton coach, ton grade devient non modifiable par toi-même. C'est ce qui rend
            le badge vérifié fiable pour toute la communauté.
          </Text>

          {coachProfile && (
            <View style={styles.coachRow}>
              <Avatar name={coachProfile.displayName} size={36} />
              <View style={{ marginLeft: spacing[3] }}>
                <Text style={styles.coachName}>{coachProfile.displayName}</Text>
                <Meta>{beltLabels[coachProfile.belt]} · coach</Meta>
              </View>
            </View>
          )}

          <Button
            label={pending ? 'Demande envoyée' : 'Demander la vérification'}
            disabled={!!pending || me.beltVerified}
            onPress={() => requestVerification(currentUserId)}
            style={styles.requestButton}
          />
        </Card>

        {history.length > 0 && (
          <Card>
            <Text style={styles.explainTitle}>Historique validé</Text>
            {history.map((h) => (
              <View key={h.id} style={styles.historyRow}>
                <Text style={styles.historyBelt}>
                  {beltLabels[h.belt]}{h.stripes > 0 ? ` · ${h.stripes} barrette${h.stripes > 1 ? 's' : ''}` : ''}
                </Text>
                <Meta>{h.reviewedAtLabel}</Meta>
                <Meta>{h.reviewedBy ? getProfile(h.reviewedBy).displayName : '—'}</Meta>
              </View>
            ))}
          </Card>
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
  headerTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 16, color: colors.text },
  content: { padding: spacing.screenPadding },
  centeredCard: { alignItems: 'center', gap: spacing[3], paddingVertical: spacing[6] },
  beltTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 17, color: colors.text },
  explainTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 16, color: colors.text, marginBottom: spacing[2] },
  explainBody: { fontFamily: fonts.bodyRegular, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  coachRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing[4] },
  coachName: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text },
  requestButton: { marginTop: spacing[4] },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  historyBelt: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text, flex: 1 },
});
