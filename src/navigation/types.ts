export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Onboarding: undefined;
  Main: undefined;
  Thread: { postId: string };
  Compose: undefined;
  UserProfile: { profileId: string };
  Verify: undefined;
  OpenMats: undefined;
  OpenMatDetail: { openMatId: string };
  OpenMatAdd: undefined;
};

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
