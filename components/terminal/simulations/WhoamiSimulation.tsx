'use client';

import React, { useState, useEffect } from 'react';
import { moduleSessionPID, moduleSessionIP, getElapsedTimeString } from '../session';

export function WhoamiSimulation() {
  const [timeStr, setTimeStr] = useState(() => getElapsedTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(getElapsedTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1.5 font-mono border border-current border-opacity-20 p-3 bg-black/30 rounded-lg max-w-sm select-text">
      <div className="flex items-center space-x-1.5 text-white font-bold border-b border-current border-opacity-10 pb-1 mb-1 text-[11px]">
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        <span className="uppercase tracking-wider">INFORMACIÓN DE SESIÓN</span>
      </div>
      <div className="grid grid-cols-3 gap-y-1 gap-x-2 text-[11px]">
        <span className="opacity-60 font-medium">USUARIO:</span>
        <span className="col-span-2 text-white font-semibold">invitado@portfolio</span>
        
        <span className="opacity-60 font-medium">ID PROCESO:</span>
        <span className="col-span-2 font-bold text-yellow-500">PID {moduleSessionPID}</span>
        
        <span className="opacity-60 font-medium">DIRECCIÓN IP:</span>
        <span className="col-span-2 font-mono text-cyan-400 font-semibold">{moduleSessionIP}</span>
        
        <span className="opacity-60 font-medium">UBICACIÓN:</span>
        <span className="col-span-2 text-white">Sandbox Env (Virtual)</span>
        
        <span className="opacity-60 font-medium">CONECTADO:</span>
        <span className="col-span-2 text-emerald-400 font-bold">{timeStr}</span>

        <span className="opacity-60 font-medium">NÚCLEO OS:</span>
        <span className="col-span-2 text-white/90">Nexus_OS v3.2.0-secure</span>
      </div>
    </div>
  );
}
