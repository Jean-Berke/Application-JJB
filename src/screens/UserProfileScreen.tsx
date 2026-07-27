import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, MessageCircle, MapPin } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/ui/Avatar';
import { BeltBadge } from '../components/ui/BeltBadge';
import { VerifiedBadge } from '../components/ui/VerifiedBadge';
import { Tag } from '../components/ui/Tag';
import { ToggleButton } from '../components/ui/ToggleButton';
import { PostCard } from '../components/PostCard';
import { useApp } from '../data/store';
import { getAcademy, getProfile } from '../data/mock';

type Props = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;

export function UserProfileScreen({ route, navigation }: Props) {
  const { profileId } = route.params;
  const profile = getProfile(profileId);
  const academy = getAcademy(profile.academyId);
  const { posts, followedIds, toggleFollow } = useApp();
  const userPosts = posts.filter((p) => p.authorId === profileId);
  const isFollowing = followedIds.has(profileId);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <LinearGradient colors={[colors.accent300, colors.accent100]} style={styles.banner}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={12}>
            <ChevronLeft color={colors.text} size={20} />
          </Pressable>
        </LinearGradient>

        <View style={styles.headerRow}>
          <View style={styles.avatarWrap}>
            <Avatar name={profile.displayName} size={74} />
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton}>
              <MessageCircle color={colors.text} size={17} />
            </Pressable>
            <ToggleButton
              active={isFollowing}
              activeLabel="Suivi"
              inactiveLabel="Suivre"
              onPress={() => toggleFollow(profileId)}
              block={false}
            />
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.displayName}</Text>
            {profile.beltVerified && <VerifiedBadge size={16} />}
          </View>
          <Text style={styles.handle}>@{profile.handle}</Text>

          <View style={styles.beltRow}>
            <BeltBadge belt={profile.belt} stripes={profile.stripes} width={72} height={20} />
            {profile.beltVerified && (
              <View style={{ marginLeft: spacing[2] }}>
                <Tag label="Vérifiée" variant="outline" />
              </View>
            )}
          </View>

          {!!profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          {academy && (
            <View style={styles.academyRow}>
              <MapPin color={colors.textMuted} size={14} />
              <Text style={styles.academy}>{academy.name}</Text>
            </View>
          )}

          <View style={styles.counts}>
            <Text style={styles.countText}><Text style={styles.countNumber}>{profile.followingCount}</Text> abonnements</Text>
            <Text style={styles.countText}><Text style={styles.countNumber}>{profile.followerCount}</Text> abonnés</Text>
          </View>
        </View>

        <View style={styles.posts}>
          {userPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() => navigation.push('Thread', { postId: post.id })}
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
  banner: { height: 100, justifyContent: 'flex-end' },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.screenPadding,
    marginBottom: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.screenPadding,
    marginTop: -30,
  },
  avatarWrap: { borderWidth: 3, borderColor: colors.bg, borderRadius: 40 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] },
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
  beltRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing[3] },
  bio: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.text, marginTop: spacing[3], lineHeight: 20 },
  academyRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing[2] },
  academy: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  counts: { flexDirection: 'row', gap: spacing[4], marginTop: spacing[3] },
  countText: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.textMuted },
  countNumber: { fontFamily: fonts.bodySemiBold, color: colors.text },
  posts: { padding: spacing.screenPadding, marginTop: spacing[3] },
});
