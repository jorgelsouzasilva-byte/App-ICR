import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// FIX: Changed to `React.Component` to resolve potential type ambiguity.
class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Switched to class field for state initialization. This is a more modern syntax
  // and can resolve tooling issues that sometimes arise with constructors.
  public state: State = {
    hasError: false
  };

  // FIX: Explicitly add constructor to pass props to super() which can help resolve type inference issues.
  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(_: Error): State {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erros
    console.error("Erro não capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Renderiza qualquer UI de fallback personalizada
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-50/50 text-red-700">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-soft mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">Oops! Algo deu errado.</h1>
            <p className="text-sm text-slate-500 max-w-xs">
              Ocorreu um erro inesperado. Nossa equipe foi notificada. Por favor, tente recarregar a página.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
                <RotateCw className="w-4 h-4" />
                Recarregar
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
