"use client";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">No se pudieron cargar los datos</p>
        <p className="text-xs text-gray-400 mt-0.5">Verificá tu conexión o intentá de nuevo</p>
      </div>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer"
      >
        Reintentar
      </button>
    </div>
  );
}
