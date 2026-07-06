'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { themeHexMap } from './themes';

export const HACKING_STEPS_POOL = [
  // Phase 1: Supabase & Gateway Disruption (Breaking connections, firewalls)
  { phase: 1, text: "[CONN] Solicitando enlace raw socket con db.nexus-portfolio.supabase.co..." },
  { phase: 1, text: "[CONN] Forzando desborde SYN (SYN Flood) en puerto seguro 5432..." },
  { phase: 1, text: "[SCAN] Escaneo de puertos iniciado. Puertos abiertos detectados: 5432 (PostgreSQL), 443 (HTTPS), 22 (SSH)." },
  { phase: 1, text: "[WARN] Desconectando nodos secundarios de redundancia de Supabase..." },
  { phase: 1, text: "[INFO] Handshake TLS completado de forma anónima... Usando TLS_AES_256_GCM_SHA384." },
  { phase: 1, text: "[INFO] Analizando cabeceras REST API Proxy de Supabase v3.4.1..." },
  { phase: 1, text: "[BYPASS] Iniciando evasión dinámica de políticas de seguridad a nivel de filas (RLS Bypass)..." },
  { phase: 1, text: "[BYPASS] Inyectando secuencia de escape SQL recursiva en consulta relacional de invitados..." },
  { phase: 1, text: "[OK] Vulnerabilidad CVE-2024-3094 inyectada exitosamente en el analizador sintáctico (parser) de consultas." },
  { phase: 1, text: "[SUCCESS] ¡CONEXIÓN CON FIREWALL SUPABASE SEVERADA! Bypass completado." },
  { phase: 1, text: "[FIREWALL] Deshabilitando limitador de peticiones (API Rate Limiter) - Tráfico ilimitado concedido." },
  { phase: 1, text: "[COMPLETADO] Estructuras estáticas y esquemas expuestos. ¡Fase 1 Consolidada!" },

  // Phase 2: Kernel Privilege Escalation (Infecting the system, memory offsets)
  { phase: 2, text: "[INIT] Solicitando escalado de privilegios UID en el sistema Nexus_OS..." },
  { phase: 2, text: "[MEM] Analizando mapa de memoria del sistema anfitrión... Arquitectura x86_64 detectada." },
  { phase: 2, text: "[MEM] Direcciones de kernel reservadas localizadas: 0x7FFF1A00 - 0x7FFF1A2F." },
  { phase: 2, text: "[MEM] Escribiendo payload_exploit.bin directamente en el búfer de llamadas de la pila (Stack Buffer)..." },
  { phase: 2, text: "[MEM] Sobrescribiendo registro de dirección de retorno (RIP Offset) con desplazamiento de 128 bytes." },
  { phase: 2, text: "[OK] Registro de instrucción EIP/RIP re-apuntado exitosamente a nuestro vector de ataque." },
  { phase: 2, text: "[INFECT] Inyectando shellcode malicioso en la tabla de vectores de interrupciones del kernel de Linux..." },
  { phase: 2, text: "[INFECT] Corrompiendo tabla de llamadas del sistema (sys_call_table) para ocultar procesos PID..." },
  { phase: 2, text: "[INFECT] Mutando los permisos del sistema de archivos virtual /proc para acceso ilimitado de lectura/escritura..." },
  { phase: 2, text: "[PRIV] Elevando UID del proceso actual (PID 4892) de 1001 (invitado) a 0 (administrador root de Nexus_OS)..." },
  { phase: 2, text: "[SUCCESS] ¡SISTEMA OPERATIVO INFECTADO! Consola root consolidada exitosamente." },
  { phase: 2, text: "[COMPLETADO] Kernel comprometido bajo root@nexus-os. ¡Fase 2 Consolidada!" },

  // Phase 3: Graphical Frame Buffer Hijack (Altering display, matrix theme)
  { phase: 3, text: "[INIT] Localizando descriptor de archivo del Frame Buffer del dispositivo gráfico (/dev/fb0)..." },
  { phase: 3, text: "[GRAPHIC] Vinculando controlador del Frame Buffer Object (FBO): Handler activo en 0x9F00AA22." },
  { phase: 3, text: "[GRAPHIC] Sincronizando la velocidad de barrido del hardware del tema activo de Nexus_OS..." },
  { phase: 3, text: "[GRAPHIC] Modificando contexto de renderizado RGB 2D para inyectar matriz binaria..." },
  { phase: 3, text: "[WARN] Interrumpiendo sincronización vertical por defecto del cliente (V-Sync Override)..." },
  { phase: 3, text: "[OVERRIDE] Inyectando secuencia de caracteres binarios directamente en el refresco vertical de pantalla." },
  { phase: 3, text: "[OVERRIDE] Secuestrando llamadas de la GPU para forzar tema de emergencia compromised de la terminal." },
  { phase: 3, text: "[SUCCESS] ¡OVERRIDE VISUAL DEL FRAME BUFFER EXITOSO! Desplegando lluvia digital Matrix a 60 FPS estables." },
  { phase: 3, text: "[COMPLETADO] La interfaz de Nexus_OS está completamente secuestrada y controlada por nuestro protocolo." }
];

