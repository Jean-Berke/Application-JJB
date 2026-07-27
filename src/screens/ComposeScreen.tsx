import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable } from 'react-native';
import { Image, Video, Link2 } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, radii } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Avatar } from '../components/ui/Avatar';
import { BeltBadge } from '../components/ui/BeltBadge';
import { useApp } from '../data/store';
import { currentUserId, getProfile } from '../data/mock';

type Props = NativeStackScreenProps<RootStackParamList, 'Compose'>;

const MAX_LENGTH = 280;

export function ComposeScreen({ navigation }: Props) {
  const [body, setBody] = useState('');
  const { addPost } = useApp();
  const me = getProfile(currentUserId);

  function handlePublish() {
    addPost(body.trim());
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.ghostAction}>Annuler</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Nouveau post</Text>
        <Pressable onPress={handlePublish} disabled={!body.trim()}>
          <Text style={[styles.primaryAction, !body.trim() && styles.primaryActionDisabled]}>Publier</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.authorRow}>
          <Avatar name={me.displayName} size={36} />
          <View style={{ marginLeft: spacing[3] }}>
            <Text style={styles.name}>{me.displayName}</Text>
            <BeltBadge belt={me.belt} stripes={me.stripes} width={28} height={10} />
          </View>
        </View>

        <TextInput
          value={body}
          onChangeText={(text) => setBody(text.slice(0, MAX_LENGTH))}
          placeholder="Un conseil, une question, une victoire sur le tapis…"
          placeholderTextColor={colors.textTertiary}
          multiline
          style={styles.textarea}
        />

        <View style={styles.toolbar}>
          <Pressable style={styles.toolButton}>
            <Image color={colors.text} size={17} strokeWidth={1.7} />
            <Text style={styles.toolLabel}>Photo</Text>
          </Pressable>
          <Pressable style={styles.toolButton}>
            <Video color={colors.text} size={17} strokeWidth={1.7} />
            <Text style={styles.toolLabel}>Vidéo</Text>
          </Pressable>
          <Pressable style={styles.toolButton}>
            <Link2 color={colors.text} size={17} strokeWidth={1.7} />
            <Text style={styles.toolLabel}>Associer une technique</Text>
          </Pressable>
        </View>

        <Text style={styles.counter}>{body.length} / {MAX_LENGTH}</Text>
      </View>
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
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[4] },
  name: { fontFamily: fonts.condensedSemiBold, fontSize: 15, color: colors.text, marginBottom: 4 },
  textarea: {
    minHeight: 160,
    fontFamily: fonts.bodyRegular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    textAlignVertical: 'top',
  },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], marginTop: spacing[4] },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing[3],
    height: 36,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  toolLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  counter: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.textMuted, textAlign: 'right', marginTop: spacing[4] },
});
