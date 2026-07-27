import React, { createContext, useContext, useMemo, useState } from 'react';
import { currentUserId, posts as initialPosts, replies as initialReplies, profiles } from './mock';
import { Post } from './types';

type AppState = {
  posts: Post[];
  replies: Post[];
  followedIds: Set<string>;
  toggleLike: (postId: string) => void;
  toggleFollow: (profileId: string) => void;
  addPost: (body: string) => void;
  repliesFor: (postId: string) => Post[];
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
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set(['u-marcio']));

  const value = useMemo<AppState>(
    () => ({
      posts,
      replies,
      followedIds,
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
    }),
    [posts, replies, followedIds]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { profiles };
