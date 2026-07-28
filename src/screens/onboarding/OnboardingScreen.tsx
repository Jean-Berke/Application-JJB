import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Pressable, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, radii, BeltLevel, beltLabels } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Tag } from '../../components/ui/Tag';
import { BeltBadge } from '../../components/ui/BeltBadge';
import { H4, Body, Meta } from '../../components/ui/Typography';
import { academies } from '../../data/mock';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const BELTS: BeltLevel[] = ['white', 'blue', 'purple', 'brown', 'black'];
const INTERESTS = ['Gardes', 'Passages', 'Soumissions', 'Amenées au sol', 'Sorties', 'No-Gi', 'Compétition', 'Défense'];

export function OnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState(1);
  const [belt, setBelt] = useState<BeltLevel>('white');
  const [stripes, setStripes] = useState(0);
  const [academySearch, setAcademySearch] = useState('');
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [remindersOn, setRemindersOn] = useState(true);

  const canContinue = step === 3 ? interests.length > 0 : true;
  const filteredAcademies = academies.filter((a) =>
    a.name.toLowerCase().includes(academySearch.toLowerCase())
  );

  function toggleInterest(label: string) {
    setInterests((prev) => (prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]));
  }

  function handleContinue() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.progressRow}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={[styles.progressSegment, s <= step && styles.progressSegmentActive]} />
        ))}
      </View>
      <Text style={styles.stepLabel}>Étape {step} / 3</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <>
            <H4 style={styles.title}>Quelle est ta ceinture ?</H4>
            <Body style={styles.subtitle}>
              Elle sera affichée sur ton profil, et vérifiée par ton coach.
            </Body>
            {BELTS.map((b) => {
              const selected = b === belt;
              return (
                <Pressable
                  key={b}
                  onPress={() => setBelt(b)}
                  style={[styles.beltRow, selected && styles.beltRowSelected]}
                >
                  <BeltBadge belt={b} stripes={0} width={44} height={16} />
                  <Text style={styles.beltName}>{beltLabels[b]}</Text>
                  {selected && <Check color={colors.accent} size={18} />}
                </Pressable>
              );
            })}
            {belt !== 'black' && (
              <View style={styles.stripesRow}>
                {['—', 1, 2, 3, 4].map((s, i) => (
                  <Pressable
                    key={i}
                    onPress={() => setStripes(i === 0 ? 0 : (s as number))}
                    style={[styles.stripeChip, stripes === (i === 0 ? 0 : s) && styles.stripeChipActive]}
                  >
                    <Text style={styles.stripeChipLabel}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <H4 style={styles.title}>Ton académie</H4>
            <Body style={styles.subtitle}>Trouve ta salle pour rejoindre sa communauté.</Body>
            <Input placeholder="Rechercher une académie" value={academySearch} onChangeText={setAcademySearch} />
            {filteredAcademies.map((a) => {
              const selected = a.id === academyId;
              return (
                <Pressable
                  key={a.id}
                  onPress={() => setAcademyId(a.id)}
                  style={[styles.academyRow, selected && styles.beltRowSelected]}
                >
                  <View style={styles.academyLogo} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.academyName}>{a.name}</Text>
                    <Meta>{a.neighborhood} · {a.memberCount} membres</Meta>
                  </View>
                  {selected && <Check color={colors.accent} size={18} />}
                </Pressable>
              );
            })}
            <Pressable style={styles.notListed}>
              <Text style={styles.notListedText}>Mon académie n'est pas dans la liste</Text>
            </Pressable>
          </>
        )}

        {step === 3 && (
          <>
            <H4 style={styles.title}>Tes centres d'intérêt</H4>
            <Body style={styles.subtitle}>Ça nous aide à personnaliser ton fil.</Body>
            <View style={styles.chipsWrap}>
              {INTERESTS.map((label) => (
                <Tag
                  key={label}
                  label={label}
                  active={interests.includes(label)}
                  variant="neutral"
                  onPress={() => toggleInterest(label)}
                />
              ))}
            </View>

            <View style={styles.remindersCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.remindersTitle}>Rappels open mat</Text>
                <Meta>Reçois une alerte avant chaque session à laquelle tu es inscrit.</Meta>
              </View>
              <Switch value={remindersOn} onValueChange={setRemindersOn} />
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={step < 3 ? 'Continuer' : 'Entrer dans OSS'}
          disabled={!canContinue}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  progressRow: { flexDirection: 'row', gap: 6, paddingHorizontal: spacing.screenPadding, paddingTop: spacing[4] },
  progressSegment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.neutral200 },
  progressSegmentActive: { backgroundColor: colors.accent },
  stepLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing[2],
  },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.screenPadding + 6, paddingBottom: spacing[8] },
  title: { marginBottom: spacing[1] },
  subtitle: { color: colors.textMuted, marginBottom: spacing[6] },
  beltRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: spacing[2],
  },
  beltRowSelected: { backgroundColor: colors.accent100, borderColor: colors.accent },
  beltName: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
  stripesRow: { flexDirection: 'row', gap: spacing[2], marginTop: spacing[3] },
  stripeChip: {
    flex: 1,
    height: 40,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripeChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  stripeChipLabel: { fontFamily: fonts.bodySemiBold, color: colors.text },
  academyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    marginTop: spacing[3],
  },
  academyLogo: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.neutral200 },
  academyName: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  notListed: { marginTop: spacing[4], alignSelf: 'center' },
  notListedText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  remindersCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[6],
    padding: spacing[4],
    borderRadius: radii.md,
    backgroundColor: colors.accent100,
    borderWidth: 1,
    borderColor: 'rgba(232,84,58,0.25)',
  },
  remindersTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text, marginBottom: 2 },
  footer: { padding: spacing.screenPadding + 6, paddingTop: spacing[3] },
});
