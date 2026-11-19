import {AvatarConfig} from './utils/avatarGenerator';

export type FilterTab = 'recent' | 'popular' | 'saved';

export interface ReactionItem {
  emoji: string;
  count: number;
  voted?: boolean;
}

export interface CommentItem {
  id: string;
  text: string;
  timeAgo: string;
  alias?: string;
  avatar?: AvatarConfig;
}

export interface Confession {
  id: string;
  category: string;
  businessType: string;
  timeAgo: string;
  createdAt: number;
  body: string;
  reactions: ReactionItem[];
  comments: CommentItem[];
  bookmarked?: boolean;
  canDelete?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  subtitle?: string;
}
