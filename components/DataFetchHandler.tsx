import React from 'react';
import { RotateCw } from 'lucide-react';

interface DataFetchHandlerProps<T> {
  loading: boolean;
  error: Error | null;
  data: T[] | null;
  onRetry: () => void;
  render: (data: T[]) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

const DefaultLoader = () => (
    <div className="flex items-center justify-center h-full py-20">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
);

const DefaultEmpty = ({ message = "Nenhum item encontrado." }: { message?: string }) => (
    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <p>{message}</p>
    </div>
);

function DataFetchHandler<T>({
  loading,
  error,
  data,
  onRetry,
  render,
  loadingComponent,
  emptyComponent,
}: DataFetchHandlerProps<T>) {
  if (loading) {
    return loadingComponent || <DefaultLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 bg-red-50 rounded-3xl border border-dashed border-red-200 p-4 m-6">
        <p className="font-semibold mb-2">Erro ao carregar dados</p>
        <p className="text-xs text-red-500 mb-4">{error.message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
        >
          <RotateCw className="w-3 h-3" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return emptyComponent || <DefaultEmpty />;
  }

  return <>{render(data)}</>;
}

export default DataFetchHandler;