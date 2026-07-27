import { BeltLevel } from '../theme/tokens';

export type Profile = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  belt: BeltLevel;
  stripes: number;
  beltVerified: boolean;
  academyId: string | null;
  isCoach: boolean;
  followerCount: number;
  followingCount: number;
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
