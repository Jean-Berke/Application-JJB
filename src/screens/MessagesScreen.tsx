import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/ui/Avatar';
import { BeltBadge } from '../components/ui/BeltBadge';
import { currentUserId } from '../data/mock';
import { useApp } from '../data/store';
import { Conversation } from '../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Messages'>;

export function MessagesScreen({ navigation }: Props) {
  const { conversations, messages, openedConversationIds, getProfile } = useApp();

  function renderItem({ item }: { item: Conversation }) {
    const otherId = item.participantIds.find((id) => id !== currentUserId)!;
    const other = getProfile(otherId);
    const conversationMessages = messages
      .filter((m) => m.conversationId === item.id)
      .sort((a, b) => a.id.localeCompare(b.id));
    const lastMessage = conversationMessages[conversationMessages.length - 1];
    const isUnread = !openedConversationIds.has(item.id) && lastMessage?.senderId !== currentUserId;

    return (
      <Pressable style={styles.row} onPress={() => navigation.navigate('Chat', { conversationId: item.id })}>
        <Avatar name={other.displayName} size={44} />
        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{other.displayName}</Text>
            <BeltBadge belt={other.belt} stripes={other.stripes} width={20} height={8} />
          </View>
          {lastMessage && (
            <Text style={[styles.preview, isUnread && styles.previewUnread]} numberOfLines={1}>
              {lastMessage.body}
            </Text>
          )}
        </View>
        <View style={styles.trailing}>
          {lastMessage && <Text style={styles.timestamp}>{lastMessage.createdAtLabel}</Text>}
          {isUnread && <View style={styles.dot} />}
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
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
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  headerTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 17, color: colors.text },
  list: { paddingHorizontal: spacing.screenPadding },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  name: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  preview: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  previewUnread: { color: colors.text, fontFamily: fonts.bodyMedium },
  trailing: { alignItems: 'flex-end', gap: 4 },
  timestamp: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: colors.textMuted },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
});
