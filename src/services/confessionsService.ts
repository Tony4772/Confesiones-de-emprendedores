import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  BUSINESS_TYPES,
  EXTRA_CONFESSIONS,
  INITIAL_CONFESSIONS,
  STORY_CATEGORIES,
} from '../data/mockData';
import {db, handleFirestoreError, OperationType} from '../firebase';
import {CommentItem, Confession, ReactionItem} from '../types';
import {AvatarConfig, generateUniqueAvatar} from '../utils/avatarGenerator';

export type ReactionKey = 'fire' | 'skull' | 'clown' | 'hug' | 'money';

export interface ReactionCountsMap {
  fire: number;
  skull: number;
  clown: number;
  hug: number;
  money: number;
}

export interface FirestoreConfessionDoc {
  category: string;
  businessType: string;
  body: string;
  reactionCounts: ReactionCountsMap;
  commentCount: number;
  createdAt: Timestamp | null;
}

export interface FirestoreCommentDoc {
  confessionId: string;
  text: string;
  avatar: AvatarConfig;
  createdAt: Timestamp | null;
}

export const REACTION_EMOJI_TO_KEY: Record<string, ReactionKey> = {
  '🔥': 'fire',
  '💀': 'skull',
  '🤡': 'clown',
  '🫂': 'hug',
  '💸': 'money',
};

export const REACTION_ORDER: Array<{emoji: string; key: ReactionKey}> = [
  {emoji: '🔥', key: 'fire'},
  {emoji: '💀', key: 'skull'},
  {emoji: '🤡', key: 'clown'},
  {emoji: '🫂', key: 'hug'},
  {emoji: '💸', key: 'money'},
];

const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const MAX_BODY_LENGTH = 600;
const MAX_COMMENT_LENGTH = 280;

export function formatRelativeTime(createdAtMs: number): string {
  const diffMs = Math.max(0, Date.now() - createdAtMs);
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
}

function reactionsToCountsMap(reactions: ReactionItem[]): ReactionCountsMap {
  const counts: ReactionCountsMap = {
    fire: 0,
    skull: 0,
    clown: 0,
    hug: 0,
    money: 0,
  };
  for (const r of reactions) {
    const key = REACTION_EMOJI_TO_KEY[r.emoji];
    if (key) {
      counts[key] = Math.max(0, Math.min(1000, Math.floor(r.count)));
    }
  }
  return counts;
}

export function countsMapToReactions(counts?: Partial<ReactionCountsMap>): ReactionItem[] {
  return REACTION_ORDER.map(({emoji, key}) => ({
    emoji,
    count: typeof counts?.[key] === 'number' ? Math.max(0, counts[key]!) : 0,
  }));
}

function sanitizeCategory(category: string): string {
  return (STORY_CATEGORIES as readonly string[]).includes(category)
    ? category
    : STORY_CATEGORIES[0];
}

function sanitizeBusinessType(businessType: string): string {
  return BUSINESS_TYPES.includes(businessType) ? businessType : BUSINESS_TYPES[0];
}

function createSafeId(prefix: string): string {
  const raw = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return SAFE_ID_REGEX.test(raw) ? raw.slice(0, 128) : `${prefix}-${Date.now()}`;
}

async function seedConfessionsWithComments(items: Confession[]): Promise<void> {
  if (items.length === 0) return;

  const batch = writeBatch(db);
  for (const item of items) {
    const storyRef = doc(db, 'confessions', item.id);
    batch.set(storyRef, {
      category: sanitizeCategory(item.category),
      businessType: sanitizeBusinessType(item.businessType),
      body: item.body.trim().slice(0, MAX_BODY_LENGTH),
      reactionCounts: reactionsToCountsMap(item.reactions),
      commentCount: 0,
      createdAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    // Ignore permission/exists collision if two clients seed simultaneously
    if (
      error instanceof Error &&
      (error.message.includes('PERMISSION_DENIED') || error.message.includes('already exists'))
    ) {
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, 'confessions');
  }

  // Seed initial comments one atomic batch per comment to satisfy commentCount == +1 invariant
  for (const item of items) {
    for (const comment of item.comments) {
      const commentBatch = writeBatch(db);
      const commentRef = doc(db, 'confessions', item.id, 'comments', comment.id);
      const storyRef = doc(db, 'confessions', item.id);
      const avatar = comment.avatar ?? generateUniqueAvatar(comment.id);

      commentBatch.set(commentRef, {
        confessionId: item.id,
        text: comment.text.trim().slice(0, MAX_COMMENT_LENGTH),
        avatar,
        createdAt: serverTimestamp(),
      });
      commentBatch.update(storyRef, {
        commentCount: increment(1),
      });

      try {
        await commentBatch.commit();
      } catch {
        // Ignore if another visitor already seeded this comment
      }
    }
  }
}

export async function seedInitialConfessionsIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(query(collection(db, 'confessions'), limit(1)));
    if (snap.empty) {
      await seedConfessionsWithComments(INITIAL_CONFESSIONS);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'confessions');
  }
}

export async function seedExtraConfessionsIfMissing(): Promise<number> {
  try {
    const snap = await getDocs(query(collection(db, 'confessions'), limit(100)));
    const existingIds = new Set(snap.docs.map((d) => d.id));
    const missing = EXTRA_CONFESSIONS.filter((item) => !existingIds.has(item.id));
    if (missing.length > 0) {
      await seedConfessionsWithComments(missing);
    }
    return missing.length;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'confessions');
  }
}

