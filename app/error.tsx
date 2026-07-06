'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full border border-red-500 border-opacity-30 p-6 bg-black/50 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 animate-pulse">&gt; ERROR 500: CONTROLADOR DE SISTEMA CRÍTICO</h1>
        <p className="mb-4 text-opacity-85 text-xs">
          Ocurrió una interrupción del sistema en Nexus_OS. Detalles técnicos:
        </p>
        <div className="bg-[#050505] p-3 border border-red-500 border-opacity-10 mb-6 text-xs overflow-auto max-h-40">
          <code className="text-red-400">{error.message || 'Error de procesamiento de datos'}</code>
          {error.digest && <div className="text-[10px] opacity-60 mt-1">Digest: {error.digest}</div>}
        </div>
        <button
          onClick={() => reset()}
          className="inline-block border border-red-500 px-4 py-2 hover:bg-red-500 hover:bg-opacity-10 transition-colors text-xs font-bold"
        >
          Reiniciar Sector de Memoria
        </button>
      </div>
    </div>
  );
}
