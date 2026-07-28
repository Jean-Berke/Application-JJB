import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Play } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, beltLabels } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/ui/Avatar';
import { VerifiedBadge } from '../components/ui/VerifiedBadge';
import { Button } from '../components/ui/Button';
import { Kicker, Meta } from '../components/ui/Typography';
import { getTechnique } from '../data/mock';
import { useApp } from '../data/store';
import { techniqueCategoryLabels } from '../data/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TechniqueDetail'>;

export function TechniqueDetailScreen({ route, navigation }: Props) {
  const { techniqueId } = route.params;
  const technique = getTechnique(techniqueId);
  const { getProfile, followedIds, toggleFollow, notebookEntries, addToNotebook } = useApp();
  const instructor = getProfile(technique.instructorId);
  const isFollowing = followedIds.has(instructor.id);
  const inNotebook = notebookEntries.some((e) => e.techniqueId === technique.id);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.video}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={12}>
            <ChevronLeft color={colors.text} size={20} />
          </Pressable>
          <View style={styles.playButton}>
            <Play color={colors.text} size={22} fill={colors.text} />
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.content}>
          <Kicker>{techniqueCategoryLabels[technique.category]}</Kicker>
          <Text style={styles.title}>{technique.title}</Text>

          <Pressable
            style={styles.instructorRow}
            onPress={() => navigation.navigate('UserProfile', { profileId: instructor.id })}
          >
            <Avatar name={instructor.displayName} size={36} />
            <View style={{ marginLeft: spacing[3], flex: 1 }}>
              <View style={styles.instructorNameRow}>
                <Text style={styles.instructorName}>{instructor.displayName}</Text>
                {instructor.beltVerified && instructor.isCoach && <VerifiedBadge size={13} />}
              </View>
              <Meta>{beltLabels[instructor.belt]}</Meta>
            </View>
            <Button
              label={isFollowing ? 'Suivi' : 'Suivre'}
              variant="secondary"
              block={false}
              style={styles.followButton}
              onPress={() => toggleFollow(instructor.id)}
            />
          </Pressable>

          <Text style={styles.description}>{technique.description}</Text>

          <Text style={styles.sectionTitle}>Les étapes clés</Text>
          {technique.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          <Button
            label={inNotebook ? 'Déjà dans ton carnet' : 'Ajouter à mon carnet'}
            disabled={inNotebook}
            onPress={() => addToNotebook(technique)}
            style={styles.notebookButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingBottom: spacing[8] },
  video: {
    height: 220,
    backgroundColor: colors.accent200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: spacing[3],
    left: spacing.screenPadding,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  progressFill: { width: '34%', height: '100%', backgroundColor: colors.accent800 },
  content: { padding: spacing.screenPadding },
  title: { fontFamily: fonts.condensedBold, fontSize: 25, color: colors.text, marginTop: 2, marginBottom: spacing[4] },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    marginBottom: spacing[4],
  },
  instructorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  instructorName: { fontFamily: fonts.bodySemiBold, fontSize: 14.5, color: colors.text },
  followButton: { paddingHorizontal: spacing[4] },
  description: { fontFamily: fonts.bodyRegular, fontSize: 15, lineHeight: 21, color: colors.text },
  sectionTitle: { fontFamily: fonts.condensedSemiBold, fontSize: 16, color: colors.text, marginTop: spacing[6], marginBottom: spacing[3] },
  stepRow: { flexDirection: 'row', marginBottom: spacing[3] },
  stepNumber: {
    fontFamily: fonts.condensedBold,
    fontSize: 16,
    color: colors.accent,
    width: 28,
  },
  stepText: { fontFamily: fonts.bodyRegular, fontSize: 14, lineHeight: 20, color: colors.text, flex: 1 },
  notebookButton: { marginTop: spacing[6] },
});
