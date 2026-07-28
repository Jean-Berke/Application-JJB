import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { ChevronLeft, Send } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/ui/Avatar';
import { BeltBadge } from '../components/ui/BeltBadge';
import { VerifiedBadge } from '../components/ui/VerifiedBadge';
import { H6 } from '../components/ui/Typography';
import { useApp } from '../data/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Thread'>;

export function ThreadScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const { posts, repliesFor, getProfile } = useApp();
  const [draft, setDraft] = useState('');

  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  const author = getProfile(post.authorId);
  const threadReplies = repliesFor(postId);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Fil de discussion</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.parentHeader}>
          <Avatar name={author.displayName} size={40} />
          <View style={{ marginLeft: spacing[3], flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{author.displayName}</Text>
              {author.beltVerified && author.isCoach && <VerifiedBadge size={14} />}
            </View>
            <Text style={styles.handle}>@{author.handle}</Text>
          </View>
        </View>

        <Text style={styles.parentBody}>{post.body}</Text>
        <View style={styles.beltRow}>
          <BeltBadge belt={author.belt} stripes={author.stripes} width={30} height={11} />
        </View>
        <Text style={styles.parentMeta}>{post.createdAtLabel} · {post.replyCount} conseils</Text>

        <View style={styles.divider} />
        <H6 style={styles.sectionTitle}>Conseils de la commu</H6>

        {threadReplies.map((reply) => {
          const replyAuthor = getProfile(reply.authorId);
          return (
            <View key={reply.id} style={styles.replyCard}>
              <View style={styles.replyHeader}>
                <Avatar name={replyAuthor.displayName} size={32} />
                <View style={{ marginLeft: spacing[2], flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.replyName}>{replyAuthor.displayName}</Text>
                    <View style={{ marginLeft: spacing[2] }}>
                      <BeltBadge belt={replyAuthor.belt} stripes={replyAuthor.stripes} width={24} height={9} />
                    </View>
                  </View>
                  <Text style={styles.handle}>{reply.createdAtLabel}</Text>
                </View>
              </View>
              <Text style={styles.replyBody}>{reply.body}</Text>
              <Text style={styles.replyLikes}>{reply.likeCount} j'aime</Text>
            </View>
          );
        })}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.composeBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ajouter un conseil…"
            placeholderTextColor={colors.textTertiary}
            style={styles.composeInput}
            multiline
          />
          <Pressable style={styles.sendButton} disabled={!draft.trim()}>
            <Send color={draft.trim() ? colors.accent : colors.textTertiary} size={20} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.screenPadding },
  parentHeader: { flexDirection: 'row', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontFamily: fonts.condensedSemiBold, fontSize: 18, color: colors.text },
  handle: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.textMuted },
  parentBody: { fontFamily: fonts.bodyRegular, fontSize: 16, lineHeight: 23, color: colors.text, marginTop: spacing[4] },
  beltRow: { marginTop: spacing[3] },
  parentMeta: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: colors.textMuted, marginTop: spacing[3] },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider, marginVertical: spacing[4] },
  sectionTitle: { marginBottom: spacing[3] },
  replyCard: { marginBottom: spacing[4] },
  replyHeader: { flexDirection: 'row', alignItems: 'center' },
  replyName: { fontFamily: fonts.condensedSemiBold, fontSize: 14.5, color: colors.text },
  replyBody: {
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginTop: spacing[2],
    marginLeft: 40,
  },
  replyLikes: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: spacing[1],
    marginLeft: 40,
  },
  composeBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.screenPadding,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    gap: spacing[3],
  },
  composeInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    color: colors.text,
  },
  sendButton: { paddingBottom: spacing[2] },
});
