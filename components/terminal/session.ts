'use client';

// Sesión de usuario simulada (definida a nivel de módulo para cumplir las pautas de pureza de React)
export let moduleSessionStartTime = 0;
export let moduleSessionPID = 4892;
export let moduleSessionIP = "192.168.1.105";

if (typeof window !== 'undefined') {
  moduleSessionStartTime = Date.now();
  moduleSessionPID = Math.floor(Math.random() * 8000) + 1000;
  moduleSessionIP = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
}

export function getElapsedTimeString() {
  if (moduleSessionStartTime === 0) return '0s';
  const elapsedMs = Date.now() - moduleSessionStartTime;
  const elapsedSecTotal = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(elapsedSecTotal / 3600);
  const minutes = Math.floor((elapsedSecTotal % 3600) / 60);
  const seconds = elapsedSecTotal % 60;
  
  let timeStr = '';
  if (hours > 0) {
    timeStr += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    timeStr += `${minutes}m `;
  }
  timeStr += `${seconds}s`;
  return timeStr;
}
