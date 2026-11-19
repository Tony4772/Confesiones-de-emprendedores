import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {AboutModal, ToastStack} from './components/Overlays';
import {EXTRA_CONFESSIONS} from './data/mockData';
import {
  addConfessionComment,
  countsMapToReactions,
  deleteOwnConfession,
  formatRelativeTime,
  publishConfession,
  RawCommentRecord,
  RawConfessionRecord,
  seedExtraConfessionsIfMissing,
  seedInitialConfessionsIfEmpty,
  subscribeToComments,
  subscribeToConfessions,
  toggleConfessionReaction,
} from './services/confessionsService';
import {Confession, FilterTab, ToastMessage} from './types';
import {generateUniqueAvatar} from './utils/avatarGenerator';
import {MuroDelDolorView} from './views/MuroDelDolorView';

const PREFS_STORAGE_KEY = 'confesiones_negocios_prefs_v1';

interface LocalUserPrefs {
  bookmarkedIds: string[];
  votedReactions: Record<string, string[]>;
  myConfessionSecrets: Record<string, string>;
}

function loadLocalPrefs(): LocalUserPrefs {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalUserPrefs>;
      return {
        bookmarkedIds: Array.isArray(parsed.bookmarkedIds) ? parsed.bookmarkedIds : [],
        votedReactions:
          parsed.votedReactions && typeof parsed.votedReactions === 'object'
            ? parsed.votedReactions
            : {},
        myConfessionSecrets:
          parsed.myConfessionSecrets && typeof parsed.myConfessionSecrets === 'object'
            ? parsed.myConfessionSecrets
            : {},
      };
    }
  } catch {
    // ignore storage errors
  }
  return {bookmarkedIds: [], votedReactions: {}, myConfessionSecrets: {}};
}

