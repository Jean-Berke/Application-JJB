import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Heart, MessageCircle, Repeat2, Share, Play } from 'lucide-react-native';
import { colors, radii, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from './ui/Avatar';
import { BeltBadge } from './ui/BeltBadge';
import { VerifiedBadge } from './ui/VerifiedBadge';
import { Tag } from './ui/Tag';
import { Post } from '../data/types';
import { getProfile } from '../data/mock';
import { useApp } from '../data/store';

type Props = {
  post: Post;
  onPress: () => void;
  onPressAuthor: () => void;
};

export function PostCard({ post, onPress, onPressAuthor }: Props) {
  const author = getProfile(post.authorId);
  const { toggleLike } = useApp();

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Avatar name={author.displayName} size={36} />
        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <View style={styles.nameRow}>
            <Pressable onPress={(e) => { e.stopPropagation(); onPressAuthor(); }}>
              <Text style={styles.name}>{author.displayName}</Text>
            </Pressable>
            {author.isCoach && author.beltVerified && (
              <View style={{ marginLeft: 4 }}>
                <VerifiedBadge size={14} />
              </View>
            )}
            <Text style={styles.meta}> @{author.handle} · {post.createdAtLabel}</Text>
          </View>
          <View style={styles.beltRow}>
            <BeltBadge belt={author.belt} stripes={author.stripes} width={28} height={10} />
            <Text style={styles.beltLabel}>{author.belt.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.body}>{post.body}</Text>

      {post.mediaType && (
        <View style={styles.media}>
          {post.mediaType === 'video' && (
            <View style={styles.playButton}>
              <Play color={colors.text} size={18} fill={colors.text} />
            </View>
          )}
          {post.mediaCaption && <Text style={styles.mediaCaption}>{post.mediaCaption}</Text>}
        </View>
      )}

      {post.techniqueTitle && (
        <View style={styles.tagRow}>
          <Tag label={post.techniqueTitle} variant="outline" />
        </View>
      )}

      <View style={styles.actions}>
        <View style={styles.actionItem}>
          <MessageCircle color={colors.textTertiary} size={16} strokeWidth={1.7} />
          <Text style={styles.actionLabel}>{post.replyCount}</Text>
        </View>
        <View style={styles.actionItem}>
          <Repeat2 color={colors.textTertiary} size={16} strokeWidth={1.7} />
          <Text style={styles.actionLabel}>{post.repostCount}</Text>
        </View>
        <Pressable
          style={styles.actionItem}
          onPress={(e) => {
            e.stopPropagation();
            toggleLike(post.id);
          }}
        >
          <Heart
            color={post.liked ? colors.accent : colors.textTertiary}
            fill={post.liked ? colors.accent : 'none'}
            size={16}
            strokeWidth={1.7}
          />
          <Text style={[styles.actionLabel, post.liked && { color: colors.accent }]}>{post.likeCount}</Text>
        </Pressable>
        <View style={styles.actionItem}>
          <Share color={colors.textTertiary} size={15} strokeWidth={1.7} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardMargin,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  name: { fontFamily: fonts.condensedSemiBold, fontSize: 16, color: colors.text },
  meta: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.textMuted },
  beltRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 6 },
  beltLabel: { fontFamily: fonts.bodyRegular, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase' },
  body: { fontFamily: fonts.bodyRegular, fontSize: 14, lineHeight: 20, color: colors.text, marginTop: spacing[3] },
  media: {
    height: 150,
    borderRadius: radii.sm,
    backgroundColor: colors.accent200,
    marginTop: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaCaption: {
    position: 'absolute',
    bottom: spacing[2],
    left: spacing[2],
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.text,
  },
  tagRow: { flexDirection: 'row', marginTop: spacing[3] },
  actions: { flexDirection: 'row', gap: spacing[6], marginTop: spacing[3] },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionLabel: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: colors.textMuted },
});
