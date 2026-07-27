import { Academy, Post, Profile } from './types';

export const currentUserId = 'u-me';

export const academies: Academy[] = [
  {
    id: 'a-gb-lyon',
    name: 'Gracie Barra Lyon',
    slug: 'gracie-barra-lyon',
    neighborhood: 'Confluence',
    city: 'Lyon',
    memberCount: 148,
    verified: true,
  },
  {
    id: 'a-alliance-paris',
    name: 'Alliance Paris',
    slug: 'alliance-paris',
    neighborhood: 'Bastille',
    city: 'Paris',
    memberCount: 210,
    verified: true,
  },
];

export const profiles: Profile[] = [
  {
    id: currentUserId,
    handle: 'jeanb',
    displayName: 'Jean B.',
    bio: 'Ceinture bleue. Garde fermée et rien d’autre.',
    belt: 'blue',
    stripes: 1,
    beltVerified: true,
    academyId: 'a-gb-lyon',
    isCoach: false,
    followerCount: 42,
    followingCount: 63,
  },
  {
    id: 'u-marcio',
    handle: 'coachmarcio',
    displayName: 'Márcio Andrade',
    bio: 'Ceinture noire 3e degré. Head coach @ Gracie Barra Lyon.',
    belt: 'black',
    stripes: 3,
    beltVerified: true,
    academyId: 'a-gb-lyon',
    isCoach: true,
    followerCount: 1840,
    followingCount: 112,
  },
  {
    id: 'u-karim',
    handle: 'karimbjj',
    displayName: 'Karim B.',
    bio: 'No-gi addict. Compétiteur amateur.',
    belt: 'purple',
    stripes: 2,
    beltVerified: true,
    academyId: 'a-gb-lyon',
    isCoach: false,
    followerCount: 210,
    followingCount: 180,
  },
  {
    id: 'u-lea',
    handle: 'lea.rolls',
    displayName: 'Léa Fontaine',
    bio: 'Ceinture blanche depuis 4 mois. Ici pour progresser.',
    belt: 'white',
    stripes: 3,
    beltVerified: false,
    academyId: 'a-alliance-paris',
    isCoach: false,
    followerCount: 18,
    followingCount: 54,
  },
];

export const posts: Post[] = [
  {
    id: 'p-1',
    authorId: 'u-marcio',
    body: 'La clé du passage toréador : contrôlez la hanche avant les jambes. Tout le reste suit.',
    parentId: null,
    techniqueTitle: 'Passage toréador',
    mediaType: 'video',
    mediaCaption: 'Détail passage · 1:42',
    academyId: null,
    pinned: true,
    likeCount: 128,
    replyCount: 24,
    repostCount: 9,
    createdAtLabel: '2 h',
    liked: false,
  },
  {
    id: 'p-2',
    authorId: 'u-karim',
    body: 'Petit rappel pour les ceintures bleues : le triangle ne se ferme pas avec les bras, mais avec la hanche qui pivote sous l’épaule adverse.',
    parentId: null,
    techniqueTitle: 'Triangle',
    mediaType: null,
    mediaCaption: null,
    academyId: null,
    pinned: false,
    likeCount: 64,
    replyCount: 11,
    repostCount: 3,
    createdAtLabel: '4 h',
    liked: true,
  },
  {
    id: 'p-3',
    authorId: 'u-lea',
    body: 'Premier open mat aujourd’hui, un peu stressée mais contenté d’y aller. Des conseils pour une ceinture blanche ?',
    parentId: null,
    techniqueTitle: null,
    mediaType: null,
    mediaCaption: null,
    academyId: null,
    pinned: false,
    likeCount: 31,
    replyCount: 8,
    repostCount: 0,
    createdAtLabel: '6 h',
    liked: false,
  },
];

export const replies: Post[] = [
  {
    id: 'r-1',
    authorId: 'u-marcio',
    body: 'Va-s-y à ton rythme, personne ne juge une ceinture blanche. Concentre-toi sur ta position, pas sur la soumission.',
    parentId: 'p-3',
    techniqueTitle: null,
    mediaType: null,
    mediaCaption: null,
    academyId: null,
    pinned: false,
    likeCount: 22,
    replyCount: 0,
    repostCount: 0,
    createdAtLabel: '5 h',
    liked: false,
  },
  {
    id: 'r-2',
    authorId: 'u-karim',
    body: 'Tape souvent, tape tôt. Personne ne se souvient de tes tapes, tout le monde se souvient de ta progression.',
    parentId: 'p-3',
    techniqueTitle: null,
    mediaType: null,
    mediaCaption: null,
    academyId: null,
    pinned: false,
    likeCount: 17,
    replyCount: 0,
    repostCount: 0,
    createdAtLabel: '5 h',
    liked: false,
  },
];

export function getProfile(id: string): Profile {
  const found = profiles.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown profile ${id}`);
  return found;
}

export function getAcademy(id: string | null): Academy | null {
  if (!id) return null;
  return academies.find((a) => a.id === id) ?? null;
}
