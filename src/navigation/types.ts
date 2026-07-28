import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Fil: undefined;
  Techniques: undefined;
  ComposeTab: undefined;
  Progression: undefined;
  Profil: undefined;
};

export type ClubTabParamList = {
  ClubFil: undefined;
  Eleves: undefined;
  ClubComposeTab: undefined;
  OpenMats: undefined;
  Club: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Thread: { postId: string };
  Compose: undefined;
  UserProfile: { profileId: string };
  Verify: undefined;
  OpenMats: undefined;
  OpenMatDetail: { openMatId: string };
  OpenMatAdd: undefined;
  TechniqueDetail: { techniqueId: string };
  Notebook: undefined;
  Search: undefined;
  Notifications: undefined;
  Messages: undefined;
  Chat: { conversationId: string };
  Settings: undefined;
  Admin: undefined;
};
