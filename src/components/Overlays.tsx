import React from 'react';
import {CheckCircle2, ShieldCheck, X} from 'lucide-react';
import {ToastMessage} from '../types';

export const ToastStack: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({toasts, onDismiss}) => {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-surface-container-high border border-primary/30 rounded-xl p-3.5 shadow-2xl flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
            <div>
              <p className="font-headline-md text-[13px] text-on-surface">{t.title}</p>
              {t.subtitle && (
                <p className="text-[12px] text-on-surface-variant mt-0.5">{t.subtitle}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="text-outline hover:text-on-surface cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const AboutModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({open, onClose}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-surface-container rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary-container" />
            <h3 className="font-headline-md text-[22px] text-on-surface">
              ¿Cómo funciona?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 text-[14px] text-on-surface-variant leading-relaxed">
          <p>
            Es un tablón sencillo para que cualquier persona con un negocio, tienda o trabajo con clientes pueda desahogarse y compartir anécdotas de forma anónima.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>No necesitas cuenta, correo ni contraseña.</li>
            <li>Escribe lo que te pasó, elige un tema y publícalo al instante.</li>
            <li>Si te arrepientes, puedes borrar tus propias confesiones desde el mismo navegador.</li>
            <li>Lee las historias de los demás, reacciona y deja comentarios anónimos.</li>
            <li>Evita poner nombres reales de personas o empresas para evitar problemas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
