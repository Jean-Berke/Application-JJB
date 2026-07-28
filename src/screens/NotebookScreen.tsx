import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { currentUserId } from '../data/mock';
import { NotebookStatus, notebookStatusLabels } from '../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Notebook'>;

type FilterKey = 'all' | NotebookStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'to_review', label: notebookStatusLabels.to_review },
  { key: 'in_progress', label: notebookStatusLabels.in_progress },
  { key: 'mastered', label: notebookStatusLabels.mastered },
];

export function NotebookScreen({ navigation }: Props) {
  const { notebookEntries, cycleNotebookStatus } = useApp();
  const [filter, setFilter] = useState<FilterKey>('all');

  const myEntries = notebookEntries.filter((e) => e.profileId === currentUserId);
  const inProgressCount = myEntries.filter((e) => e.status === 'in_progress').length;
  const toReviewCount = myEntries.filter((e) => e.status === 'to_review').length;
  const masteredCount = myEntries.filter((e) => e.status === 'mastered').length;

  const filtered = filter === 'all' ? myEntries : myEntries.filter((e) => e.status === filter);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Carnet</Text>
        <Pressable onPress={() => navigation.navigate('Main', { screen: 'Techniques' })} hitSlop={8}>
          <Plus color={colors.text} size={20} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.counters}>
          <View style={styles.counterTile}>
            <Text style={styles.counterNumber}>{inProgressCount}</Text>
            <Meta>En cours</Meta>
          </View>
          <View style={styles.counterTile}>
            <Text style={styles.counterNumber}>{toReviewCount}</Text>
            <Meta>À revoir</Meta>
          </View>
          <View style={styles.counterTile}>
            <Text style={styles.counterNumber}>{masteredCount}</Text>
            <Meta>Maîtrisées</Meta>
          </View>
        </View>

        <View style={styles.chipsWrap}>
          {FILTERS.map((f) => (
            <Tag key={f.key} label={f.label} active={filter === f.key} onPress={() => setFilter(f.key)} />
          ))}
        </View>

        {filtered.map((entry) => (
          <Card key={entry.id}>
            <View style={styles.cardHeader}>
              <Text style={styles.kicker}>{entry.category.toUpperCase()}</Text>
              {entry.isWeakness && <Tag label="Point faible" variant="outline" />}
            </View>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Pressable onPress={() => cycleNotebookStatus(entry.id)} style={styles.statusChip}>
              <Tag label={notebookStatusLabels[entry.status]} active />
            </Pressable>
            {!!entry.note && <Text style={styles.note}>{entry.note}</Text>}
            <View style={styles.metaRow}>
              <Meta>
                {entry.lastDrilledLabel ? `Dernière séance ${entry.lastDrilledLabel}` : 'Pas encore drillée'}
              </Meta>
              <Meta>{entry.drillCount} drills</Meta>
            </View>
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune entrée pour ce filtre.</Text>
          </View>
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
  counterNumber: { fontFamily: fonts.condensedBold, fontSize: 24, color: colors.text },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[4] },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[1] },
  kicker: { fontFamily: fonts.condensedSemiBold, fontSize: 11.5, letterSpacing: 1.1, color: colors.accent },
  entryTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 17, color: colors.text, marginBottom: spacing[2] },
  statusChip: { alignSelf: 'flex-start', marginBottom: spacing[2] },
  note: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.textMuted,
    paddingTop: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    marginBottom: spacing[2],
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  empty: { padding: spacing[8], alignItems: 'center' },
  emptyText: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.textMuted },
});