export interface RawConfessionRecord {
  id: string;
  category: string;
  businessType: string;
  body: string;
  reactionCounts: ReactionCountsMap;
  commentCount: number;
  createdAtMs: number;
}

export interface RawCommentRecord extends CommentItem {
  confessionId: string;
  createdAtMs: number;
}

export function subscribeToConfessions(
  onData: (items: RawConfessionRecord[]) => void,
  onFatalError: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'confessions'),
    orderBy('createdAt', 'desc'),
    limit(100),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: RawConfessionRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as FirestoreConfessionDoc;
        const createdAtMs =
          data.createdAt instanceof Timestamp
            ? data.createdAt.toMillis()
            : Date.now();
        return {
          id: docSnap.id,
          category: data.category,
          businessType: data.businessType,
          body: data.body,
          reactionCounts: data.reactionCounts,
          commentCount: data.commentCount ?? 0,
          createdAtMs,
        };
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'confessions');
      } catch (wrapped) {
        onFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    },
  );
}

export function subscribeToComments(
  onData: (byConfession: Record<string, RawCommentRecord[]>) => void,
  onFatalError: (err: Error) => void,
): Unsubscribe {
  const q = query(collectionGroup(db, 'comments'), limit(500));

  return onSnapshot(
    q,
    (snapshot) => {
      const grouped: Record<string, RawCommentRecord[]> = {};
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as FirestoreCommentDoc;
        const createdAtMs =
          data.createdAt instanceof Timestamp
            ? data.createdAt.toMillis()
            : Date.now();
        const item: RawCommentRecord = {
          id: docSnap.id,
          confessionId: data.confessionId,
          text: data.text,
          avatar: data.avatar,
          createdAtMs,
          timeAgo: formatRelativeTime(createdAtMs),
        };
        if (!grouped[data.confessionId]) {
          grouped[data.confessionId] = [];
        }
        grouped[data.confessionId].push(item);
      }

      for (const key of Object.keys(grouped)) {
        grouped[key].sort((a, b) => a.createdAtMs - b.createdAtMs);
      }

      onData(grouped);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'comments');
      } catch (wrapped) {
        onFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    },
  );
}

function generateDeleteSecret(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  const length = 36;
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
  }
  let fallback = '';
  for (let i = 0; i < length; i += 1) {
    fallback += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return fallback;
}

export interface PublishedConfessionResult {
  id: string;
  deleteSecret: string;
}

export async function publishConfession(payload: {
  body: string;
  category: string;
  businessType: string;
}): Promise<PublishedConfessionResult> {
  const body = payload.body.trim().slice(0, MAX_BODY_LENGTH);
  if (!body) {
    throw new Error('La historia no puede estar vacía.');
  }

  const id = createSafeId('story');
  const deleteSecret = generateDeleteSecret();
  const path = `confessions/${id}`;

  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'confessions', id), {
      category: sanitizeCategory(payload.category),
      businessType: sanitizeBusinessType(payload.businessType),
      body,
      reactionCounts: {
        fire: 1,
        skull: 0,
        clown: 0,
        hug: 1,
        money: 0,
      },
      commentCount: 0,
      createdAt: serverTimestamp(),
    });
    batch.set(doc(db, 'confessions', id, 'private', 'deleteAuth'), {
      secret: deleteSecret,
      armed: false,
    });
    await batch.commit();
    return {id, deleteSecret};
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteOwnConfession(
  storyId: string,
  deleteSecret: string,
): Promise<void> {
  if (!SAFE_ID_REGEX.test(storyId) || deleteSecret.length < 24) {
    throw new Error('No se encontró la clave de borrado para esta confesión.');
  }

  const deleteAuthRef = doc(db, 'confessions', storyId, 'private', 'deleteAuth');
  const authPath = `confessions/${storyId}/private/deleteAuth`;

  try {
    await updateDoc(deleteAuthRef, {
      secret: deleteSecret,
      armed: true,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, authPath);
  }

  const storyPath = `confessions/${storyId}`;
  try {
    const commentsSnap = await getDocs(
      query(collection(db, 'confessions', storyId, 'comments'), limit(490)),
    );
    const batch = writeBatch(db);
    for (const commentDoc of commentsSnap.docs) {
      batch.delete(commentDoc.ref);
    }
    batch.delete(doc(db, 'confessions', storyId));
    batch.delete(deleteAuthRef);
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, storyPath);
  }
}

export async function toggleConfessionReaction(
  storyId: string,
  emoji: string,
  delta: 1 | -1,
): Promise<void> {
  const key = REACTION_EMOJI_TO_KEY[emoji];
  if (!key) return;
  const path = `confessions/${storyId}`;
  try {
    await updateDoc(doc(db, 'confessions', storyId), {
      [`reactionCounts.${key}`]: increment(delta),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addConfessionComment(
  storyId: string,
  text: string,
  avatar: AvatarConfig,
): Promise<void> {
  const cleanText = text.trim().slice(0, MAX_COMMENT_LENGTH);
  if (!cleanText) return;

  const commentId = createSafeId('c');
  const path = `confessions/${storyId}/comments/${commentId}`;

  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'confessions', storyId, 'comments', commentId), {
      confessionId: storyId,
      text: cleanText,
      avatar,
      createdAt: serverTimestamp(),
    });
    batch.update(doc(db, 'confessions', storyId), {
      commentCount: increment(1),
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
