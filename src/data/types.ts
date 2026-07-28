import { BeltLevel } from '../theme/tokens';

export type AcademyRole = 'student' | 'assistant' | 'head_coach';

export type Profile = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  belt: BeltLevel;
  stripes: number;
  beltVerified: boolean;
  academyId: string | null;
  academyRole: AcademyRole;
  isCoach: boolean;
  followerCount: number;
  followingCount: number;
  sessionCount: number;
};

export type PromotionStatus = 'pending' | 'approved' | 'declined';

export type BeltPromotion = {
  id: string;
  profileId: string;
  belt: BeltLevel;
  stripes: number;
  status: PromotionStatus;
  requestedAtLabel: string;
  reviewedBy: string | null;
  reviewedAtLabel: string | null;
};

export type Academy = {
  id: string;
  name: string;
  slug: string;
  neighborhood: string;
  city: string;
  memberCount: number;
  verified: boolean;
};

export type OpenMatLevel = 'all' | 'blue_plus' | 'competitors';
export type OpenMatFormat = 'gi' | 'nogi' | 'both';
export type DayFilter = 'today' | 'week';

export type OpenMat = {
  id: string;
  academyId: string | null;
  createdBy: string;
  gymName: string;
  neighborhood: string;
  lat: number;
  lng: number;
  dayLabel: string;
  dayKey: DayFilter;
  startTime: string;
  endTime: string;
  level: OpenMatLevel;
  format: OpenMatFormat;
  isFree: boolean;
  distanceKm: number;
  description: string;
  attendeeIds: string[];
};

export const openMatLevelLabels: Record<OpenMatLevel, string> = {
  all: 'Tous niveaux',
  blue_plus: 'Ceinture bleue +',
  competitors: 'Compétiteurs',
};

export const openMatFormatLabels: Record<OpenMatFormat, string> = {
  gi: 'Gi',
  nogi: 'No-gi',
  both: 'Gi & No-gi',
};

export type TechniqueCategory = 'guards' | 'passes' | 'submissions' | 'takedowns' | 'escapes';

export const techniqueCategoryLabels: Record<TechniqueCategory, string> = {
  guards: 'Gardes',
  passes: 'Passages',
  submissions: 'Soumissions',
  takedowns: 'Amenées au sol',
  escapes: 'Sorties',
};

export type Technique = {
  id: string;
  title: string;
  category: TechniqueCategory;
  position: string;
  beltLevel: BeltLevel;
  durationLabel: string;
  description: string;
  instructorId: string;
  viewCount: number;
  steps: string[];
};

export type NotebookStatus = 'to_review' | 'in_progress' | 'mastered';

export const notebookStatusLabels: Record<NotebookStatus, string> = {
  to_review: 'À revoir',
  in_progress: 'En cours',
  mastered: 'Maîtrisée',
};

export const notebookStatusOrder: NotebookStatus[] = ['to_review', 'in_progress', 'mastered'];

export type NotebookEntry = {
  id: string;
  profileId: string;
  techniqueId: string | null;
  title: string;
  category: string;
  status: NotebookStatus;
  isWeakness: boolean;
  note: string;
  drillCount: number;
  lastDrilledLabel: string | null;
};

export type NotificationKind = 'reply' | 'like' | 'follow' | 'grade' | 'openmat';

export type AppNotification = {
  id: string;
  profileId: string;
  actorId: string;
  kind: NotificationKind;
  message: string;
  createdAtLabel: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  participantIds: string[];
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAtLabel: string;
};

export type MediaType = 'video' | 'photo';

export type Post = {
  id: string;
  authorId: string;
  body: string;
  parentId: string | null;
  techniqueTitle: string | null;
  mediaType: MediaType | null;
  mediaCaption: string | null;
  academyId: string | null;
  pinned: boolean;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  createdAtLabel: string;
  liked: boolean;
};
