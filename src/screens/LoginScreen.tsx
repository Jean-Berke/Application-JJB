import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Pressable, Text } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { H4, Body } from '../components/ui/Typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = email.length > 0 && password.length > 0;

  return (
    <SafeAreaView style={styles.root}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={12}>
        <ChevronLeft color={colors.text} size={22} />
      </Pressable>

      <View style={styles.content}>
        <H4 style={styles.title}>Content de te revoir</H4>
        <Body style={styles.subtitle}>Connecte-toi pour retrouver ta communauté.</Body>

        <Input label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="toi@exemple.com" />
        <Input label="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />

        <Pressable style={styles.forgot}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </Pressable>

        <Button
          label="Se connecter"
          disabled={!canSubmit}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          style={styles.submit}
        />

        <View style={styles.separatorRow}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorLabel}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        <Button label="Continuer avec Apple" variant="secondary" style={styles.socialSpacing} />
        <Button label="Continuer avec Google" variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  back: { marginLeft: spacing.screenPadding, marginTop: spacing[3] },
  content: { paddingHorizontal: spacing.screenPadding + 6, paddingTop: spacing[8] },
  title: { marginBottom: spacing[1] },
  subtitle: { color: colors.textMuted, marginBottom: spacing[8] },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing[6] },
  forgotText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent },
  submit: { marginBottom: spacing[8] },
  separatorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[6] },
  separatorLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
  separatorLabel: { marginHorizontal: spacing[3], color: colors.textTertiary, fontFamily: fonts.bodyRegular, fontSize: 13 },
  socialSpacing: { marginBottom: spacing[3] },
});
