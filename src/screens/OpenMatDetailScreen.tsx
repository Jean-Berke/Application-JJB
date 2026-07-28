import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Bell, MapPin, Clock, User as UserIcon } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { beltLabels, colors, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Tag } from '../components/ui/Tag';
import { ToggleButton } from '../components/ui/ToggleButton';
import { Avatar } from '../components/ui/Avatar';
import { BeltBadge } from '../components/ui/BeltBadge';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { currentUserId } from '../data/mock';
import { openMatFormatLabels, openMatLevelLabels } from '../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OpenMatDetail'>;

export function OpenMatDetailScreen({ route, navigation }: Props) {
  const { openMatId } = route.params;
  const { openMats, reminderIds, toggleReminder, toggleAttendance, getProfile } = useApp();
  const openMat = openMats.find((o) => o.id === openMatId);
  if (!openMat) return null;

  const organizer = getProfile(openMat.createdBy);
  const reminderActive = reminderIds.has(openMat.id);
  const attending = openMat.attendeeIds.includes(currentUserId);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={[colors.accent300, colors.accent100]} style={styles.banner}>
          <View style={styles.bannerRow}>
            <Pressable onPress={() => navigation.goBack()} style={styles.circleButton} hitSlop={12}>
              <ChevronLeft color={colors.text} size={20} />
            </Pressable>
            <Pressable onPress={() => toggleReminder(openMat.id)} style={styles.circleButton} hitSlop={12}>
              <Bell color={reminderActive ? colors.accent : colors.text} fill={reminderActive ? colors.accent : 'none'} size={18} />
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.chipsRow}>
            {openMat.isFree && <Tag label="Gratuit" variant="outline" />}
            <Tag label={openMatLevelLabels[openMat.level]} variant="neutral" />
            <Tag label={openMatFormatLabels[openMat.format]} variant="neutral" />
          </View>

          <Text style={styles.title}>{openMat.gymName}</Text>
          <Text style={styles.subtitle}>{openMat.dayLabel} · {openMat.startTime} – {openMat.endTime}</Text>

          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <MapPin color={colors.textMuted} size={16} />
              <View style={{ marginLeft: spacing[3], flex: 1 }}>
                <Text style={styles.infoText}>{openMat.neighborhood} · {openMat.distanceKm} km</Text>
              </View>
              <Text style={styles.itineraryLink}>Itinéraire</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock color={colors.textMuted} size={16} />
              <Text style={[styles.infoText, { marginLeft: spacing[3] }]}>
                {openMat.startTime} – {openMat.endTime} · arrive 10 min avant pour t'échauffer
              </Text>
            </View>
            <View style={styles.infoRow}>
              <UserIcon color={colors.textMuted} size={16} />
              <Text style={[styles.infoText, { marginLeft: spacing[3] }]}>Organisé par {organizer.displayName}</Text>
            </View>
          </View>

          <Text style={styles.description}>{openMat.description}</Text>

          <Text style={styles.sectionTitle}>Qui vient · {openMat.attendeeIds.length} inscrits</Text>
          {openMat.attendeeIds.map((id) => {
            const attendee = getProfile(id);
            return (
              <Pressable
                key={id}
                style={styles.attendeeRow}
                onPress={() => navigation.navigate('UserProfile', { profileId: id })}
              >
                <Avatar name={attendee.displayName} size={34} />
                <View style={{ marginLeft: spacing[3], flex: 1 }}>
                  <Text style={styles.attendeeName}>{attendee.displayName}</Text>
                  <Meta>{beltLabels[attendee.belt]}</Meta>
                </View>
                <BeltBadge belt={attendee.belt} stripes={attendee.stripes} width={30} height={11} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ToggleButton
          active={attending}
          activeLabel="Je suis inscrit · me retirer"
          inactiveLabel="Je viens"
          onPress={() => toggleAttendance(openMat.id)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: spacing[8] },
  banner: { height: 130 },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing[3],
  },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: spacing.screenPadding },
  chipsRow: { flexDirection: 'row', marginBottom: spacing[3] },
  title: { fontFamily: fonts.condensedBold, fontSize: 25, color: colors.text },
  subtitle: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.textMuted, marginTop: 4 },
  infoBlock: { marginTop: spacing[4] },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  infoText: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: colors.text },
  itineraryLink: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent },
  description: { fontFamily: fonts.bodyRegular, fontSize: 14, lineHeight: 20, color: colors.text, marginTop: spacing[4] },
  sectionTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 15, color: colors.text, marginTop: spacing[6], marginBottom: spacing[2] },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  attendeeName: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text },
  footer: {
    padding: spacing.screenPadding,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
});
