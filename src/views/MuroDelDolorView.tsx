import React, {useMemo, useState} from 'react';
import {
  Award,
  Bookmark,
  ChevronDown,
  ChevronsDown,
  Flame,
  MessageCircle,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import {CommentAvatar} from '../components/CommentAvatar';
import {WeeklyCategorySummaryChart} from '../components/WeeklyCategorySummaryChart';
import {BUSINESS_TYPES, STORY_CATEGORIES} from '../data/mockData';
import {Confession, FilterTab} from '../types';

interface MuroDelDolorViewProps {
  confessions: Confession[];
  isLoading: boolean;
  isPublishing: boolean;
  activeTab: FilterTab;
  onSelectTab: (tab: FilterTab) => void;
  hasMoreExtra: boolean;
  onLoadMore: () => void;
  onPublishStory: (payload: {
    body: string;
    category: string;
    businessType: string;
  }) => Promise<void> | void;
  onDeleteStory: (storyId: string) => Promise<void> | void;
  onToggleReaction: (storyId: string, emoji: string) => void;
  onAddComment: (storyId: string, text: string) => Promise<void> | void;
  onToggleBookmark: (storyId: string) => void;
  onShareStory: (story: Confession) => void;
  composerInputRef: React.RefObject<HTMLTextAreaElement | null>;
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(count);
}

export const MuroDelDolorView: React.FC<MuroDelDolorViewProps> = ({
  confessions,
  isLoading,
  isPublishing,
  activeTab,
  onSelectTab,
  hasMoreExtra,
  onLoadMore,
  onPublishStory,
  onDeleteStory,
  onToggleReaction,
  onAddComment,
  onToggleBookmark,
  onShareStory,
  composerInputRef,
}) => {
  const [body, setBody] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(STORY_CATEGORIES[0]);
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [formError, setFormError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [openCommentsMap, setOpenCommentsMap] = useState<Record<string, boolean>>({
    'story-1': true,
  });
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      setFormError('Escribe tu historia antes de publicarla.');
      return;
    }
    setFormError(null);
    await onPublishStory({
      body: trimmed,
      category: selectedCategory,
      businessType,
    });
    setBody('');
  };

  const toggleComments = (storyId: string) => {
    setOpenCommentsMap((prev) => ({...prev, [storyId]: !prev[storyId]}));
  };

  const handleCommentSubmit = (e: React.FormEvent, storyId: string) => {
    e.preventDefault();
    const draft = (commentDrafts[storyId] || '').trim();
    if (!draft) return;
    onAddComment(storyId, draft);
    setCommentDrafts((prev) => ({...prev, [storyId]: ''}));
  };

  const topStory = useMemo(() => {
    if (confessions.length === 0) return null;
    return [...confessions].sort((a, b) => {
      const sumA = a.reactions.reduce((acc, r) => acc + r.count, 0);
      const sumB = b.reactions.reduce((acc, r) => acc + r.count, 0);
      return sumB - sumA;
    })[0];
  }, [confessions]);

  const filteredStories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = [...confessions];

    if (activeTab === 'saved') {
      list = list.filter((s) => s.bookmarked);
    }

    if (categoryFilter) {
      list = list.filter((s) => s.category === categoryFilter);
    }

    if (q) {
      list = list.filter(
        (s) =>
          s.body.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.businessType.toLowerCase().includes(q) ||
          s.comments.some((c) => c.text.toLowerCase().includes(q)),
      );
    }

    if (activeTab === 'popular') {
      list.sort((a, b) => {
        const sumA = a.reactions.reduce((acc, r) => acc + r.count, 0);
        const sumB = b.reactions.reduce((acc, r) => acc + r.count, 0);
        return sumB - sumA;
      });
    } else {
      list.sort((a, b) => b.createdAt - a.createdAt);
    }

    return list;
  }, [confessions, activeTab, categoryFilter, searchQuery]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Subtle Top Ambient Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[820px] h-[300px] bg-gradient-to-b from-primary-container/15 via-secondary-container/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="w-full px-5 md:px-12 py-8 md:py-10 flex flex-col gap-8 relative z-10 max-w-[1440px] mx-auto">
        {/* Clean Hero */}
        <section className="max-w-3xl flex flex-col gap-3">
          <h1 className="font-display-hero text-[34px] md:text-[50px] text-on-surface tracking-tight text-balance">
            CONFESIONES{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">
              DE EMPRENDEDORES
            </span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-on-surface-variant leading-relaxed">
            Cuenta de forma anónima esa historia surrealista, el cliente que te hizo perder la paciencia o la anécdota que no puedes poner en tus redes. O simplemente siéntate a leer las de los demás.
          </p>
        </section>

        {/* Simple Story Composer without gimmicky tags */}
        <section className="w-full bg-surface-container rounded-xl p-5 md:p-6 shadow-xl">
          <form onSubmit={handleSubmitStory} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-headline-md text-[17px] text-on-surface">
                Suelta tu confesión o historia anónima
              </span>
              <span className="font-label-code text-[12px] text-outline">
                100% anónimo · Sin registro
              </span>
            </div>

            <div className="relative">
              <textarea
                ref={composerInputRef}
                id="story-input"
                rows={3}
                maxLength={600}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Ej: Ayer vino un cliente a pedirme que le rebajara el precio porque 'su primo lo hace más barato'... Cuéntalo sin filtros."
                className="w-full bg-surface-container-lowest text-on-surface text-[15px] placeholder:text-outline p-4 pb-8 rounded-lg resize-y focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
              />
              <div className="absolute bottom-2.5 right-3 font-label-code text-[11px] text-outline">
                {body.length}/600
              </div>
            </div>

            {formError && <p className="font-label-code text-[12px] text-error">{formError}</p>}

            {/* Bottom Row: Simple Selects + Publish Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label="Tema de la historia"
                    className="w-full appearance-none bg-surface-container-low text-on-surface font-label-code text-[13px] pl-3.5 pr-9 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {STORY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        Tema: {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-outline absolute right-3 top-3 pointer-events-none" />
                </div>

                <div className="relative sm:w-56">
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    aria-label="Tipo de negocio"
                    className="w-full appearance-none bg-surface-container-low text-on-surface font-label-code text-[13px] pl-3.5 pr-9 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-outline absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-container hover:bg-inverse-primary disabled:opacity-60 text-on-primary-container font-headline-md text-[14px] rounded-lg shadow-lg transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>{isPublishing ? 'Publicando...' : 'Publicar anónimamente'}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Main Content Grid: Easy-to-read Feed + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Feed Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Simple Toolbar */}
            <div className="bg-surface-container-low p-2.5 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  {id: 'recent' as const, label: 'Recientes'},
                  {id: 'popular' as const, label: 'Más votadas'},
                  {id: 'saved' as const, label: 'Guardadas'},
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSelectTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-lg font-label-caps text-[11px] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-surface-container-high text-primary font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative shrink-0 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar historias o clientes..."
                  className="w-full bg-surface-container-lowest text-on-surface text-[13px] pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline"
                />
                <Search className="w-4 h-4 text-outline absolute left-2.5 top-2" />
              </div>
            </div>

            {categoryFilter && (
              <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low rounded-lg border border-primary/20">
                <span className="font-label-code text-[12px] text-on-surface-variant">
                  Tema filtrado: <strong className="text-primary">{categoryFilter}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setCategoryFilter(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-label-caps text-outline hover:text-on-surface cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Ver todos
                </button>
              </div>
            )}

            {/* Stories Stream */}
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  {[0, 1, 2].map((skeletonIdx) => (
                    <div
                      key={skeletonIdx}
                      className="bg-surface-container p-6 rounded-xl animate-pulse flex flex-col gap-3"
                    >
                      <div className="h-3 w-40 bg-surface-container-high rounded" />
                      <div className="h-4 w-full bg-surface-container-high rounded" />
                      <div className="h-4 w-5/6 bg-surface-container-high rounded" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-7 w-14 bg-surface-container-low rounded-full" />
                        <div className="h-7 w-14 bg-surface-container-low rounded-full" />
                        <div className="h-7 w-14 bg-surface-container-low rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredStories.length === 0 ? (
                <div className="bg-surface-container p-8 rounded-xl text-center flex flex-col items-center gap-3">
                  <Flame className="w-8 h-8 text-outline" />
                  <p className="font-headline-md text-[18px] text-on-surface">
                    {activeTab === 'saved'
                      ? 'Todavía no has guardado ninguna historia.'
                      : 'No hay historias que coincidan con esa búsqueda.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter(null);
                      onSelectTab('recent');
                    }}
                    className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright rounded-lg font-label-caps text-[11px] text-primary cursor-pointer"
                  >
                    Ver todas las historias
                  </button>
                </div>
              ) : (
                filteredStories.map((story) => {
                  const commentsOpen = Boolean(openCommentsMap[story.id]);
                  return (
                    <article
                      key={story.id}
                      className="bg-surface-container p-5 md:p-6 rounded-xl flex flex-col gap-4 shadow-md"
                    >
                      {/* Clean unboxed metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-label-code text-outline">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-semibold">{story.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-on-surface-variant">{story.businessType}</span>
                        </div>
                        <span>{story.timeAgo}</span>
                      </div>

                      {/* Story Body */}
                      <p className="text-[17px] md:text-[18px] text-on-surface leading-relaxed">
                        {story.body}
                      </p>

                      {/* Reactions + Comments + Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {story.reactions.map((reaction) => (
                            <button
                              key={reaction.emoji}
                              type="button"
                              onClick={() => onToggleReaction(story.id, reaction.emoji)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-code text-[13px] transition-all active:scale-90 cursor-pointer ${
                                reaction.voted
                                  ? 'bg-primary-container text-on-primary-container font-bold'
                                  : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                              }`}
                            >
                              <span>{reaction.emoji}</span>
                              <span>{formatCount(reaction.count)}</span>
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleComments(story.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-code text-[12px] transition-colors cursor-pointer ${
                              commentsOpen
                                ? 'bg-surface-container-high text-primary'
                                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>
                              {story.comments.length}{' '}
                              {story.comments.length === 1 ? 'comentario' : 'comentarios'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onShareStory(story)}
                            title="Copiar historia"
                            aria-label="Copiar historia"
                            className="p-2 text-outline hover:text-primary transition-colors cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleBookmark(story.id)}
                            title={story.bookmarked ? 'Quitar de guardados' : 'Guardar historia'}
                            aria-label="Guardar historia"
                            className={`p-2 transition-colors cursor-pointer ${
                              story.bookmarked
                                ? 'text-secondary'
                                : 'text-outline hover:text-secondary'
                            }`}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${story.bookmarked ? 'fill-secondary' : ''}`}
                            />
                          </button>
                          {story.canDelete && (
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDeleteId((prev) =>
                                  prev === story.id ? null : story.id,
                                )
                              }
                              title="Borrar mi confesión"
                              aria-label="Borrar mi confesión"
                              className={`p-2 transition-colors cursor-pointer ${
                                confirmDeleteId === story.id
                                  ? 'text-error'
                                  : 'text-outline hover:text-error'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline Delete Confirmation for Author */}
                      {story.canDelete && confirmDeleteId === story.id && (
                        <div className="bg-surface-container-low border border-error/30 rounded-lg px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[13px] text-on-surface-variant">
                            ¿Te arrepentiste de publicarla? Se borrará para todos.
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={deletingId === story.id}
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1 rounded-md bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-caps text-[11px] cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === story.id}
                              onClick={async () => {
                                setDeletingId(story.id);
                                await onDeleteStory(story.id);
                                setDeletingId(null);
                                setConfirmDeleteId(null);
                              }}
                              className="px-3 py-1 rounded-md bg-error/20 hover:bg-error/30 text-error font-label-caps text-[11px] cursor-pointer disabled:opacity-50"
                            >
                              {deletingId === story.id ? 'Borrando...' : 'Sí, borrar'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Simple Anonymous Comments Section */}
                      {commentsOpen && (
                        <div className="mt-1 pt-4 border-t border-white/[0.06] flex flex-col gap-3">
                          {story.comments.length === 0 ? (
                            <p className="text-[13px] text-outline italic">
                              Aún no hay comentarios. Sé el primero en opinar anónimamente.
                            </p>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {story.comments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="bg-surface-container-low rounded-lg px-3.5 py-2.5 flex items-start gap-3"
                                >
                                  <CommentAvatar
                                    avatar={comment.avatar}
                                    fallbackSeed={comment.id}
                                    size={32}
                                  />
                                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <p className="text-[14px] text-on-surface leading-snug">
                                      {comment.text}
                                    </p>
                                    <span className="text-[11px] font-label-code text-outline">
                                      {comment.timeAgo}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <form
                            onSubmit={(e) => handleCommentSubmit(e, story.id)}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              maxLength={280}
                              value={commentDrafts[story.id] || ''}
                              onChange={(e) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [story.id]: e.target.value,
                                }))
                              }
                              placeholder="Escribe una respuesta anónima..."
                              className="flex-1 bg-surface-container-lowest text-on-surface text-[13px] px-3.5 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline"
                            />
                            <button
                              type="submit"
                              className="px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface font-label-caps text-[11px] transition-colors cursor-pointer shrink-0"
                            >
                              Comentar
                            </button>
                          </form>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onLoadMore}
                className="flex items-center gap-2 px-6 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-md text-[13px] rounded-lg transition-colors cursor-pointer"
              >
                <ChevronsDown className="w-4 h-4" />
                <span>
                  {hasMoreExtra ? 'Cargar más historias' : 'Volver arriba del muro'}
                </span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-24">
            {topStory && (
              <div className="bg-surface-container rounded-xl p-5 flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-tertiary" />
                    <span className="font-headline-md text-[18px] text-tertiary">
                      Historia más votada
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-lg flex flex-col gap-2">
                  <span className="font-label-code text-[11px] text-outline">
                    {topStory.category} · {topStory.businessType}
                  </span>
                  <p className="text-[14px] text-on-surface leading-relaxed line-clamp-5">
                    “{topStory.body}”
                  </p>
                  <div className="flex items-center justify-between pt-1 font-label-code text-[12px] text-tertiary">
                    <span>
                      {topStory.reactions
                        .reduce((acc, r) => acc + r.count, 0)
                        .toLocaleString('es-ES')}{' '}
                      reacciones
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTab('popular')}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      Ver más votadas →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Categories Recharts Summary */}
            <WeeklyCategorySummaryChart
              confessions={confessions}
              activeCategory={categoryFilter}
              onSelectCategory={setCategoryFilter}
            />

            {/* Simple Anonymity Promise */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-headline-md text-[16px] text-on-surface">
                  Sin complicaciones
                </span>
              </div>
              <ul className="text-[13px] text-on-surface-variant space-y-1.5">
                <li>• No te pedimos correo ni cuenta para leer o escribir.</li>
                <li>• Si te arrepientes, puedes borrar tus historias desde este navegador.</li>
                <li>• Evita poner nombres reales de clientes o empresas.</li>
                <li>• Desahógate, reacciona y lee el chisme tranquilo.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
