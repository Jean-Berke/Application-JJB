import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Home, BookOpen, Plus, BarChart2, User } from 'lucide-react-native';
import { MainTabParamList, RootStackParamList } from './types';
import { colors, radii } from '../theme/tokens';
import { HomeFeedScreen } from '../screens/HomeFeedScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

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

function EmptyScreen() {
  return null;
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: 'rgba(243,239,233,0.4)',
      }}
    >
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
});
