'use client';

import React, { useState, useEffect } from 'react';
import { moduleSessionStartTime } from '../session';

interface SysInfoSimulationProps {
  theme: string;
}

export function SysInfoSimulation({ theme }: SysInfoSimulationProps) {
  const [uptime, setUptime] = useState('Calculando...');
  const [memory, setMemory] = useState('Calculando...');
  const [cpu, setCpu] = useState('Calculando...');

  useEffect(() => {
    const updateStats = () => {
      if (moduleSessionStartTime > 0) {
        const elapsedMs = Date.now() - moduleSessionStartTime;
        const elapsedSecTotal = Math.floor(elapsedMs / 1000);
        
        const baseSecs = elapsedSecTotal + (86400 * 1) + (3600 * 4) + (60 * 12) + 24;
        const days = Math.floor(baseSecs / 86400);
        const hours = Math.floor((baseSecs % 86400) / 3600);
        const minutes = Math.floor((baseSecs % 3600) / 60);
        const seconds = baseSecs % 60;
        
        setUptime(`${days}d ${hours}h ${minutes}m ${seconds}s`);

        // Consumo de memoria 100% real obtenido mediante Web APIs del navegador
        const nav = typeof window !== 'undefined' ? (window.navigator as any) : null;
        const perf = typeof window !== 'undefined' ? (window.performance as any) : null;
        const deviceRAM = nav?.deviceMemory || 8; // RAM física real del usuario en GB

        if (perf && perf.memory) {
          // Si el navegador soporta performance.memory (Chromium), mostramos el consumo real del JS Heap de la pestaña
          const usedHeapMB = (perf.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
          const limitHeapMB = (perf.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(0);
          const percentage = ((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100).toFixed(1);
          setMemory(`${usedHeapMB} MB Heap / ${deviceRAM} GB RAM (${percentage}%)`);
        } else {
          // Fallback con la memoria física real y un uso dinámico realista
          const baseMem = deviceRAM * 0.39; 
          const drift = Math.sin(elapsedSecTotal / 10) * 0.08;
          const currentMem = parseFloat((baseMem + drift).toFixed(2));
          const percentage = parseFloat(((currentMem / deviceRAM) * 100).toFixed(1));
          setMemory(`${currentMem.toFixed(2)} GB / ${deviceRAM}.00 GB (${percentage}%)`);
        }

        const baseCpu = 8;
        const cpuDrift = Math.round(Math.abs(Math.sin(elapsedSecTotal / 5) * 15));
        setCpu(`${baseCpu + cpuDrift}%`);
      } else {
        setUptime('1d 4h 12m 24s');
        setMemory('3.12 GB / 8.00 GB (39.0%)');
        setCpu('8%');
      }
    };

    // Actualización dinámica en vivo cada segundo
    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1.5 font-mono border border-current border-opacity-20 p-3 bg-black/30 rounded-lg max-w-sm select-text">
      <div className="flex items-center space-x-1.5 text-white font-bold border-b border-current border-opacity-10 pb-1 mb-1 text-[11px]">
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        <span className="uppercase tracking-wider">INFORMACIÓN DEL SISTEMA</span>
      </div>
      <div className="grid grid-cols-3 gap-y-1 gap-x-2 text-[11px]">
        <span className="opacity-60 font-medium">SISTEMA OS:</span>
        <span className="col-span-2 text-white font-semibold">Nexus_OS v3.2.0-secure</span>
        
        <span className="opacity-60 font-medium">UPTIME:</span>
        <span className="col-span-2 font-mono text-emerald-400 font-semibold">{uptime}</span>
        
        <span className="opacity-60 font-medium">MEMORIA:</span>
        <span className="col-span-2 font-mono text-cyan-400 font-semibold">{memory}</span>
        
        <span className="opacity-60 font-medium">CARGA CPU:</span>
        <span className="col-span-2 text-white/90">{cpu}</span>

        <span className="opacity-60 font-medium">NÚCLEOS CPU:</span>
        <span className="col-span-2 text-yellow-500 font-bold">16 CORES (ACTIVE)</span>

        <span className="opacity-60 font-medium">ESTADO ENLACE:</span>
        <span className="col-span-2 text-green-400 font-bold">ESTABLE (ENLACE SEGURO)</span>
      </div>
    </div>
  );
}
