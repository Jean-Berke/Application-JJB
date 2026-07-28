import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, Pressable } from 'react-native';
import { Play } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing, beltLabels } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Input } from '../components/ui/Input';
import { Tag } from '../components/ui/Tag';
import { Kicker, Meta } from '../components/ui/Typography';
import { techniques } from '../data/mock';
import { useApp } from '../data/store';
import { Technique, TechniqueCategory, techniqueCategoryLabels } from '../data/types';
import { normalizeSearch } from '../utils/text';

type Props = NativeStackScreenProps<RootStackParamList>;

const CATEGORY_FILTERS: { key: TechniqueCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'guards', label: techniqueCategoryLabels.guards },
  { key: 'passes', label: techniqueCategoryLabels.passes },
  { key: 'submissions', label: techniqueCategoryLabels.submissions },
  { key: 'takedowns', label: techniqueCategoryLabels.takedowns },
  { key: 'escapes', label: techniqueCategoryLabels.escapes },
];

export function TechniquesScreen({ navigation }: Props) {
  const { getProfile } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<TechniqueCategory | 'all'>('all');

  const filtered = techniques.filter((t) => {
    const matchesCategory = category === 'all' || t.category === category;
    const matchesSearch = normalizeSearch(t.title).includes(normalizeSearch(search));
    return matchesCategory && matchesSearch;
  });

  function renderCard({ item }: { item: Technique }) {
    const instructor = getProfile(item.instructorId);
    return (
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('TechniqueDetail', { techniqueId: item.id })}
      >
        <View style={styles.thumb}>
          <View style={styles.playButton}>
            <Play color={colors.text} size={16} fill={colors.text} />
          </View>
          <Text style={styles.duration}>{item.durationLabel}</Text>
        </View>
        <Kicker style={styles.kicker}>{techniqueCategoryLabels[item.category]}</Kicker>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Meta>{instructor.displayName} · {beltLabels[item.beltLevel]}</Meta>
        <Meta>{item.viewCount} vues</Meta>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Techniques</Text>
      </View>

      <View style={styles.searchWrap}>
        <Input placeholder="Rechercher une technique" value={search} onChangeText={setSearch} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={{ paddingHorizontal: spacing.screenPadding }}
      >
        {CATEGORY_FILTERS.map((f) => (
          <Tag key={f.key} label={f.label} active={category === f.key} onPress={() => setCategory(f.key)} />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune technique trouvée.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing[3], paddingBottom: spacing[2] },
  headerTitle: { fontFamily: fonts.condensedBold, fontSize: 25, color: colors.text },
  searchWrap: { paddingHorizontal: spacing.screenPadding },
  chipsRow: { marginTop: spacing[2], marginBottom: spacing[3], flexGrow: 0 },
  grid: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing[8] },
  column: { gap: spacing[3] },
  card: { flex: 1, marginBottom: spacing[4] },
  thumb: {
    height: 130,
    borderRadius: radii.sm,
    backgroundColor: colors.accent200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
    position: 'relative',
    overflow: 'hidden',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.text,
  },
  kicker: { marginBottom: 2 },
  title: { fontFamily: fonts.condensedSemiBold, fontSize: 15.5, color: colors.text, marginBottom: 2 },
  empty: { padding: spacing[8], alignItems: 'center' },
  emptyText: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.textMuted },
});
