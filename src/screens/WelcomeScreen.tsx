import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Button } from '../components/ui/Button';
import { H3, Body } from '../components/ui/Typography';
import { Text } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.accent200, colors.bg]}
        locations={[0, 0.62]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.logo}>
            <Text style={styles.logoLetter}>O</Text>
          </View>
          <H3 style={styles.title}>OSS</H3>
          <Text style={styles.tagline}>La communauté du{'\n'}jiu-jitsu brésilien.</Text>
          <Body style={styles.paragraph}>
            Des conseils dont tu connais la ceinture. Les open mats près de toi. Ta progression, notée.
          </Body>

          <View style={styles.actions}>
            <Button
              label="Créer mon compte"
              onPress={() => navigation.navigate('Onboarding')}
              style={styles.actionSpacing}
            />
            <Button
              label="J'ai déjà un compte"
              variant="secondary"
              onPress={() => navigation.navigate('Login')}
            />
          </View>

          <Text style={styles.legal}>
            En continuant, tu acceptes les conditions d’utilisation d’OSS.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1, justifyContent: 'flex-end' },
  content: {
    paddingHorizontal: spacing.screenPadding + 6,
    paddingBottom: spacing[8] + 4,
  },
  logo: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  logoLetter: {
    fontFamily: fonts.condensedBold,
    fontSize: 36,
    color: colors.onAccent,
  },
  title: { marginBottom: spacing[2] },
  tagline: {
    fontFamily: fonts.condensedSemiBold,
    fontSize: 22,
    lineHeight: 24,
    color: colors.accent800,
    marginBottom: spacing[3],
    maxWidth: 220,
  },
  paragraph: {
    color: 'rgba(243,239,233,0.6)',
    fontSize: 14.5,
    maxWidth: 260,
    marginBottom: spacing[8],
  },
  actions: { gap: spacing[3] },
  actionSpacing: { marginBottom: spacing[3] },
  legal: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11.5,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing[6],
  },
});
