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
