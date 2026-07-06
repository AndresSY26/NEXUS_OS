'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full border border-[#00ff00] border-opacity-30 p-6 bg-black/50 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 animate-pulse">&gt; ERROR 404: RECURSO NO ENCONTRADO</h1>
        <p className="mb-4 opacity-80 leading-relaxed">
          El recurso solicitado no existe o ha sido movido a otro sector de memoria en el sistema Nexus_OS.
        </p>
        <div className="bg-[#050505] p-3 border border-[#00ff00] border-opacity-10 mb-6 text-xs opacity-75">
          <div>ORIGIN: CLOUD_RUN_CONTAINER</div>
          <div>STATUS: DISCONNECTED_MEM</div>
          <div>SECTOR: 0x404F_3902</div>
        </div>
        <Link 
          href="/" 
          className="inline-block border border-[#00ff00] px-4 py-2 hover:bg-[#00ff00] hover:bg-opacity-10 transition-colors"
        >
          &lt; Volver al Sistema
        </Link>
      </div>
    </div>
  );
}
