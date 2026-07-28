import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable } from 'react-native';
import { MessageCircle, ShieldCheck, MapPin, Heart, UserPlus } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { useApp } from '../data/store';
import { currentUserId } from '../data/mock';
import { AppNotification, NotificationKind } from '../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const KIND_ICONS: Record<NotificationKind, typeof MessageCircle> = {
  reply: MessageCircle,
  grade: ShieldCheck,
  openmat: MapPin,
  like: Heart,
  follow: UserPlus,
};

export function NotificationsScreen({ navigation }: Props) {
  const { notifications, getProfile, markAllNotificationsRead } = useApp();
  const myNotifications = notifications
    .filter((n) => n.profileId === currentUserId)
    .sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));

  function renderItem({ item }: { item: AppNotification }) {
    const actor = getProfile(item.actorId);
    const Icon = KIND_ICONS[item.kind];
    return (
      <Pressable
        style={[styles.row, !item.read && styles.rowUnread]}
        onPress={() => navigation.navigate('UserProfile', { profileId: item.actorId })}
      >
        <View style={[styles.iconBadge, !item.read && styles.iconBadgeUnread]}>
          <Icon color={item.read ? colors.textMuted : colors.accent} size={16} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text style={styles.message}>
            <Text style={styles.actorName}>{actor.displayName}</Text> {item.message}
          </Text>
          <Text style={styles.timestamp}>{item.createdAtLabel}</Text>
        </View>
        {!item.read && <View style={styles.dot} />}
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Pressable onPress={markAllNotificationsRead}>
          <Text style={styles.readAllLabel}>Tout lire</Text>
        </Pressable>
      </View>

      <FlatList
        data={myNotifications}
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
  headerTitle: { fontFamily: fonts.condensedBold, fontSize: 21, color: colors.text },
  readAllLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent },
  list: { paddingVertical: spacing[2] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing[3],
  },
  rowUnread: { backgroundColor: colors.accent100 },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeUnread: { backgroundColor: 'rgba(232,84,58,0.18)' },
  message: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.text, lineHeight: 19 },
  actorName: { fontFamily: fonts.bodySemiBold },
  timestamp: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: colors.textMuted, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.accent, marginLeft: spacing[2] },
});
