import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Settings } from 'lucide-react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/ui/Avatar';
import { BeltBadge } from '../components/ui/BeltBadge';
import { VerifiedBadge } from '../components/ui/VerifiedBadge';
import { Button } from '../components/ui/Button';
import { PostCard } from '../components/PostCard';
import { useApp } from '../data/store';
import { currentUserId } from '../data/mock';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profil'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: Props) {
  const { posts, getProfile, getAcademy, setViewMode } = useApp();
  const me = getProfile(currentUserId);
  const academy = getAcademy(me.academyId);
  const myPosts = posts.filter((p) => p.authorId === currentUserId);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <View style={styles.banner} />
        <View style={styles.headerRow}>
          <View style={styles.avatarWrap}>
            <Avatar name={me.displayName} size={70} />
          </View>
          <View style={styles.headerActions}>
            <Button label="Modifier" variant="secondary" block={false} style={styles.editButton} />
            {me.isCoach && (
              <Button
                label="Vue club"
                variant="secondary"
                block={false}
                style={styles.editButton}
                onPress={() => setViewMode('club')}
              />
            )}
            <Pressable style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
              <Settings color={colors.text} size={18} />
            </Pressable>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{me.displayName}</Text>
            {me.beltVerified && <VerifiedBadge size={16} />}
          </View>
          <Text style={styles.handle}>@{me.handle}</Text>

          <Pressable style={styles.beltRow} onPress={() => navigation.navigate('Verify')}>
            <BeltBadge belt={me.belt} stripes={me.stripes} width={72} height={20} />
          </Pressable>

          {!!me.bio && <Text style={styles.bio}>{me.bio}</Text>}

          {academy && <Text style={styles.academy}>{academy.name}</Text>}

          <View style={styles.counts}>
            <Text style={styles.countText}><Text style={styles.countNumber}>{me.followingCount}</Text> abonnements</Text>
            <Text style={styles.countText}><Text style={styles.countNumber}>{me.followerCount}</Text> abonnés</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Posts</Text>
          <Text style={styles.tabLabel}>Techniques</Text>
          <Text style={styles.tabLabel}>Médailles</Text>
        </View>

        <View style={styles.posts}>
          {myPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => navigation.navigate('Thread', { postId: post.id })}
              onPressAuthor={() => {}}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  banner: { height: 92, backgroundColor: colors.accent200 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.screenPadding,
    marginTop: -30,
  },
  avatarWrap: { borderWidth: 3, borderColor: colors.bg, borderRadius: 38 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] },
  editButton: { paddingHorizontal: spacing[4] },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { paddingHorizontal: spacing.screenPadding, marginTop: spacing[4] },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fonts.condensedBold, fontSize: 21, color: colors.text },
  handle: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  beltRow: { marginTop: spacing[3], alignSelf: 'flex-start' },
  bio: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.text, marginTop: spacing[3], lineHeight: 20 },
  academy: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted, marginTop: spacing[2] },
  counts: { flexDirection: 'row', gap: spacing[4], marginTop: spacing[3] },
  countText: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.textMuted },
  countNumber: { fontFamily: fonts.bodySemiBold, color: colors.text },
  tabs: {
    flexDirection: 'row',
    gap: spacing[6],
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing[6],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    paddingBottom: spacing[3],
  },
  tabLabel: { fontFamily: fonts.condensedSemiBold, fontSize: 14, color: colors.textTertiary },
  tabLabelActive: { color: colors.accent },
  posts: { padding: spacing.screenPadding },
});
