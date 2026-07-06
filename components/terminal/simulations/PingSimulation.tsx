'use client';

import React, { useState, useEffect } from 'react';

interface PingSimulationProps {
  target: string;
}

interface PingResultLine {
  seq: number;
  ip: string;
  bytes: number;
  ttl: number;
  time: number;
}

export function PingSimulation({ target }: PingSimulationProps) {
  const [lines, setLines] = useState<PingResultLine[]>([]);
  const [status, setStatus] = useState<'pinging' | 'finished'>('pinging');

  let hostName = target.trim() || 'google.com';
  hostName = hostName.replace(/^(https?:\/\/)?(www\.)?/, '');
  hostName = hostName.replace(/\/$/, '');

  let resolvedIp = '';
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipRegex.test(hostName)) {
    resolvedIp = hostName;
  } else {
    let hash = 0;
    for (let i = 0; i < hostName.length; i++) {
      hash = hostName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const ipParts = [
      Math.abs((hash >> 24) % 223) + 1,
      Math.abs((hash >> 16) % 254) + 1,
      Math.abs((hash >> 8) % 254) + 1,
      Math.abs(hash % 254) + 1
    ];
    resolvedIp = ipParts.join('.');
  }

  useEffect(() => {
    let currentSeq = 1;
    const maxSeq = 4;
    const intervalTime = 700;

    const interval = setInterval(() => {
      if (currentSeq <= maxSeq) {
        const randomTime = parseFloat((Math.random() * 28 + 4).toFixed(1));
        const randomTtl = Math.floor(Math.random() * 8) + 52;
        
        setLines(prev => [
          ...prev,
          {
            seq: currentSeq,
            ip: resolvedIp,
            bytes: 64,
            ttl: randomTtl,
            time: randomTime
          }
        ]);
        currentSeq++;
      } else {
        clearInterval(interval);
        setStatus('finished');
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [resolvedIp]);

  const totalSent = 4;
  const totalReceived = lines.length;
  const packetLoss = Math.round(((totalSent - totalReceived) / totalSent) * 100);

  const times = lines.map(l => l.time);
  const minTime = times.length > 0 ? Math.min(...times) : 0;
  const maxTime = times.length > 0 ? Math.max(...times) : 0;
  const avgTime = times.length > 0 ? parseFloat((times.reduce((a, b) => a + b, 0) / times.length).toFixed(3)) : 0;
  const mdev = times.length > 0 ? parseFloat((Math.sqrt(times.map(t => Math.pow(t - avgTime, 2)).reduce((a, b) => a + b, 0) / times.length)).toFixed(3)) : 0;

  return (
    <div className="font-mono text-xs space-y-1 select-text">
      <p className="text-zinc-400">
        PING {hostName} ({resolvedIp}) 56(84) bytes de datos.
      </p>
      
      <div className="space-y-0.5">
        {lines.map((line) => (
          <p key={line.seq} className="text-current opacity-90">
            {line.bytes} bytes desde {line.ip}: icmp_seq={line.seq} ttl={line.ttl} tiempo={line.time} ms
          </p>
        ))}
      </div>

      {status === 'finished' && (
        <div className="pt-1.5 border-t border-current border-opacity-10 mt-1.5 space-y-1">
          <p className="text-white font-bold">--- {hostName} estadísticas de ping ---</p>
          <p className="text-zinc-300">
            {totalSent} paquetes transmitidos, {totalReceived} recibidos, {packetLoss}% pérdida de paquetes, tiempo {totalSent * 700}ms
          </p>
          <p className="text-zinc-300">
            rtt min/avg/max/mdev = {minTime.toFixed(3)}/{avgTime.toFixed(3)}/{maxTime.toFixed(3)}/{mdev.toFixed(3)} ms
          </p>
        </div>
      )}
    </div>
  );
}
