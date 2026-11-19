import React from 'react';

interface FooterProps {
  onOpenAbout: () => void;
  onResetLocal: () => void;
}

export const Footer: React.FC<FooterProps> = ({onOpenAbout, onResetLocal}) => {
  return (
    <footer className="w-full bg-surface-container-lowest mt-10 py-8 border-t border-white/[0.04]">
      <div className="w-full px-5 md:px-12 max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-quote-editorial text-[13px] text-on-surface-variant text-center md:text-left">
          “100% anónimo y sin registro. Para desahogarse y leer historias reales de clientes y negocios.”
        </p>

        <div className="flex items-center gap-5 font-label-caps text-[11px] text-outline shrink-0">
          <button
            type="button"
            onClick={onOpenAbout}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Cómo funciona
          </button>
          <button
            type="button"
            onClick={onResetLocal}
            className="hover:text-secondary transition-colors cursor-pointer"
          >
            Limpiar mis datos
          </button>
          <span>© 2025 CONFESIONES</span>
        </div>
      </div>
    </footer>
  );
};
