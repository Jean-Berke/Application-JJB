import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, beltLabels } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Input } from '../components/ui/Input';
import { Tag } from '../components/ui/Tag';
import { Avatar } from '../components/ui/Avatar';
import { BeltBadge } from '../components/ui/BeltBadge';
import { Meta } from '../components/ui/Typography';
import { profiles, techniques, currentUserId } from '../data/mock';
import { techniqueCategoryLabels } from '../data/types';
import { normalizeSearch } from '../utils/text';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const FREQUENT_SEARCHES = ['Garde fermée', 'Triangle', 'Toréador', 'Berimbolo', 'Étranglement'];

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const trimmed = query.trim();
  const normalizedQuery = normalizeSearch(trimmed);

  const matchingProfiles = trimmed
    ? profiles.filter((p) => p.id !== currentUserId && normalizeSearch(p.displayName).includes(normalizedQuery))
    : [];
  const matchingTechniques = trimmed
    ? techniques.filter((t) => normalizeSearch(t.title).includes(normalizedQuery))
    : [];

  const hasResults = matchingProfiles.length > 0 || matchingTechniques.length > 0;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Input placeholder="Rechercher" value={query} onChangeText={setQuery} autoFocus />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!trimmed && (
          <>
            <Text style={styles.sectionTitle}>Recherches fréquentes</Text>
            <View style={styles.chipsWrap}>
              {FREQUENT_SEARCHES.map((label) => (
                <Tag key={label} label={label} onPress={() => setQuery(label)} />
              ))}
            </View>
          </>
        )}

        {trimmed && hasResults && (
          <>
            {matchingProfiles.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Pratiquants</Text>
                {matchingProfiles.map((p) => (
                  <Pressable
                    key={p.id}
                    style={styles.profileRow}
                    onPress={() => navigation.navigate('UserProfile', { profileId: p.id })}
                  >
                    <Avatar name={p.displayName} size={36} />
                    <View style={{ marginLeft: spacing[3], flex: 1 }}>
                      <Text style={styles.profileName}>{p.displayName}</Text>
                      <Meta>@{p.handle} · {beltLabels[p.belt]}</Meta>
                    </View>
                    <BeltBadge belt={p.belt} stripes={p.stripes} width={28} height={10} />
                  </Pressable>
                ))}
              </>
            )}

            {matchingTechniques.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Techniques</Text>
                {matchingTechniques.map((t) => (
                  <Pressable
                    key={t.id}
                    style={styles.techniqueRow}
                    onPress={() => navigation.navigate('TechniqueDetail', { techniqueId: t.id })}
                  >
                    <View style={styles.techniqueThumb} />
                    <View style={{ marginLeft: spacing[3], flex: 1 }}>
                      <Text style={styles.techniqueTitle}>{t.title}</Text>
                      <Meta>{techniqueCategoryLabels[t.category]} · {t.durationLabel}</Meta>
                    </View>
                  </Pressable>
                ))}
              </>
            )}
          </>
        )}

        {trimmed && !hasResults && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucun résultat</Text>
            <Meta>Essaie un autre terme, ou vérifie l'orthographe.</Meta>
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
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  content: { padding: spacing.screenPadding },
  sectionTitle: {
    fontFamily: fonts.condensedSemiBold,
    fontSize: 15,
    color: colors.text,
    marginTop: spacing[3],
    marginBottom: spacing[3],
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  profileName: { fontFamily: fonts.bodySemiBold, fontSize: 14.5, color: colors.text },
  techniqueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  techniqueThumb: { width: 46, height: 36, borderRadius: 6, backgroundColor: colors.accent200 },
  techniqueTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14.5, color: colors.text },
  empty: { padding: spacing[8], alignItems: 'center', gap: spacing[2] },
  emptyTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 18, color: colors.text },
});
