import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChevronLeft, Send } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing, beltLabels } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/ui/Avatar';
import { currentUserId } from '../data/mock';
import { useApp } from '../data/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export function ChatScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { conversations, messagesFor, sendMessage, markConversationOpened, getProfile } = useApp();
  const [draft, setDraft] = useState('');

  const conversation = conversations.find((c) => c.id === conversationId);
  const otherId = conversation?.participantIds.find((id) => id !== currentUserId);
  const other = otherId ? getProfile(otherId) : null;
  const conversationMessages = messagesFor(conversationId);

  useEffect(() => {
    markConversationOpened(conversationId);
  }, [conversationId]);

  if (!other) return null;

  function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    sendMessage(conversationId, trimmed);
    setDraft('');
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <Avatar name={other.displayName} size={34} />
        <View style={{ marginLeft: spacing[2] }}>
          <Text style={styles.name}>{other.displayName}</Text>
          <Text style={styles.grade}>{beltLabels[other.belt]}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.messages}>
        {conversationMessages.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <View key={m.id} style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowOther]}>
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{m.body}</Text>
              </View>
              <Text style={[styles.timestamp, mine && styles.timestampMine]}>{m.createdAtLabel}</Text>
            </View>
          );
        })}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.composeBar}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Écrire un message…"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            multiline
          />
          <Pressable onPress={handleSend} style={styles.sendButton} disabled={!draft.trim()}>
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
    gap: spacing[3],
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  name: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  grade: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.textMuted },
  messages: { padding: spacing.screenPadding },
  bubbleRow: { marginBottom: spacing[3], maxWidth: '76%' },
  bubbleRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubbleRowOther: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { borderRadius: radii.md, paddingHorizontal: spacing[3], paddingVertical: spacing[2] },
  bubbleMine: { backgroundColor: colors.accent },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  bubbleText: { fontFamily: fonts.bodyRegular, fontSize: 14.5, lineHeight: 20, color: colors.text },
  bubbleTextMine: { color: colors.onAccent },
  timestamp: { fontFamily: fonts.bodyRegular, fontSize: 10.5, color: colors.textTertiary, marginTop: 3 },
  timestampMine: { color: 'rgba(243,239,233,0.4)' },
  composeBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.screenPadding,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    gap: spacing[3],
  },
  input: {
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
