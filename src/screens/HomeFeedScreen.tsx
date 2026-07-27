import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable } from 'react-native';
import { Search, MapPin, MessageCircle, Bell, ChevronRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../navigation/types';
import { colors, spacing, radii } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/ui/Avatar';
import { Kicker, Meta } from '../components/ui/Typography';
import { PostCard } from '../components/PostCard';
import { useApp } from '../data/store';
import { currentUserId, getProfile } from '../data/mock';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Fil'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Tab = 'pourToi' | 'suivis';

export function HomeFeedScreen({ navigation }: Props) {
  const [tab, setTab] = useState<Tab>('pourToi');
  const { posts, followedIds } = useApp();
  const me = getProfile(currentUserId);

  const visiblePosts = tab === 'pourToi' ? posts : posts.filter((p) => followedIds.has(p.authorId));

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.logoDot} />
          <Text style={styles.brandLabel}>OSS</Text>
        </View>
        <View style={styles.headerIcons}>
          <Pressable hitSlop={8}><Search color={colors.text} size={21} strokeWidth={1.6} /></Pressable>
          <Pressable hitSlop={8}><MapPin color={colors.text} size={21} strokeWidth={1.6} /></Pressable>
          <Pressable hitSlop={8} style={styles.iconWithDot}>
            <MessageCircle color={colors.text} size={21} strokeWidth={1.6} />
            <View style={styles.dot} />
          </Pressable>
          <Pressable hitSlop={8} style={styles.iconWithDot}>
            <Bell color={colors.text} size={21} strokeWidth={1.6} />
            <View style={styles.dot} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Profil')}>
            <Avatar name={me.displayName} size={28} />
          </Pressable>
        </View>
      </View>

      <View style={styles.tabs}>
        <Pressable style={styles.tab} onPress={() => setTab('pourToi')}>
          <Text style={[styles.tabLabel, tab === 'pourToi' && styles.tabLabelActive]}>POUR TOI</Text>
          {tab === 'pourToi' && <View style={styles.tabUnderline} />}
        </Pressable>
        <Pressable style={styles.tab} onPress={() => setTab('suivis')}>
          <Text style={[styles.tabLabel, tab === 'suivis' && styles.tabLabelActive]}>SUIVIS</Text>
          {tab === 'suivis' && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>

      <FlatList
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Pressable style={styles.techCard}>
            <Kicker>Technique du jour</Kicker>
            <View style={styles.techRow}>
              <View style={styles.techThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.techTitle}>Passage toréador</Text>
                <Meta>Coach Márcio · 6:10</Meta>
              </View>
              <ChevronRight color={colors.textTertiary} size={18} />
            </View>
          </Pressable>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {tab === 'suivis' ? 'Suis des pratiquants pour remplir ce fil.' : 'Aucun post pour le moment.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('Thread', { postId: item.id })}
            onPressAuthor={() => navigation.navigate('UserProfile', { profileId: item.authorId })}
          />
        )}
      />
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
    paddingBottom: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoDot: { width: 18, height: 18, borderRadius: 5, backgroundColor: colors.accent },
  brandLabel: { fontFamily: fonts.condensedBold, fontSize: 18, color: colors.text },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: spacing[4] },
  iconWithDot: { position: 'relative' },
  dot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  tabs: { flexDirection: 'row', paddingHorizontal: spacing.screenPadding },
  tab: { paddingVertical: spacing[3], marginRight: spacing[6] },
  tabLabel: {
    fontFamily: fonts.condensedSemiBold,
    fontSize: 13,
    letterSpacing: 13 * 0.08,
    color: colors.textTertiary,
  },
  tabLabelActive: { color: colors.text },
  tabUnderline: { height: 2, backgroundColor: colors.accent, marginTop: 6, borderRadius: 1 },
  list: { padding: spacing.screenPadding },
  techCard: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardMargin,
  },
  techRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginTop: spacing[2] },
  techThumb: { width: 56, height: 44, borderRadius: radii.sm, backgroundColor: colors.accent200 },
  techTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 15, color: colors.text },
  empty: { padding: spacing[8], alignItems: 'center' },
  emptyText: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
