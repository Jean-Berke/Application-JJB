import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  currentUserId,
  posts as initialPosts,
  replies as initialReplies,
  profiles as initialProfiles,
  beltPromotions as initialPromotions,
  openMats as initialOpenMats,
} from './mock';
import { BeltPromotion, OpenMat, OpenMatFormat, OpenMatLevel, Post, Profile } from './types';

export type ViewMode = 'practitioner' | 'club';

export type NewOpenMat = {
  gymName: string;
  neighborhood: string;
  dayLabel: string;
  startTime: string;
  endTime: string;
  level: OpenMatLevel;
  format: OpenMatFormat;
  isFree: boolean;
};

type AppState = {
  posts: Post[];
  replies: Post[];
  profiles: Profile[];
  promotions: BeltPromotion[];
  openMats: OpenMat[];
  followedIds: Set<string>;
  reminderIds: Set<string>;
  viewMode: ViewMode;
  toggleLike: (postId: string) => void;
  toggleFollow: (profileId: string) => void;
  addPost: (body: string) => void;
  repliesFor: (postId: string) => Post[];
  getProfile: (id: string) => Profile;
  academyMembers: (academyId: string) => Profile[];
  requestVerification: (profileId: string) => void;
  approvePromotion: (promotionId: string) => void;
  declinePromotion: (promotionId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleAttendance: (openMatId: string) => void;
  toggleReminder: (openMatId: string) => void;
  addOpenMat: (data: NewOpenMat) => void;
};

const AppContext = createContext<AppState | null>(null);

function toggleLikeIn(list: Post[], postId: string): Post[] {
  return list.map((post) =>
    post.id === postId
      ? { ...post, liked: !post.liked, likeCount: post.likeCount + (post.liked ? -1 : 1) }
      : post
  );
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [replies, setReplies] = useState<Post[]>(initialReplies);
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [promotions, setPromotions] = useState<BeltPromotion[]>(initialPromotions);
  const [openMats, setOpenMats] = useState<OpenMat[]>(initialOpenMats);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set(['u-marcio']));
  const [reminderIds, setReminderIds] = useState<Set<string>>(new Set(['om-1']));
  const [viewMode, setViewMode] = useState<ViewMode>('practitioner');

  const value = useMemo<AppState>(
    () => ({
      posts,
      replies,
      profiles,
      promotions,
      openMats,
      followedIds,
      reminderIds,
      viewMode,
      toggleLike: (postId: string) => {
        setPosts((list) => toggleLikeIn(list, postId));
        setReplies((list) => toggleLikeIn(list, postId));
      },
      toggleFollow: (profileId: string) => {
        setFollowedIds((prev) => {
          const next = new Set(prev);
          if (next.has(profileId)) next.delete(profileId);
          else next.add(profileId);
          return next;
        });
      },
      addPost: (body: string) => {
        const newPost: Post = {
          id: `p-${Date.now()}`,
          authorId: currentUserId,
          body,
          parentId: null,
          techniqueTitle: null,
          mediaType: null,
          mediaCaption: null,
          academyId: null,
          pinned: false,
          likeCount: 0,
          replyCount: 0,
          repostCount: 0,
          createdAtLabel: 'à l’instant',
          liked: false,
        };
        setPosts((list) => [newPost, ...list]);
      },
      repliesFor: (postId: string) => replies.filter((r) => r.parentId === postId),
      getProfile: (id: string) => {
        const found = profiles.find((p) => p.id === id);
        if (!found) throw new Error(`Unknown profile ${id}`);
        return found;
      },
      academyMembers: (academyId: string) => profiles.filter((p) => p.academyId === academyId),
      requestVerification: (profileId: string) => {
        setPromotions((list) => {
          if (list.some((p) => p.profileId === profileId && p.status === 'pending')) return list;
          const profile = profiles.find((p) => p.id === profileId);
          if (!profile) return list;
          return [
            ...list,
            {
              id: `bp-${Date.now()}`,
              profileId,
              belt: profile.belt,
              stripes: profile.stripes,
              status: 'pending',
              requestedAtLabel: 'à l’instant',
              reviewedBy: null,
              reviewedAtLabel: null,
            },
          ];
        });
      },
      approvePromotion: (promotionId: string) => {
        setPromotions((list) =>
          list.map((p) =>
            p.id === promotionId
              ? { ...p, status: 'approved', reviewedBy: 'u-marcio', reviewedAtLabel: 'à l’instant' }
              : p
          )
        );
        setProfiles((list) => {
          const promotion = promotions.find((p) => p.id === promotionId);
          if (!promotion) return list;
          return list.map((profile) =>
            profile.id === promotion.profileId
              ? { ...profile, belt: promotion.belt, stripes: promotion.stripes, beltVerified: true }
              : profile
          );
        });
      },
      declinePromotion: (promotionId: string) => {
        setPromotions((list) =>
          list.map((p) => (p.id === promotionId ? { ...p, status: 'declined' } : p))
        );
      },
      setViewMode,
      toggleAttendance: (openMatId: string) => {
        setOpenMats((list) =>
          list.map((om) =>
            om.id === openMatId
              ? {
                  ...om,
                  attendeeIds: om.attendeeIds.includes(currentUserId)
                    ? om.attendeeIds.filter((id) => id !== currentUserId)
                    : [...om.attendeeIds, currentUserId],
                }
              : om
          )
        );
      },
      toggleReminder: (openMatId: string) => {
        setReminderIds((prev) => {
          const next = new Set(prev);
          if (next.has(openMatId)) next.delete(openMatId);
          else next.add(openMatId);
          return next;
        });
      },
      addOpenMat: (data: NewOpenMat) => {
        const newOpenMat: OpenMat = {
          id: `om-${Date.now()}`,
          academyId: null,
          createdBy: currentUserId,
          gymName: data.gymName,
          neighborhood: data.neighborhood,
          lat: 45.75,
          lng: 4.85,
          dayLabel: data.dayLabel,
          dayKey: 'week',
          startTime: data.startTime,
          endTime: data.endTime,
          level: data.level,
          format: data.format,
          isFree: data.isFree,
          distanceKm: 0,
          description: '',
          attendeeIds: [currentUserId],
        };
        setOpenMats((list) => [newOpenMat, ...list]);
      },
    }),
    [posts, replies, profiles, promotions, openMats, followedIds, reminderIds, viewMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
