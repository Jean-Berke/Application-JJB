import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Input } from '../components/ui/Input';
import { Tag } from '../components/ui/Tag';
import { Switch } from '../components/ui/Switch';
import { useApp } from '../data/store';
import { OpenMatFormat, OpenMatLevel, openMatFormatLabels, openMatLevelLabels } from '../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OpenMatAdd'>;

const LEVELS: OpenMatLevel[] = ['all', 'blue_plus', 'competitors'];
const FORMATS: OpenMatFormat[] = ['gi', 'nogi', 'both'];

export function OpenMatAddScreen({ navigation }: Props) {
  const { addOpenMat } = useApp();
  const [gymName, setGymName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [dayLabel, setDayLabel] = useState('');
  const [startTime, setStartTime] = useState('');
  const [level, setLevel] = useState<OpenMatLevel>('all');
  const [format, setFormat] = useState<OpenMatFormat>('both');
  const [isFree, setIsFree] = useState(true);

  const canPublish = gymName.trim().length > 0 && neighborhood.trim().length > 0 && dayLabel.trim().length > 0 && startTime.trim().length > 0;

  function handlePublish() {
    addOpenMat({
      gymName: gymName.trim(),
      neighborhood: neighborhood.trim(),
      dayLabel: dayLabel.trim(),
      startTime: startTime.trim(),
      endTime: startTime.trim(),
      level,
      format,
      isFree,
    });
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.ghostAction}>Annuler</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Proposer un open mat</Text>
        <Pressable onPress={handlePublish} disabled={!canPublish}>
          <Text style={[styles.primaryAction, !canPublish && styles.primaryActionDisabled]}>Publier</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Salle" placeholder="ex. Gracie Barra Lyon" value={gymName} onChangeText={setGymName} />
        <Input label="Quartier" placeholder="ex. Confluence" value={neighborhood} onChangeText={setNeighborhood} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Input label="Jour" placeholder="ex. Samedi" value={dayLabel} onChangeText={setDayLabel} />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Heure" placeholder="ex. 11:00" value={startTime} onChangeText={setStartTime} />
          </View>
        </View>

        <Text style={styles.label}>Niveau</Text>
        <View style={styles.chipsWrap}>
          {LEVELS.map((l) => (
            <Tag key={l} label={openMatLevelLabels[l]} active={level === l} onPress={() => setLevel(l)} />
          ))}
        </View>

        <Text style={styles.label}>Format</Text>
        <View style={styles.chipsWrap}>
          {FORMATS.map((f) => (
            <Tag key={f} label={openMatFormatLabels[f]} active={format === f} onPress={() => setFormat(f)} />
          ))}
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Accès gratuit</Text>
          <Switch value={isFree} onValueChange={setIsFree} />
        </View>
      </ScrollView>
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
  ghostAction: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.textMuted },
  headerTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 16, color: colors.text },
  primaryAction: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.accent },
  primaryActionDisabled: { opacity: 0.45 },
  content: { padding: spacing.screenPadding },
  row: { flexDirection: 'row', gap: spacing[3] },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12.5,
    color: colors.textMuted,
    marginBottom: spacing[2],
    marginTop: spacing[2],
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[4] },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing[2],
  },
  switchLabel: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text },
});