export function HexDump({ activeStep }: { activeStep: number }) {
  const [hexLines, setHexLines] = useState<string[]>([]);
  
  useEffect(() => {
    if (activeStep >= 4) return;
    const interval = setInterval(() => {
      const lines = [];
      for (let i = 0; i < 6; i++) {
        const addr = (0x7FFF1A00 + i * 8).toString(16).toUpperCase();
        const bytes = Array.from({ length: 8 }, () => 
          Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
        ).join(' ');
        lines.push(`0x${addr}: ${bytes}`);
      }
      setHexLines(lines);
    }, 120);
    return () => clearInterval(interval);
  }, [activeStep]);

  if (activeStep >= 4) {
    return (
      <div className="text-[10px] text-red-500 font-mono space-y-1 font-bold animate-pulse p-2 bg-red-950/20 border border-red-500/30 rounded">
        <div>0x7FFF1A00: NÚCLEO TOTALMENTE DESBORDADO</div>
        <div>0x7FFF1A08: EXPLOIT_SECURE_PAYLOAD [CERRADO]</div>
        <div>0x7FFF1A10: NIVEL_PRIVILEGIO: ADMINISTRADOR ROOT</div>
        <div>0x7FFF1A18: EXTRACCIÓN_DATOS: 100% EXCELENTE</div>
        <div>0x7FFF1A20: CONTROL TOTAL DEL FRAME BUFFER SECUESTRADO</div>
        <div className="text-emerald-400 mt-1">[ESTADO: SISTEMA COMPROMETIDO CON ÉXITO]</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-[10px] text-red-400/60 space-y-0.5 p-2 bg-black/40 border border-red-500/10 rounded">
      {hexLines.map((line, idx) => (
        <div key={idx} className="truncate select-none font-mono">{line}</div>
      ))}
    </div>
  );
}

interface HackProgressProps {
  onRestore?: () => void;
}

export function HackProgress({ onRestore }: HackProgressProps) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [hack1Progress, setHack1Progress] = useState(0);
  const [hack2Progress, setHack2Progress] = useState(0);
  const [hack3Progress, setHack3Progress] = useState(0);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Simulation speed control
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(current => {
        if (current === 1) {
          setHack1Progress(p => {
            if (p >= 100) {
              setTimeout(() => {
                setActiveStep(2);
              }, 400);
              return 100;
            }
            return Math.min(100, p + Math.floor(Math.random() * 12) + 8);
          });
          return 1;
        } else if (current === 2) {
          setHack2Progress(p => {
            if (p >= 100) {
              setTimeout(() => {
                setActiveStep(3);
              }, 400);
              return 100;
            }
            return Math.min(100, p + Math.floor(Math.random() * 12) + 8);
          });
          return 2;
        } else if (current === 3) {
          setHack3Progress(p => {
            if (p >= 100) {
              setTimeout(() => {
                setActiveStep(4);
              }, 600);
              return 100;
            }
            return Math.min(100, p + Math.floor(Math.random() * 12) + 8);
          });
          return 3;
        }
        return current;
      });
    }, 220);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hack1Progress, hack2Progress, hack3Progress]);

  // Reactive parsing of logs based on percentage of each phase
  const phase1Logs = HACKING_STEPS_POOL.filter(s => s.phase === 1);
  const phase2Logs = HACKING_STEPS_POOL.filter(s => s.phase === 2);
  const phase3Logs = HACKING_STEPS_POOL.filter(s => s.phase === 3);

  const currentPhase1 = phase1Logs.slice(0, Math.min(phase1Logs.length, Math.ceil((hack1Progress / 100) * phase1Logs.length))).map(s => s.text);
  const currentPhase2 = phase2Logs.slice(0, Math.min(phase2Logs.length, Math.ceil((hack2Progress / 100) * phase2Logs.length))).map(s => s.text);
  const currentPhase3 = phase3Logs.slice(0, Math.min(phase3Logs.length, Math.ceil((hack3Progress / 100) * phase3Logs.length))).map(s => s.text);

  const logsToRender = [...currentPhase1, ...currentPhase2, ...currentPhase3];

  const totalSegments = 30;

  return (
    <div className="relative p-4 sm:p-5 bg-black/85 border border-red-500/40 rounded-xl space-y-4 font-mono text-xs text-red-400 select-none w-full shadow-2xl shadow-red-950/20 my-2">
      {/* Red ambient overlay for dramatic effect */}
      <div className="absolute inset-0 bg-red-950/[0.01] rounded-xl pointer-events-none" />
      
      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-extrabold uppercase tracking-[0.1em] text-red-500 font-mono">NEXUS_OS COGNITIVE_HACKING_SUITE v3.0</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-red-500/70 font-mono">
          <span className="hidden sm:inline">CONEXIÓN: DIRECT_BYPASS_MODE</span>
          <span className="bg-red-950/50 border border-red-500/20 px-1.5 py-0.5 rounded text-red-500 font-bold">
            PID 4892
          </span>
        </div>
      </div>

      {/* Global Status Banner */}
      <div className="bg-red-950/10 border border-red-500/10 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 font-mono">
        <div className="space-y-0.5">
          <div className="text-[9px] text-red-500/50 uppercase font-bold">OBJETIVO CENTRAL SELECCIONADO</div>
          <div className="text-white font-extrabold text-xs">NEXUS_MAIN_SERVER_CLUSTER // PROT: SECURE_LINK</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left sm:text-right">
            <div className="text-[9px] text-red-500/50 uppercase font-bold">ESTADO GLOBAL DE LA INFILTRACIÓN</div>
            <div className="text-red-400 text-xs font-bold uppercase animate-pulse">
              {activeStep === 1 && "Fase 1/3: Vulnerando Base de Datos..."}
              {activeStep === 2 && "Fase 2/3: Desbordando Memoria del Kernel..."}
              {activeStep === 3 && "Fase 3/3: Overrides de Frame Buffer..."}
              {activeStep === 4 && "¡VULNERABILIDAD CONSOLIDADA!"}
            </div>
          </div>
        </div>
      </div>

      {/* Unified Hacking Steps list (stacked vertically, no separate cards) */}
      <div className="bg-zinc-950/45 border border-red-500/15 rounded-lg p-4 space-y-4">
        <div className="text-[10px] text-red-500/60 font-bold uppercase tracking-wider pb-1.5 border-b border-red-500/10 flex items-center space-x-1.5">
          <span>⚙️</span>
          <span>FLUJO SECUENCIAL DE INTRUSIÓN MULTI-NÚCLEO</span>
        </div>
        
        {/* Step 1 */}
        <div className={`space-y-1.5 transition-all duration-300 ${activeStep === 1 ? 'opacity-100' : activeStep > 1 ? 'opacity-80' : 'opacity-35'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${activeStep === 1 ? 'bg-red-500 animate-ping' : hack1Progress === 100 ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-white">
                [FASE 01] SUPABASE FIREWALL & GATEWAY DISRUPTION
              </span>
            </div>
            <div className="text-[9px] font-bold tracking-widest font-mono">
              {activeStep === 1 ? (
                <span className="text-red-400 animate-pulse">VULNERANDO... {hack1Progress}%</span>
              ) : hack1Progress === 100 ? (
                <span className="text-emerald-400">DESACTIVADO [OK]</span>
              ) : (
                <span className="text-zinc-500">EN ESPERA</span>
              )}
            </div>
          </div>
          <p className="text-[9px] text-gray-400 font-mono">
            Evasión de políticas RLS, desactivación de limitador de frecuencia (Rate Limiting) e interrupción de la base de datos Supabase.
          </p>
          {/* Segmented Progress Bar */}
          <div className="flex space-x-0.5 h-1.5 w-full bg-zinc-950/80 p-0.5 rounded border border-zinc-900">
            {Array.from({ length: totalSegments }).map((_, idx) => {
              const filled = idx < Math.round((hack1Progress / 100) * totalSegments);
              return (
                <div
                  key={idx}
                  className={`h-full flex-1 transition-all duration-150 rounded-sm ${
                    filled
                      ? hack1Progress === 100
                        ? 'bg-emerald-500'
                        : 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]'
                      : 'bg-zinc-900'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="h-[1px] bg-red-500/10" />

        {/* Step 2 */}
        <div className={`space-y-1.5 transition-all duration-300 ${activeStep === 2 ? 'opacity-100' : activeStep > 2 ? 'opacity-80' : 'opacity-35'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${activeStep === 2 ? 'bg-red-500 animate-ping' : hack2Progress === 100 ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-white">
                [FASE 02] KERNEL EXPLOIT & PRIVILEGE ESCALATION
              </span>
            </div>
            <div className="text-[9px] font-bold tracking-widest font-mono">
              {activeStep === 2 ? (
                <span className="text-red-400 animate-pulse">ESCALANDO... {hack2Progress}%</span>
              ) : hack2Progress === 100 ? (
                <span className="text-emerald-400">NÚCLEO COMPROMETIDO [OK]</span>
              ) : (
                <span className="text-zinc-500">EN ESPERA</span>
              )}
            </div>
          </div>
          <p className="text-[9px] text-gray-400 font-mono">
            Desbordamiento de pila de llamadas (Buffer Overflow), alteración del registro RIP de retorno y escalado de privilegios de usuario a root.
          </p>
          <div className="flex space-x-0.5 h-1.5 w-full bg-zinc-950/80 p-0.5 rounded border border-zinc-900">
            {Array.from({ length: totalSegments }).map((_, idx) => {
              const filled = idx < Math.round((hack2Progress / 100) * totalSegments);
              return (
                <div
                  key={idx}
                  className={`h-full flex-1 transition-all duration-150 rounded-sm ${
                    filled
                      ? hack2Progress === 100
                        ? 'bg-emerald-500'
                        : 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]'
                      : 'bg-zinc-900'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="h-[1px] bg-red-500/10" />

        {/* Step 3 */}
        <div className={`space-y-1.5 transition-all duration-300 ${activeStep === 3 ? 'opacity-100' : activeStep > 3 ? 'opacity-80' : 'opacity-35'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${activeStep === 3 ? 'bg-red-500 animate-ping' : hack3Progress === 100 ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-white">
                [FASE 03] FRAME BUFFER MATRIX OVERRIDE
              </span>
            </div>
            <div className="text-[9px] font-bold tracking-widest font-mono">
              {activeStep === 3 ? (
                <span className="text-red-400 animate-pulse">SECUESTRANDO... {hack3Progress}%</span>
              ) : hack3Progress === 100 ? (
                <span className="text-emerald-400">CONTROL DE PANTALLA ADQUIRIDO [OK]</span>
              ) : (
                <span className="text-zinc-500">EN ESPERA</span>
              )}
            </div>
          </div>
          <p className="text-[9px] text-gray-400 font-mono">
            Secuestro del Frame Buffer de video del cliente, inyección de caracteres binarios y forzado del modo lluvia digital del sistema.
          </p>
          <div className="flex space-x-0.5 h-1.5 w-full bg-zinc-950/80 p-0.5 rounded border border-zinc-900">
            {Array.from({ length: totalSegments }).map((_, idx) => {
              const filled = idx < Math.round((hack3Progress / 100) * totalSegments);
              return (
                <div
                  key={idx}
                  className={`h-full flex-1 transition-all duration-150 rounded-sm ${
                    filled
                      ? hack3Progress === 100
                        ? 'bg-emerald-500'
                        : 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]'
                      : 'bg-zinc-900'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Unified Terminal Outputs / Logs Panel */}
      <div className="border border-red-500/30 bg-black rounded-lg p-4 space-y-3 shadow-[inset_0_0_15px_rgba(239,68,68,0.15)] relative">
        <div className="absolute top-2 right-4 flex items-center space-x-1.5 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] text-red-500/60 font-mono tracking-widest">STREAM_LIVE</span>
        </div>

        <div className="flex items-center space-x-2 border-b border-zinc-800 pb-1.5">
          <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-wider">
            &gt;_ CONSOLA GENERAL DE INTRUSIÓN Y COMPROMISO DE SISTEMA
          </span>
        </div>

        {/* The Continuous Log Stream */}
        <div className="space-y-1 font-mono text-[10px] select-text">
          {logsToRender.map((log, idx) => {
            let logColor = "text-zinc-400";
            if (log.startsWith("[CONN]") || log.startsWith("[SCAN]")) {
              logColor = "text-cyan-400";
            } else if (log.startsWith("[BYPASS]") || log.startsWith("[INIT]")) {
              logColor = "text-yellow-500";
            } else if (log.startsWith("[MEM]") || log.startsWith("[INFECT]")) {
              logColor = "text-red-400 font-semibold";
            } else if (log.startsWith("[PRIV]")) {
              logColor = "text-orange-400 font-bold underline animate-pulse";
            } else if (log.includes("[OK]") || log.includes("[SUCCESS]") || log.includes("[COMPLETADO]")) {
              logColor = "text-emerald-400 font-bold";
            } else if (log.includes("Firewall") || log.includes("Kernel") || log.includes("Fase")) {
              logColor = "text-white font-medium";
            }

            return (
              <div key={idx} className={`${logColor} leading-relaxed transition-all duration-150 flex items-start space-x-1.5`}>
                <span className="text-red-500/40 select-none">❯</span>
                <span className="break-all">{log}</span>
              </div>
            );
          })}
          
          {/* Running/active blinking indicator if still working */}
          {activeStep < 4 && (
            <div className="flex items-center space-x-1 text-red-500 font-bold animate-pulse">
              <span className="text-red-500/40 select-none">❯</span>
              <span>EJECUTANDO PROCESO DE INFECCIÓN ACTIVO...</span>
              <span className="w-1.5 h-3 bg-red-500 inline-block animate-blink ml-1" />
            </div>
          )}

          <div ref={consoleEndRef} />
        </div>
      </div>

      {/* Real-time Memory Decryption Panel */}
      <div className="border border-zinc-800 bg-zinc-950/20 p-3 rounded-lg space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
          <span className="text-[9px] text-red-500/60 font-bold uppercase tracking-wider">
            📶 MONITOR RECURSIVO DE MEMORIA HEXADECIMAL
          </span>
          <span className="text-[9px] text-zinc-500 font-mono">
            RANGO_MAPPED: 0x7FFF1A00 - 0x7FFF1A2F
          </span>
        </div>
        <HexDump activeStep={activeStep} />
      </div>

      {/* Final Compromised Success Overlay */}
      {activeStep === 4 && (
        <div className="pt-2">
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: [0, -1, 1, -1, 1, 0]
            }}
            transition={{ 
              x: { repeat: Infinity, duration: 0.5, repeatType: "mirror" },
              opacity: { duration: 0.3 }
            }}
            className="bg-red-950/35 border-2 border-red-500 p-4 rounded-lg text-center space-y-4 relative overflow-hidden shadow-2xl shadow-red-500/25"
          >
            {/* Absolute pulsing background lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.05)_50%,rgba(0,0,0,0)_50%)] bg-[length:100%_4px] pointer-events-none" />
            
            <pre className="text-red-500 font-extrabold text-[7px] sm:text-[9px] md:text-[10px] leading-[1.2] whitespace-pre select-none overflow-x-auto no-scrollbar font-mono drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]">
{` ██████  ██████  ███    ███ ██████  ██████   ██████  ███    ███ ██ ███████ ███████ ██████  
██      ██    ██ ████  ████ ██   ██ ██   ██ ██    ██ ████  ████ ██ ██      ██      ██   ██ 
██      ██    ██ ██ ████ ██ ██████  ██████  ██    ██ ██ ████ ██ ██ ███████ █████   ██   ██ 
██      ██    ██ ██  ██  ██ ██      ██   ██ ██    ██ ██  ██  ██ ██      ██ ██      ██   ██ 
 ██████  ██████  ██      ██ ██      ██   ██  ██████  ██      ██ ██ ███████ ███████ ██████  `}
            </pre>

            <div className="space-y-1 relative z-10">
              <div className="text-red-500 font-extrabold text-sm tracking-[0.18em] animate-pulse drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] uppercase">
                [ ACCESS GRANTED // SYSTEM COMPROMISED ]
              </div>
              <p className="text-[11px] text-red-300 font-mono leading-relaxed max-w-md mx-auto">
                Felicidades, has desbloqueado con éxito el protocolo secreto de Nexus_OS. Todos los privilegios de root de esta terminal de invitado se han consolidado.
              </p>
            </div>

            {onRestore && (
              <button 
                onClick={onRestore}
                className="relative z-20 px-4 py-1.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-mono font-bold text-[11px] rounded uppercase tracking-wider border border-red-400 hover:shadow-[0_0_15px_rgba(220,38,38,0.8)] transition-all cursor-pointer"
              >
                ⚙️ Restaurar Núcleo de Nexus_OS
              </button>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
