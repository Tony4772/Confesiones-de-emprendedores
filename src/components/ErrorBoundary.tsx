import React from 'react';
import {AlertTriangle, RefreshCw} from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  ErrorBoundaryState
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false, message: ''};
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Ocurrió un error inesperado.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const isQuotaError = this.state.message.toLowerCase().includes('quota exceeded');
      return (
        <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-surface-container rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-primary">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h2 className="font-headline-md text-[18px] text-on-surface">
                {isQuotaError
                  ? 'Límite diario de base de datos alcanzado'
                  : 'Algo salió mal al cargar el muro'}
              </h2>
            </div>
            <p className="text-[14px] text-on-surface-variant leading-relaxed">
              {isQuotaError
                ? 'Se ha alcanzado el límite gratuito diario de lecturas de Firestore. El límite se restablecerá mañana.'
                : 'No pudimos completar la operación con la base de datos en este momento. Intenta recargar la página.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-container hover:bg-inverse-primary text-on-primary-container font-headline-md text-[13px] rounded-lg cursor-pointer self-start"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recargar página</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
