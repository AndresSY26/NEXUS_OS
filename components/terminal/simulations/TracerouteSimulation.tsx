'use client';

import React, { useState, useEffect } from 'react';

interface TracerouteHop {
  hop: number;
  ip: string;
  name: string;
  times: number[];
}

interface TracerouteSimulationProps {
  target: string;
}

export function TracerouteSimulation({ target }: TracerouteSimulationProps) {
  const [hops, setHops] = useState<TracerouteHop[]>([]);
  const [status, setStatus] = useState<'tracing' | 'finished'>('tracing');

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
    const definedHops = [
      { ip: '192.168.1.1', name: 'gateway.local' },
      { ip: '10.0.0.1', name: 'isp-gateway.net' },
      { ip: '172.16.24.12', name: 'regional-hub.telco.com' },
      { ip: '84.22.191.5', name: 'edge-carrier.net' },
      { ip: '209.85.253.141', name: 'peer-exchange.net' },
      { ip: resolvedIp, name: hostName }
    ];

    let currentHopIdx = 0;
    const intervalTime = 600;

    const interval = setInterval(() => {
      if (currentHopIdx < definedHops.length) {
        const h = definedHops[currentHopIdx];
        const baseLatency = (currentHopIdx + 1) * 4 + Math.random() * 2;
        const time1 = parseFloat((baseLatency - 0.5 + Math.random()).toFixed(3));
        const time2 = parseFloat((baseLatency - 0.2 + Math.random()).toFixed(3));
        const time3 = parseFloat((baseLatency + Math.random()).toFixed(3));

        setHops(prev => [
          ...prev,
          {
            hop: currentHopIdx + 1,
            ip: h.ip,
            name: h.name,
            times: [time1, time2, time3]
          }
        ]);
        currentHopIdx++;
      } else {
        clearInterval(interval);
        setStatus('finished');
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [resolvedIp, hostName]);

  return (
    <div className="font-mono text-xs space-y-1 select-text">
      <p className="text-zinc-400">
        traceroute para {hostName} ({resolvedIp}), 30 saltos máx, paquetes de 60 bytes
      </p>
      
      <div className="space-y-0.5">
        {hops.map((hop) => (
          <p key={hop.hop} className="text-current opacity-90">
            {hop.hop.toString().padStart(2, ' ')}&nbsp;&nbsp;
            <span className="text-white font-semibold">{hop.name}</span> ({hop.ip})&nbsp;&nbsp;
            <span className="text-emerald-400 font-bold">{hop.times[0]} ms</span>&nbsp;&nbsp;
            <span className="text-cyan-400 font-bold">{hop.times[1]} ms</span>&nbsp;&nbsp;
            <span className="text-yellow-500 font-bold">{hop.times[2]} ms</span>
          </p>
        ))}
      </div>

      {status === 'finished' && (
        <div className="pt-1 border-t border-current border-opacity-10 mt-1">
          <p className="text-green-400 font-bold font-mono">
            ✔ Traza completa. Destino alcanzado con éxito.
          </p>
        </div>
      )}
    </div>
  );
}
