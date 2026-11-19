import React, {useState} from 'react';
import {Bookmark, Flame, PenLine} from 'lucide-react';
import {HOTLINKED_LOGO_URL} from '../data/mockData';
import {FilterTab} from '../types';

interface HeaderProps {
  activeTab: FilterTab;
  onSelectTab: (tab: FilterTab) => void;
  onFocusComposer: () => void;
  savedCount: number;
  totalStoriesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onFocusComposer,
  savedCount,
  totalStoriesCount,
}) => {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_16px_rgba(0,0,0,0.45)] border-b border-white/[0.04]">
      <div className="h-16 md:h-20 w-full px-5 md:px-12 flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        {/* Left: Brand */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('recent');
            window.scrollTo({top: 0, behavior: 'smooth'});
          }}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none shrink-0"
        >
          {!logoFailed ? (
            <img
              src={HOTLINKED_LOGO_URL}
              alt="Confesiones Logo"
              referrerPolicy="no-referrer"
              onError={() => setLogoFailed(true)}
              className="h-8 w-auto object-contain rounded"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container shrink-0">
              <Flame className="w-5 h-5" />
            </div>
          )}
          <span className="font-headline-md text-[20px] md:text-[24px] tracking-tight text-on-surface group-hover:text-primary transition-colors whitespace-nowrap">
            Confesiones
          </span>
        </button>

        {/* Right: Story Count + Saved + Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-block font-label-code text-[12px] text-outline whitespace-nowrap">
            {totalStoriesCount} historias
          </span>

          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'saved' ? 'recent' : 'saved')}
            title="Ver historias guardadas"
            aria-label="Ver historias guardadas"
            className={`relative w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${savedCount > 0 ? 'fill-current' : ''}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-primary-container text-on-primary-container font-label-code text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onFocusComposer}
            className="flex items-center gap-1.5 px-3.5 md:px-4 py-2 md:py-2.5 bg-primary-container hover:bg-inverse-primary text-on-primary-container font-headline-md text-[13px] rounded-lg shadow-[0_0_20px_rgba(255,107,53,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PenLine className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Contar mi historia</span>
            <span className="sm:hidden">Contar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
