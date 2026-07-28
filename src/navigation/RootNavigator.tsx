import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { colors } from '../theme/tokens';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { ThreadScreen } from '../screens/ThreadScreen';
import { ComposeScreen } from '../screens/ComposeScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { VerifyScreen } from '../screens/VerifyScreen';
import { OpenMatsScreen } from '../screens/OpenMatsScreen';
import { OpenMatDetailScreen } from '../screens/OpenMatDetailScreen';
import { OpenMatAddScreen } from '../screens/OpenMatAddScreen';
import { TechniqueDetailScreen } from '../screens/TechniqueDetailScreen';
import { NotebookScreen } from '../screens/NotebookScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Thread" component={ThreadScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen name="OpenMats" component={OpenMatsScreen} />
      <Stack.Screen name="OpenMatDetail" component={OpenMatDetailScreen} />
      <Stack.Screen name="OpenMatAdd" component={OpenMatAddScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="TechniqueDetail" component={TechniqueDetailScreen} />
      <Stack.Screen name="Notebook" component={NotebookScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Compose" component={ComposeScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