export default function App() {
  const [activeTab, setActiveTab] = useState<FilterTab>('recent');
  const [rawConfessions, setRawConfessions] = useState<RawConfessionRecord[]>([]);
  const [commentsByConfession, setCommentsByConfession] = useState<
    Record<string, RawCommentRecord[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [fatalError, setFatalError] = useState<Error | null>(null);

  const [prefs, setPrefs] = useState<LocalUserPrefs>(loadLocalPrefs);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const composerInputRef = useRef<HTMLTextAreaElement | null>(null);

  const pushToast = useCallback((title: string, subtitle?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, {id, title, subtitle}]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore storage errors
    }
  }, [prefs]);

  useEffect(() => {
    let active = true;

    void seedInitialConfessionsIfEmpty().catch((err) => {
      if (active) {
        setFatalError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    });

    const unsubConfessions = subscribeToConfessions(
      (items) => {
        if (!active) return;
        setRawConfessions(items);
        setIsLoading(false);
      },
      (err) => {
        if (!active) return;
        setFatalError(err);
        setIsLoading(false);
      },
    );

    const unsubComments = subscribeToComments(
      (grouped) => {
        if (!active) return;
        setCommentsByConfession(grouped);
      },
      (err) => {
        if (!active) return;
        setFatalError(err);
      },
    );

    return () => {
      active = false;
      unsubConfessions();
      unsubComments();
    };
  }, []);

  if (fatalError) {
    throw fatalError;
  }

  const confessions = useMemo<Confession[]>(() => {
    const bookmarkedSet = new Set(prefs.bookmarkedIds);
    return rawConfessions.map((item) => {
      const votedEmojis = new Set(prefs.votedReactions[item.id] ?? []);
      const baseReactions = countsMapToReactions(item.reactionCounts).map((r) => ({
        ...r,
        voted: votedEmojis.has(r.emoji),
      }));
      const comments = commentsByConfession[item.id] ?? [];

      return {
        id: item.id,
        category: item.category,
        businessType: item.businessType,
        timeAgo: formatRelativeTime(item.createdAtMs),
        createdAt: item.createdAtMs,
        body: item.body,
        reactions: baseReactions,
        comments,
        bookmarked: bookmarkedSet.has(item.id),
        canDelete: Boolean(prefs.myConfessionSecrets[item.id]),
      };
    });
  }, [rawConfessions, commentsByConfession, prefs]);

  const hasMoreExtra = useMemo(() => {
    const existingIds = new Set(rawConfessions.map((c) => c.id));
    return EXTRA_CONFESSIONS.some((extra) => !existingIds.has(extra.id));
  }, [rawConfessions]);

  const handleFocusComposer = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    window.setTimeout(() => {
      composerInputRef.current?.focus();
    }, 250);
  };

  const handlePublishStory = async (payload: {
    body: string;
    category: string;
    businessType: string;
  }) => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      const {id, deleteSecret} = await publishConfession(payload);
      setPrefs((prev) => ({
        ...prev,
        myConfessionSecrets: {
          ...prev.myConfessionSecrets,
          [id]: deleteSecret,
        },
      }));
      setActiveTab('recent');
      pushToast(
        'Historia publicada anónimamente',
        'Si te arrepientes, verás el botón de borrar en tu historia.',
      );
    } catch {
      pushToast('No se pudo publicar la historia', 'Inténtalo de nuevo en unos segundos.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    const secret = prefs.myConfessionSecrets[storyId];
    if (!secret) {
      pushToast('No se puede borrar esta confesión desde este navegador');
      return;
    }

    try {
      await deleteOwnConfession(storyId, secret);
      setPrefs((prev) => {
        const nextSecrets = {...prev.myConfessionSecrets};
        delete nextSecrets[storyId];
        const nextVotes = {...prev.votedReactions};
        delete nextVotes[storyId];
        return {
          ...prev,
          bookmarkedIds: prev.bookmarkedIds.filter((id) => id !== storyId),
          votedReactions: nextVotes,
          myConfessionSecrets: nextSecrets,
        };
      });
      pushToast('Confesión eliminada', 'Ya no aparece para nadie en el muro.');
    } catch {
      pushToast('No se pudo eliminar la confesión', 'Inténtalo de nuevo en unos segundos.');
    }
  };

  const handleToggleReaction = async (storyId: string, emoji: string) => {
    const currentStory = confessions.find((c) => c.id === storyId);
    const currentReaction = currentStory?.reactions.find((r) => r.emoji === emoji);
    const currentlyVoted = Boolean(currentReaction?.voted);
    const currentCount = currentReaction?.count ?? 0;

    if (currentlyVoted && currentCount <= 0) return;

    const delta: 1 | -1 = currentlyVoted ? -1 : 1;

    setPrefs((prev) => {
      const existingList = prev.votedReactions[storyId] ?? [];
      const nextList = currentlyVoted
        ? existingList.filter((e) => e !== emoji)
        : [...existingList, emoji];
      return {
        ...prev,
        votedReactions: {
          ...prev.votedReactions,
          [storyId]: nextList,
        },
      };
    });

    try {
      await toggleConfessionReaction(storyId, emoji, delta);
    } catch {
      setPrefs((prev) => {
        const existingList = prev.votedReactions[storyId] ?? [];
        const reverted = currentlyVoted
          ? [...existingList, emoji]
          : existingList.filter((e) => e !== emoji);
        return {
          ...prev,
          votedReactions: {
            ...prev.votedReactions,
            [storyId]: reverted,
          },
        };
      });
      pushToast('No se pudo guardar tu reacción');
    }
  };

  const handleAddComment = async (storyId: string, text: string) => {
    const avatar = generateUniqueAvatar();
    try {
      await addConfessionComment(storyId, text, avatar);
      pushToast('Comentario añadido');
    } catch {
      pushToast('No se pudo enviar el comentario', 'Inténtalo de nuevo.');
    }
  };

  const handleToggleBookmark = (storyId: string) => {
    let savedNow = false;
    setPrefs((prev) => {
      const exists = prev.bookmarkedIds.includes(storyId);
      savedNow = !exists;
      return {
        ...prev,
        bookmarkedIds: exists
          ? prev.bookmarkedIds.filter((id) => id !== storyId)
          : [...prev.bookmarkedIds, storyId],
      };
    });
    pushToast(savedNow ? 'Historia guardada' : 'Quitada de guardados');
  };

  const handleShareStory = async (story: Confession) => {
    const text = `“${story.body}” — Confesiones de Emprendedores`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard restrictions
    }
    pushToast('Historia copiada al portapapeles');
  };

  const handleLoadMore = async () => {
    if (hasMoreExtra) {
      try {
        const added = await seedExtraConfessionsIfMissing();
        if (added > 0) {
          pushToast('Más historias cargadas');
        }
      } catch {
        pushToast('No se pudieron cargar más historias');
      }
    } else {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const handleResetLocal = () => {
    try {
      localStorage.removeItem(PREFS_STORAGE_KEY);
    } catch {
      // ignore
    }
    setPrefs({bookmarkedIds: [], votedReactions: {}, myConfessionSecrets: {}});
    setActiveTab('recent');
    pushToast(
      'Preferencias locales reiniciadas',
      'Se limpiaron tus guardados, votos y claves de borrado en este navegador.',
    );
  };

  const savedCount = useMemo(() => {
    const visibleIds = new Set(confessions.map((c) => c.id));
    return prefs.bookmarkedIds.filter((id) => visibleIds.has(id)).length;
  }, [confessions, prefs.bookmarkedIds]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-on-surface">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onFocusComposer={handleFocusComposer}
        savedCount={savedCount}
        totalStoriesCount={confessions.length}
      />

      <main className="w-full pt-20 bg-background flex-1">
        <MuroDelDolorView
          confessions={confessions}
          isLoading={isLoading}
          isPublishing={isPublishing}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          hasMoreExtra={hasMoreExtra}
          onLoadMore={() => void handleLoadMore()}
          onPublishStory={handlePublishStory}
          onDeleteStory={handleDeleteStory}
          onToggleReaction={(id, emoji) => void handleToggleReaction(id, emoji)}
          onAddComment={(id, text) => void handleAddComment(id, text)}
          onToggleBookmark={handleToggleBookmark}
          onShareStory={(s) => void handleShareStory(s)}
          composerInputRef={composerInputRef}
        />
      </main>

      <Footer
        onOpenAbout={() => setAboutOpen(true)}
        onResetLocal={handleResetLocal}
      />

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
