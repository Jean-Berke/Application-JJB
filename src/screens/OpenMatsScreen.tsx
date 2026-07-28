import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Plus, Bell } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, radii, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Tag } from '../components/ui/Tag';
import { ToggleButton } from '../components/ui/ToggleButton';
import { Meta } from '../components/ui/Typography';
import { useApp } from '../data/store';
import { currentUserId, getAcademy } from '../data/mock';
import { DayFilter, OpenMat, OpenMatLevel, openMatFormatLabels, openMatLevelLabels } from '../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OpenMats'>;

type ViewKind = 'list' | 'map';

const LEVEL_FILTERS: { key: OpenMatLevel | 'any'; label: string }[] = [
  { key: 'any', label: 'Tous' },
  { key: 'all', label: openMatLevelLabels.all },
  { key: 'blue_plus', label: openMatLevelLabels.blue_plus },
  { key: 'competitors', label: openMatLevelLabels.competitors },
];

export function OpenMatsScreen({ navigation }: Props) {
  const { openMats, reminderIds, toggleReminder, toggleAttendance } = useApp();
  const [dayFilter, setDayFilter] = useState<DayFilter>('today');
  const [view, setView] = useState<ViewKind>('list');
  const [levelFilter, setLevelFilter] = useState<OpenMatLevel | 'any'>('any');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const academy = getAcademy('a-gb-lyon');

  const filtered = openMats.filter(
    (om) => om.dayKey === dayFilter && (levelFilter === 'any' || om.level === levelFilter)
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, OpenMat[]>();
    filtered.forEach((om) => {
      const list = groups.get(om.dayLabel) ?? [];
      list.push(om);
      groups.set(om.dayLabel, list);
    });
    return Array.from(groups.entries());
  }, [filtered]);

  const bounds = useMemo(() => {
    if (filtered.length === 0) return null;
    const lats = filtered.map((o) => o.lat);
    const lngs = filtered.map((o) => o.lng);
    return {
      minLat: Math.min(...lats) - 0.01,
      maxLat: Math.max(...lats) + 0.01,
      minLng: Math.min(...lngs) - 0.01,
      maxLng: Math.max(...lngs) + 0.01,
    };
  }, [filtered]);

  const selected = filtered.find((o) => o.id === selectedId) ?? null;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        {navigation.canGoBack() ? (
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <ChevronLeft color={colors.text} size={22} />
          </Pressable>
        ) : (
          <View style={{ width: 22 }} />
        )}
        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text style={styles.headerTitle}>Open mats</Text>
          <Meta>{academy?.city ?? 'Lyon'}</Meta>
        </View>
        <Pressable style={styles.addButton} onPress={() => navigation.navigate('OpenMatAdd')} hitSlop={8}>
          <Plus color={colors.text} size={20} />
        </Pressable>
      </View>

      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleHalf, dayFilter === 'today' && styles.toggleHalfActive]}
          onPress={() => setDayFilter('today')}
        >
          <Text style={[styles.toggleLabel, dayFilter === 'today' && styles.toggleLabelActive]}>Aujourd'hui</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleHalf, dayFilter === 'week' && styles.toggleHalfActive]}
          onPress={() => setDayFilter('week')}
        >
          <Text style={[styles.toggleLabel, dayFilter === 'week' && styles.toggleLabelActive]}>Cette semaine</Text>
        </Pressable>
      </View>

      <View style={styles.viewRow}>
        <Pressable
          style={[styles.viewButton, view === 'list' && styles.viewButtonActive]}
          onPress={() => setView('list')}
        >
          <Text style={[styles.viewButtonLabel, view === 'list' && styles.viewButtonLabelActive]}>Liste</Text>
        </Pressable>
        <Pressable
          style={[styles.viewButton, view === 'map' && styles.viewButtonActive]}
          onPress={() => setView('map')}
        >
          <Text style={[styles.viewButtonLabel, view === 'map' && styles.viewButtonLabelActive]}>Carte</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow} contentContainerStyle={{ paddingHorizontal: spacing.screenPadding }}>
        {LEVEL_FILTERS.map((f) => (
          <Tag key={f.key} label={f.label} active={levelFilter === f.key} onPress={() => setLevelFilter(f.key)} />
        ))}
      </ScrollView>

      {view === 'list' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.counter}>
            {filtered.length} open mat{filtered.length > 1 ? 's' : ''}
            {levelFilter !== 'any' ? ` · ${openMatLevelLabels[levelFilter as OpenMatLevel]}` : ''}
          </Text>

          {grouped.map(([dayLabel, sessions]) => (
            <View key={dayLabel}>
              {dayFilter === 'week' && <Text style={styles.dayHeader}>{dayLabel}</Text>}
              {sessions.map((om) => {
                const reminderActive = reminderIds.has(om.id);
                const attending = om.attendeeIds.includes(currentUserId);
                return (
                  <View key={om.id} style={styles.card}>
                    <View style={styles.cardRow}>
                      <View style={styles.timeColumn}>
                        <Text style={styles.timeText}>{om.startTime}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.cardTitleRow}>
                          <Text style={styles.gymName}>{om.gymName}</Text>
                          {om.isFree && <Tag label="Gratuit" variant="outline" />}
                          <Pressable onPress={() => toggleReminder(om.id)} hitSlop={8} style={styles.bellButton}>
                            <Bell
                              color={reminderActive ? colors.accent : colors.textTertiary}
                              fill={reminderActive ? colors.accent : 'none'}
                              size={16}
                            />
                          </Pressable>
                        </View>
                        <Meta>{om.neighborhood} · {om.distanceKm} km</Meta>
                        {reminderActive && <Text style={styles.reminderLabel}>Rappel activé · 1 h avant</Text>}
                        <View style={styles.tagRow}>
                          <Tag label={openMatLevelLabels[om.level]} variant="neutral" />
                          <Tag label={openMatFormatLabels[om.format]} variant="neutral" />
                        </View>
                        <Pressable onPress={() => navigation.navigate('OpenMatDetail', { openMatId: om.id })}>
                          <Text style={styles.attendeesLink}>{om.attendeeIds.length} inscrits</Text>
                        </Pressable>
                      </View>
                    </View>
                    <ToggleButton
                      active={attending}
                      activeLabel="Inscrit"
                      inactiveLabel="Je viens"
                      onPress={() => toggleAttendance(om.id)}
                    />
                  </View>
                );
              })}
            </View>
          ))}

          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucun open mat pour ce filtre.</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.mapWrap}>
          <View style={styles.mapBox}>
            {bounds &&
              filtered.map((om) => {
                const left = ((om.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
                const top = 100 - ((om.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
                const isSelected = om.id === selectedId;
                return (
                  <Pressable
                    key={om.id}
                    onPress={() => setSelectedId(om.id)}
                    style={[
                      styles.pin,
                      { left: `${left}%`, top: `${top}%` },
                      isSelected && styles.pinSelected,
                    ]}
                  />
                );
              })}
          </View>

          {selected && (
            <View style={styles.floatingCard}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.gymName}>{selected.gymName}</Text>
                {selected.isFree && <Tag label="Gratuit" variant="outline" />}
              </View>
              <Text style={styles.floatingTime}>{selected.startTime}</Text>
              <Meta>
                {selected.neighborhood} · {selected.distanceKm} km · {openMatLevelLabels[selected.level]}
              </Meta>
              <View style={styles.floatingActions}>
                <ToggleButton
                  active={selected.attendeeIds.includes(currentUserId)}
                  activeLabel="Inscrit"
                  inactiveLabel="Je viens"
                  block={false}
                  onPress={() => toggleAttendance(selected.id)}
                />
                <Pressable onPress={() => navigation.navigate('OpenMatDetail', { openMatId: selected.id })}>
                  <Text style={styles.detailsLink}>Détails</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}
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
  headerTitle: { fontFamily: fonts.condensedBold, fontSize: 20, color: colors.text },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: { flexDirection: 'row', gap: spacing[2], padding: spacing.screenPadding, paddingBottom: 0 },
  toggleHalf: {
    flex: 1,
    height: 38,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleHalfActive: { backgroundColor: colors.accent100, borderColor: colors.accent },
  toggleLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  toggleLabelActive: { color: colors.accent },
  viewRow: { flexDirection: 'row', gap: spacing[3], paddingHorizontal: spacing.screenPadding, marginTop: spacing[3] },
  viewButton: { paddingHorizontal: spacing[3], height: 30, justifyContent: 'center' },
  viewButtonActive: { borderBottomWidth: 2, borderBottomColor: colors.accent },
  viewButtonLabel: { fontFamily: fonts.condensedSemiBold, fontSize: 13, color: colors.textTertiary },
  viewButtonLabelActive: { color: colors.text },
  chipsRow: { marginTop: spacing[3], flexGrow: 0 },
  content: { padding: spacing.screenPadding },
  counter: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.textMuted, marginBottom: spacing[3] },
  dayHeader: { fontFamily: fonts.condensedSemiBold, fontSize: 14, color: colors.accent, marginBottom: spacing[2], marginTop: spacing[3] },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: spacing.cardPadding,
    marginBottom: spacing.cardMargin,
  },
  cardRow: { flexDirection: 'row', marginBottom: spacing[3] },
  timeColumn: {
    width: 46,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.divider,
    marginRight: spacing[3],
    justifyContent: 'flex-start',
  },
  timeText: { fontFamily: fonts.condensedSemiBold, fontSize: 15, color: colors.text },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  gymName: { fontFamily: fonts.condensedSemiBold, fontSize: 15.5, color: colors.text, flexShrink: 1 },
  bellButton: { marginLeft: 'auto' },
  reminderLabel: { fontFamily: fonts.bodyMedium, fontSize: 11.5, color: colors.accent, marginTop: 2 },
  tagRow: { flexDirection: 'row', marginTop: spacing[2] },
  attendeesLink: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12.5,
    color: colors.text,
    textDecorationLine: 'underline',
    marginTop: spacing[2],
  },
  empty: { padding: spacing[8], alignItems: 'center' },
  emptyText: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.textMuted },
  mapWrap: { flex: 1, padding: spacing.screenPadding },
  mapBox: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: colors.neutral100,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  pin: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent700,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  pinSelected: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.accent },
  floatingCard: {
    position: 'absolute',
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    bottom: spacing[6],
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    borderRadius: radii.md,
    padding: spacing[4],
  },
  floatingTime: { fontFamily: fonts.condensedBold, fontSize: 18, color: colors.accent, marginTop: 2 },
  floatingActions: { flexDirection: 'row', alignItems: 'center', gap: spacing[4], marginTop: spacing[3] },
  detailsLink: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text, textDecorationLine: 'underline' },
});
