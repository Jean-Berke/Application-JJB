import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Home, BookOpen, Plus, BarChart2, User, Users, MapPin } from 'lucide-react-native';
import { MainTabParamList, ClubTabParamList, RootStackParamList } from './types';
import { colors, radii } from '../theme/tokens';
import { HomeFeedScreen } from '../screens/HomeFeedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { StudentsScreen } from '../screens/StudentsScreen';
import { ClubHomeScreen } from '../screens/ClubHomeScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { useApp } from '../data/store';

const Tab = createBottomTabNavigator<MainTabParamList>();
const ClubTab = createBottomTabNavigator<ClubTabParamList>();

function ComposeTabButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Pressable style={styles.composeButton} onPress={() => navigation.navigate('Compose')}>
      <Plus color={colors.onAccent} size={22} strokeWidth={2.2} />
    </Pressable>
  );
}

function TechniquesPlaceholder() {
  return <PlaceholderScreen title="Techniques" />;
}

function ProgressionPlaceholder() {
  return <PlaceholderScreen title="Progression" />;
}

function OpenMatsPlaceholder() {
  return <PlaceholderScreen title="Open mats" />;
}

function EmptyScreen() {
  return null;
}

function GbBadge({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.gbBadge, focused && styles.gbBadgeActive]}>
      <Text style={[styles.gbBadgeLabel, focused && styles.gbBadgeLabelActive]}>GB</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(16,13,11,0.9)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    height: 78,
    paddingTop: 10,
    paddingBottom: 24,
  },
  composeButtonWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  composeButton: {
    width: 42,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gbBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(243,239,233,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gbBadgeActive: { borderColor: colors.accent },
  gbBadgeLabel: { fontSize: 9, fontWeight: '700', color: 'rgba(243,239,233,0.4)' },
  gbBadgeLabelActive: { color: colors.accent },
});

const sharedScreenOptions = {
  headerShown: false,
  tabBarStyle: styles.tabBar,
  tabBarShowLabel: false,
  tabBarActiveTintColor: colors.accent,
  tabBarInactiveTintColor: 'rgba(243,239,233,0.4)',
} as const;

function PractitionerTabs() {
  return (
    <Tab.Navigator screenOptions={sharedScreenOptions}>
      <Tab.Screen
        name="Fil"
        component={HomeFeedScreen}
        options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={1.6} /> }}
      />
      <Tab.Screen
        name="Techniques"
        component={TechniquesPlaceholder}
        options={{ tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} strokeWidth={1.6} /> }}
      />
      <Tab.Screen
        name="ComposeTab"
        component={EmptyScreen}
        options={{
          tabBarButton: () => (
            <View style={styles.composeButtonWrap}>
              <ComposeTabButton />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Progression"
        component={ProgressionPlaceholder}
        options={{ tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} strokeWidth={1.6} /> }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={1.6} /> }}
      />
    </Tab.Navigator>
  );
}

function ClubTabs() {
  return (
    <ClubTab.Navigator screenOptions={sharedScreenOptions}>
      <ClubTab.Screen
        name="ClubFil"
        component={HomeFeedScreen}
        options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={1.6} /> }}
      />
      <ClubTab.Screen
        name="Eleves"
        component={StudentsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Users color={color} size={size} strokeWidth={1.6} /> }}
      />
      <ClubTab.Screen
        name="ClubComposeTab"
        component={EmptyScreen}
        options={{
          tabBarButton: () => (
            <View style={styles.composeButtonWrap}>
              <ComposeTabButton />
            </View>
          ),
        }}
      />
      <ClubTab.Screen
        name="OpenMats"
        component={OpenMatsPlaceholder}
        options={{ tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} strokeWidth={1.6} /> }}
      />
      <ClubTab.Screen
        name="Club"
        component={ClubHomeScreen}
        options={{ tabBarIcon: ({ focused }) => <GbBadge focused={focused} /> }}
      />
    </ClubTab.Navigator>
  );
}

export function MainTabs() {
  const { viewMode } = useApp();
  return viewMode === 'club' ? <ClubTabs /> : <PractitionerTabs />;
}
