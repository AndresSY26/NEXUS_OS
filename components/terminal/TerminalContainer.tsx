'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Check, 
  AlertCircle, 
  Keyboard, 
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Cpu,
  RefreshCw,
  Info,
  Terminal as TerminalIcon 
} from 'lucide-react';
import { themesMap, themeHexMap, themeMapping } from './themes';
import { MatrixRain } from './MatrixRain';
import { asciiBanners } from './AsciiBanner';
import { HackProgress } from './HackProgress';
import { moduleSessionPID, moduleSessionIP, getElapsedTimeString } from './session';

// Simulations
import { ProjectListSearch, Project } from './simulations/ProjectListSearch';
import { PingSimulation } from './simulations/PingSimulation';
import { TracerouteSimulation } from './simulations/TracerouteSimulation';
import { SysInfoSimulation } from './simulations/SysInfoSimulation';
import { CalendarSimulation } from './simulations/CalendarSimulation';
import { WhoamiSimulation } from './simulations/WhoamiSimulation';

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
  timestamp: string;
  path?: string;
}

const ALL_COMMANDS = [
  'about', 'cal', 'cat', 'cd', 'clear', 'contact', 'date', 'hack', 'help', 
  'history', 'ls', 'matrix', 'ping', 'projects', 'socials', 'sysinfo', 
  'theme', 'traceroute', 'uname', 'whoami'
];

export default function TerminalContainer() {
  const [theme, setTheme] = useState<string>('green');
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState<number>(0);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [executedCommands, setExecutedCommands] = useState<string[]>([]);
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [terminalBooted, setTerminalBooted] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showMobileKeyboardHint, setShowMobileKeyboardHint] = useState(false);
  const [isFetchingProjects, setIsFetchingProjects] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('~');
  const [tabCycle, setTabCycle] = useState<{
    originalPrefix: string;
    matches: string[];
    index: number;
  } | null>(null);

  // Cargar el tema guardado en localStorage al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = window.localStorage.getItem('nexus_portfolio_theme');
        if (savedTheme && themesMap[savedTheme]) {
          requestAnimationFrame(() => {
            setTheme(savedTheme);
          });
        }
      } catch (err) {
        console.error('Error loading theme from localStorage:', err);
      }
    }
  }, []);

  // Guardar el tema en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('nexus_portfolio_theme', theme);
      } catch (err) {
        console.error('Error saving theme to localStorage:', err);
      }
    }
  }, [theme]);

  // Reproducir sonido retro de inicio de sistema al arrancar la terminal
  useEffect(() => {
    if (terminalBooted) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const now = ctx.currentTime;
          
          // Tono 1: Acorde ascendente retro y cálido (onda triangular)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc1.type = 'triangle';
          osc2.type = 'sine';
          
          // Notas C4 -> C5
          osc1.frequency.setValueAtTime(261.63, now);
          osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.3);
          
          // Notas E4 -> G5
          osc2.frequency.setValueAtTime(329.63, now);
          osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.3);
          
          // Ganancia / Envolvente para evitar chasquidos
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
          gainNode.gain.setValueAtTime(0.12, now + 0.25);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          
          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.6);
          osc2.stop(now + 0.6);
          
          // Tono 2: Confirmación digital (un pitido agudo y corto a los 0.3s)
          const beepOsc = ctx.createOscillator();
          const beepGain = ctx.createGain();
          
          beepOsc.type = 'sine';
          beepOsc.frequency.setValueAtTime(1046.50, now + 0.3); // C6 (agudo y limpio)
          
          beepGain.gain.setValueAtTime(0, now);
          beepGain.gain.setValueAtTime(0, now + 0.3);
          beepGain.gain.linearRampToValueAtTime(0.08, now + 0.33);
          beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          
          beepOsc.connect(beepGain);
          beepGain.connect(ctx.destination);
          
          beepOsc.start(now);
          beepOsc.stop(now + 0.7);
        }
      } catch (e) {
        console.warn('Audio Context block/error:', e);
      }
    }
  }, [terminalBooted]);

  // Referencias para auto-scroll y enfoque
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Inicialización de la Terminal (Boot sequence)
  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success) {
          setIsDbConnected(!data.isFallback);
          setBootLines(prev => [
            ...prev,
            data.isFallback 
              ? 'DATABASE CONNECTION: OFFLINE (Running in local emulation mode)' 
              : 'DATABASE CONNECTION: SECURE LINK ESTABLISHED',
            'NEXUS SYSTEM ENGINE: INITIALIZED SUCCESSFULLY',
            '--------------------------------------------------',
          ]);
        } else {
          setIsDbConnected(false);
          setBootLines(prev => [
            ...prev,
            'DATABASE CONNECTION: ERROR (Timeout / Access Denied)',
            'SYSTEM STATUS: DEGRADED PERFORMANCE',
            '--------------------------------------------------',
          ]);
        }
      } catch {
        setIsDbConnected(false);
        setBootLines(prev => [
          ...prev,
          'DATABASE CONNECTION: FAILED',
          'SYSTEM STATUS: DEGRADED PERFORMANCE',
          '--------------------------------------------------',
        ]);
      } finally {
        setTimeout(() => {
          setTerminalBooted(true);
          // Enfoque automático al iniciar
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 500);
      }
    };

    const bootSequence = [
      'BOOTING NEXUS_OS...',
      'LOADING CORE KERNEL PROTOCOLS... OK',
      'INITIALIZING CRT DISPLAY EMULATOR... OK',
      'CONNECTING TO SUPABASE DATABASE GATEWAY...',
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        // Verificar conexión de base de datos
        checkDatabaseConnection();
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Mantener el input enfocado al hacer clic en cualquier parte de la terminal
  const focusTerminal = (e?: React.MouseEvent) => {
    if (e) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input')
      ) {
        return;
      }
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-scroll al fondo
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commandHistory, bootLines, terminalBooted]);

  // Manejar cambio de teclado para móviles
  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 500) {
        setShowMobileKeyboardHint(true);
      } else {
        setShowMobileKeyboardHint(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Textos y Contenidos estáticos del portafolio
  const aboutText = (
    <div className="space-y-2 leading-relaxed">
      <p>
        <span className="text-white font-semibold">AndresSY</span> — Desarrollador Full-stack Senior apasionado por la ingeniería de software interactiva y robusta. Con más de 6 años de experiencia diseñando arquitecturas web escalables, APIs seguras y experiencias frontend fluidas.
      </p>
      <p>
        Especializado en el ecosistema de <span className="text-white font-medium">Node.js, React, Next.js, TypeScript y Bases de Datos (Supabase/PostgreSQL/Firestore)</span>. Me considero un artesano digital enfocado en la optimización de rendimiento, la seguridad de datos y la atención meticulosa al diseño visual y de experiencia de usuario.
      </p>
      <p>
        Siempre buscando resolver problemas complejos con soluciones elegantes, limpias y altamente performantes.
      </p>
    </div>
  );

  const socialsContent = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
      <a 
        href="https://github.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center space-x-2 border border-current p-2 hover:bg-opacity-10 hover:bg-white transition-all cursor-pointer"
        id="link-github"
      >
        <Github size={16} />
        <span>GitHub</span>
        <ExternalLink size={12} className="opacity-65" />
      </a>
      <a 
        href="https://linkedin.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center space-x-2 border border-current p-2 hover:bg-opacity-10 hover:bg-white transition-all cursor-pointer"
        id="link-linkedin"
      >
        <Linkedin size={16} />
        <span>LinkedIn</span>
        <ExternalLink size={12} className="opacity-65" />
      </a>
      <a 
        href="https://twitter.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center space-x-2 border border-current p-2 hover:bg-opacity-10 hover:bg-white transition-all cursor-pointer"
        id="link-twitter"
      >
        <Twitter size={16} />
        <span>Twitter / X</span>
        <ExternalLink size={12} className="opacity-65" />
      </a>
    </div>
  );

  // Función para procesar comandos individuales
  const executeCommand = async (fullCmd: string) => {
    const trimmed = fullCmd.trim();
    if (!trimmed) return;

    setTabCycle(null);

    // Agregar al historial de entrada
    const newExecuted = [...executedCommands, trimmed];
    setExecutedCommands(newExecuted);
    setHistoryIndex(newExecuted.length);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 font-mono">
            <p className="text-white font-bold mb-1">Comandos Disponibles:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 pl-2 text-current opacity-90">
              <div><span className="text-white font-semibold">about</span> <span className="opacity-40">.......</span> Muestra mi trayectoria profesional</div>
              <div><span className="text-white font-semibold">projects</span> <span className="opacity-40">....</span> Consulta la base de datos de proyectos</div>
              <div><span className="text-white font-semibold">contact [msg]</span> <span className="opacity-40">.</span> Envía un mensaje directo a Supabase</div>
              <div><span className="text-white font-semibold">socials</span> <span className="opacity-40">.....</span> Muestra enlaces de redes sociales</div>
              <div><span className="text-white font-semibold">ls</span> <span className="opacity-40">..........</span> Lista los archivos y carpetas del directorio actual</div>
              <div><span className="text-white font-semibold">cd [dir]</span> <span className="opacity-40">......</span> Cambia de directorio virtual (ej: cd projects)</div>
              <div><span className="text-white font-semibold">cat [file]</span> <span className="opacity-40">..</span> Muestra el contenido de un archivo virtual</div>
              <div><span className="text-white font-semibold">theme [color]</span> <span className="opacity-40">.</span> Cambia de color (11 opciones, ej: purple, green...)</div>
              <div><span className="text-white font-semibold">date</span> <span className="opacity-40">.........</span> Muestra la fecha y hora actual</div>
              <div><span className="text-white font-semibold">whoami</span> <span className="opacity-40">.......</span> Muestra información de la sesión actual</div>
              <div><span className="text-white font-semibold">ping [host]</span> <span className="opacity-40">..</span> Prueba de latencia a una IP o host</div>
              <div><span className="text-white font-semibold">sysinfo</span> <span className="opacity-40">......</span> Información del sistema operativo y recursos</div>
              <div><span className="text-white font-semibold">uname</span> <span className="opacity-40">........</span> Muestra la versión del kernel del sistema</div>
              <div><span className="text-white font-semibold">traceroute [host]</span> <span className="opacity-40">.</span> Traza de saltos de red hacia un host</div>
              <div><span className="text-white font-semibold">cal [mes] [año]</span> <span className="opacity-40">.</span> Muestra el calendario con el mes actual resaltado</div>
              <div><span className="text-white font-semibold">history</span> <span className="opacity-40">......</span> Historial de comandos ejecutados</div>
              <div><span className="text-white font-semibold">matrix</span> <span className="opacity-40">.......</span> Lluvia digital Matrix en fondo</div>
              <div><span className="text-white font-semibold">clear</span> <span className="opacity-40 font-mono">.......</span> Limpia la pantalla de la terminal</div>
            </div>
          </div>
        );
        break;

      case 'about':
        output = aboutText;
        break;

      case 'whoami': {
        output = <WhoamiSimulation />;
        break;
      }

      case 'ping': {
        const targetHost = args.trim() || 'google.com';
        output = <PingSimulation target={targetHost} />;
        break;
      }

      case 'sysinfo': {
        output = <SysInfoSimulation theme={theme} />;
        break;
      }

      case 'uname': {
        output = (
          <div className="font-mono text-xs text-white py-0.5 select-text">
            Nexus_OS Kernel 5.15.0-generic
          </div>
        );
        break;
      }

      case 'traceroute': {
        const targetHost = args.trim() || 'google.com';
        output = <TracerouteSimulation target={targetHost} />;
        break;
      }

      case 'cal': {
        output = <CalendarSimulation args={args} theme={theme} />;
        break;
      }

      case 'ls': {
        if (currentPath === '~') {
          output = (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1">
              <span className="text-cyan-400 font-bold font-mono">📁 projects/</span>
              <span className="text-cyan-400 font-bold font-mono">📁 socials/</span>
              <span className="text-white font-bold font-mono">📄 about.txt</span>
              <span className="text-white font-bold font-mono">📄 contact.txt</span>
            </div>
          );
        } else if (currentPath === '~/projects') {
          output = (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1">
              <span className="text-cyan-400 font-bold font-mono">📁 ..</span>
              <span className="text-green-400 font-bold font-mono">🚀 projects.sh</span>
            </div>
          );
        } else if (currentPath === '~/socials') {
          output = (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1">
              <span className="text-cyan-400 font-bold font-mono">📁 ..</span>
              <span className="text-white font-bold font-mono">📄 socials.txt</span>
            </div>
          );
        }
        break;
      }

      case 'cd': {
        const target = args.trim();
        const lowerTarget = target.toLowerCase();

        if (!target || target === '~' || target === '/') {
          setCurrentPath('~');
          output = null;
        } else if (target === '..') {
          if (currentPath === '~') {
            output = null; // ya está en raíz
          } else {
            setCurrentPath('~');
            output = null;
          }
        } else if (target === '.') {
          output = null;
        } else if (
          lowerTarget === 'projects' || 
          lowerTarget === '/projects' || 
          lowerTarget === './projects' || 
          lowerTarget === '~/projects' ||
          lowerTarget === 'projects/' ||
          lowerTarget === './projects/'
        ) {
          setCurrentPath('~/projects');
          output = null;
        } else if (
          lowerTarget === 'socials' || 
          lowerTarget === '/socials' || 
          lowerTarget === './socials' || 
          lowerTarget === '~/socials' ||
          lowerTarget === 'socials/' ||
          lowerTarget === './socials/'
        ) {
          setCurrentPath('~/socials');
          output = null;
        } else if (
          lowerTarget === 'about.txt' || 
          lowerTarget === 'contact.txt' || 
          lowerTarget === 'projects.sh' || 
          lowerTarget === 'socials.txt' ||
          lowerTarget === './about.txt' ||
          lowerTarget === './contact.txt'
        ) {
          output = <span className="text-red-400">bash: cd: {target}: No es un directorio (es un archivo regular). Usa &apos;cat {target}&apos; para ver su contenido.</span>;
        } else {
          output = <span className="text-red-400">bash: cd: {target}: No existe el archivo o el directorio</span>;
        }
        break;
      }

      case 'cat': {
        if (!args) {
          output = <span className="text-red-400">Error: Especifica un archivo para leer. Ejemplo: cat about.txt</span>;
        } else {
          const rawArg = args.trim();
          const targetFile = rawArg.toLowerCase();

          if (currentPath === '~') {
            if (targetFile === 'about.txt' || targetFile === './about.txt') {
              output = aboutText;
            } else if (targetFile === 'contact.txt' || targetFile === './contact.txt') {
              output = (
                <div className="space-y-2">
                  <p className="font-bold text-white">Formato de Contacto:</p>
                  <p>Para enviar un mensaje de contacto, escribe:</p>
                  <p className="bg-black/40 p-2 font-mono text-white inline-block border border-current border-opacity-30 rounded">
                    contact [tu mensaje aquí]
                  </p>
                  <p className="text-xs opacity-80">Ejemplo: <span className="italic">contact Hola AndresSY, hablemos sobre una oportunidad laboral.</span></p>
                </div>
              );
            } else if (targetFile === 'projects/projects.sh' || targetFile === './projects/projects.sh') {
              output = (
                <div className="space-y-1">
                  <p className="text-yellow-400">Ejecutando script de proyectos de forma directa...</p>
                  <div className="border border-dashed border-current p-3 mt-2">
                    {await fetchProjectsMarkup()}
                  </div>
                </div>
              );
            } else if (targetFile === 'socials/socials.txt' || targetFile === './socials/socials.txt') {
              output = (
                <div className="space-y-2">
                  <p className="font-bold text-white">Canales oficiales de redes sociales:</p>
                  {socialsContent}
                </div>
              );
            } else if (targetFile === 'projects' || targetFile === 'socials' || targetFile === 'projects/' || targetFile === 'socials/') {
              output = <span className="text-red-400">cat: {rawArg}: No es un archivo (es un directorio). Usa &apos;cd {rawArg}&apos; para entrar en él.</span>;
            } else if (targetFile === 'projects.sh') {
              output = (
                <span className="text-red-400">
                  cat: projects.sh: No existe el archivo (está dentro del directorio &apos;projects/&apos;, ejecuta &apos;cd projects&apos; primero o escribe &apos;cat projects/projects.sh&apos;)
                </span>
              );
            } else if (targetFile === 'socials.txt') {
              output = (
                <span className="text-red-400">
                  cat: socials.txt: No existe el archivo (está dentro del directorio &apos;socials/&apos;, ejecuta &apos;cd socials&apos; primero o escribe &apos;cat socials/socials.txt&apos;)
                </span>
              );
            } else {
              output = <span className="text-red-400">cat: {rawArg}: No existe el archivo o el directorio. Ejecuta &apos;ls&apos; para ver el contenido de este directorio.</span>;
            }
          } else if (currentPath === '~/projects') {
            if (targetFile === 'projects.sh' || targetFile === './projects.sh') {
              output = (
                <div className="space-y-1">
                  <p className="text-yellow-400">Ejecutando script de proyectos de forma directa...</p>
                  <div className="border border-dashed border-current p-3 mt-2">
                    {await fetchProjectsMarkup()}
                  </div>
                </div>
              );
            } else if (targetFile === '../about.txt') {
              output = aboutText;
            } else if (targetFile === '../contact.txt') {
              output = (
                <div className="space-y-2">
                  <p className="font-bold text-white">Formato de Contacto:</p>
                  <p>Para enviar un mensaje de contacto, escribe:</p>
                  <p className="bg-black/40 p-2 font-mono text-white inline-block border border-current border-opacity-30 rounded">
                    contact [tu mensaje aquí]
                  </p>
                  <p className="text-xs opacity-80">Ejemplo: <span className="italic">contact Hola AndresSY, hablemos sobre una oportunidad laboral.</span></p>
                </div>
              );
            } else if (targetFile === '..' || targetFile === '../') {
              output = <span className="text-red-400">cat: {rawArg}: No es un archivo (es el directorio padre).</span>;
            } else {
              output = <span className="text-red-400">cat: {rawArg}: No existe el archivo o directorio en ~/projects.</span>;
            }
          } else if (currentPath === '~/socials') {
            if (targetFile === 'socials.txt' || targetFile === './socials.txt') {
              output = (
                <div className="space-y-2">
                  <p className="font-bold text-white">Canales oficiales de redes sociales:</p>
                  {socialsContent}
                </div>
              );
            } else if (targetFile === '../about.txt') {
              output = aboutText;
            } else if (targetFile === '../contact.txt') {
              output = (
                <div className="space-y-2">
                  <p className="font-bold text-white">Formato de Contacto:</p>
                  <p>Para enviar un mensaje de contacto, escribe:</p>
                  <p className="bg-black/40 p-2 font-mono text-white inline-block border border-current border-opacity-30 rounded">
                    contact [tu mensaje aquí]
                  </p>
                  <p className="text-xs opacity-80">Ejemplo: <span className="italic">contact Hola AndresSY, hablemos sobre una oportunidad laboral.</span></p>
                </div>
              );
            } else if (targetFile === '..' || targetFile === '../') {
              output = <span className="text-red-400">cat: {rawArg}: No es un archivo (es el directorio padre).</span>;
            } else {
              output = <span className="text-red-400">cat: {rawArg}: No existe el archivo o directorio en ~/socials.</span>;
            }
          }
        }
        break;
      }

      case 'projects':
        output = await fetchProjectsMarkup();
        break;

      case 'contact': {
        if (!args || args.trim() === '') {
          output = (
            <div className="space-y-1 text-red-400">
              <p>Error: Debes escribir un mensaje.</p>
              <p className="text-xs opacity-80 text-white">Uso correcto: contact [mensaje]</p>
              <p className="text-xs opacity-80 text-white">Ejemplo: contact Hola AndresSY, me encantó tu terminal</p>
            </div>
          );
        } else {
          output = await saveContactMessage(args);
        }
        break;
      }

      case 'socials':
        output = socialsContent;
        break;

      case 'theme': {
        const themeChoice = args.toLowerCase().trim();
        if (!themeChoice) {
          output = (
            <div className="space-y-2 font-mono">
              <p className="text-white font-bold">Paleta de colores del Sistema Nexus_OS (11 Colores Disponibles):</p>
              <p className="text-xs opacity-70">Uso: <span className="font-mono text-white">theme [nombre_color]</span> (ej. <span className="text-[#D026FF]">theme purple</span>)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 pl-2 text-xs pt-1">
                <div>• <span className="text-[#00FF41] font-bold">green</span> / <span className="text-[#00FF41]">verde</span> (g)</div>
                <div>• <span className="text-[#FFB13B] font-bold">amber</span> / <span className="text-[#FFB13B]">ambar</span> (a)</div>
                <div>• <span className="text-[#D026FF] font-bold">purple</span> / <span className="text-[#D026FF]">purpura</span> (p)</div>
                <div>• <span className="text-[#00E5FF] font-bold">cyan</span> / <span className="text-[#00E5FF]">cian</span> (c)</div>
                <div>• <span className="text-[#FF3F3F] font-bold">red</span> / <span className="text-[#FF3F3F]">rojo</span> (r)</div>
                <div>• <span className="text-[#FF2E93] font-bold">pink</span> / <span className="text-[#FF2E93]">rosa</span></div>
                <div>• <span className="text-[#E7FE00] font-bold">yellow</span> / <span className="text-[#E7FE00]">amarillo</span> (y)</div>
                <div>• <span className="text-[#FF6B00] font-bold">orange</span> / <span className="text-[#FF6B00]">naranja</span> (o)</div>
                <div>• <span className="text-[#F3F4F6] font-bold">white</span> / <span className="text-[#F3F4F6]">blanco</span> (w)</div>
                <div>• <span className="text-[#00F5D4] font-bold">emerald</span> / <span className="text-[#00F5D4]">esmeralda</span> (e)</div>
                <div>• <span className="text-[#BDB2FF] font-bold">lavender</span> / <span className="text-[#BDB2FF]">lavanda</span> (l)</div>
              </div>
            </div>
          );
        } else if (themeMapping[themeChoice]) {
          const selectedTheme = themeMapping[themeChoice];
          setTheme(selectedTheme);
          const tName = themesMap[selectedTheme].colorName;
          const tColor = themesMap[selectedTheme].text;
          output = (
            <span>
               Tema cambiado a <span className={`${tColor} font-bold`}>{tName}</span> exitosamente.
            </span>
          );
        } else {
          output = (
            <div className="space-y-2 font-mono">
              <p className="text-red-400">Color de tema no reconocido: &quot;{args}&quot;</p>
              <p className="text-xs opacity-75">Prueba con uno de los 11 temas escribiendo <span className="font-bold text-white font-mono">theme</span> solo para ver las opciones disponibles.</p>
            </div>
          );
        }
        break;
      }

      case 'date':
        output = <span>{new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'medium' })}</span>;
        break;

      case 'history':
        output = (
          <div className="space-y-1">
            <p className="text-white font-bold font-mono">Historial de comandos:</p>
            {newExecuted.map((cmdStr, idx) => (
              <div key={idx} className="font-mono text-xs pl-2">
                {(idx + 1).toString().padStart(3, ' ')}  {cmdStr}
              </div>
            ))}
          </div>
        );
        break;

      case 'matrix': {
        const nextState = !matrixActive;
        setMatrixActive(nextState);
        output = (
          <div className="space-y-1 font-mono">
            <p className="text-white font-bold">Efecto Matrix:</p>
            <p className="text-xs">
              La lluvia digital se ha {nextState ? <span className="text-emerald-400 font-bold">ACTIVADO</span> : <span className="text-red-500 font-bold">DESACTIVADO</span>} en segundo plano.
            </p>
            <p className="text-[10px] opacity-75">
              Los colores se adaptan en tiempo real según el tema del sistema (ej: <span className="font-semibold text-white">theme purple</span>).
            </p>
          </div>
        );
        break;
      }

      case 'hack': {
        setMatrixActive(true);
        output = (
          <HackProgress 
            onRestore={() => {
              setCommandHistory([]);
              setInputVal('');
            }} 
          />
        );
        break;
      }

      case 'clear':
        setCommandHistory([]);
        setInputVal('');
        setCurrentBannerIdx(prev => {
          let nextIdx = prev;
          while (nextIdx === prev) {
            nextIdx = Math.floor(Math.random() * asciiBanners.length);
          }
          return nextIdx;
        });
        return;

      default: {
        const lowerTrimmed = trimmed.toLowerCase();
        if (currentPath === '~/projects' && lowerTrimmed === './projects.sh') {
          output = (
            <div className="space-y-1">
              <p className="text-yellow-400">Ejecutando script de proyectos de forma directa...</p>
              <div className="border border-dashed border-current p-3 mt-2">
                {await fetchProjectsMarkup()}
              </div>
            </div>
          );
        } else if (currentPath === '~/projects' && lowerTrimmed === 'projects.sh') {
          output = (
            <div className="space-y-1 text-red-400">
              <p>bash: projects.sh: comando no encontrado</p>
              <p className="text-xs text-white opacity-70">¿Quisiste decir &apos;./projects.sh&apos;? (En sistemas Unix, los scripts locales en el directorio actual requieren el prefijo &apos;./&apos; para ejecutarse).</p>
            </div>
          );
        } else if (currentPath === '~' && (lowerTrimmed === './projects/projects.sh' || lowerTrimmed === 'projects/projects.sh')) {
          output = (
            <div className="space-y-1">
              <p className="text-yellow-400">Ejecutando script de proyectos de forma directa...</p>
              <div className="border border-dashed border-current p-3 mt-2">
                {await fetchProjectsMarkup()}
              </div>
            </div>
          );
        } else if (lowerTrimmed === './projects.sh') {
          output = <span className="text-red-400">bash: ./projects.sh: No existe el archivo o directorio (Pista: entra primero al directorio con &apos;cd projects&apos;)</span>;
        } else {
          output = (
            <div className="space-y-1">
              <p className="text-red-400">Comando no reconocido: &quot;{cmd}&quot;</p>
              <p className="text-xs opacity-80">Escribe <span className="font-bold text-white underline">help</span> para listar los comandos válidos de este sistema.</p>
            </div>
          );
        }
        break;
      }
    }

    // Guardar en el historial de comandos en pantalla
    setCommandHistory(prev => [
      ...prev,
      {
        command: fullCmd,
        output,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        path: currentPath
      }
    ]);

    setInputVal('');
  };

  // Función asíncrona para obtener proyectos y renderizar
  const fetchProjectsMarkup = async (): Promise<React.ReactNode> => {
    setIsFetchingProjects(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      
      const projectsList: Project[] = data.projects || [];
      const fallbackMode = !!data.isFallback;

      return (
        <ProjectListSearch 
          projectsList={projectsList} 
          fallbackMode={fallbackMode} 
          theme={theme} 
        />
      );
    } catch (err: any) {
      return (
        <div className="text-red-400 space-y-1">
          <p>Error al conectar con el endpoint de proyectos: {err.message || err}</p>
          <p className="text-xs text-white">Intenta ejecutar de nuevo el comando.</p>
        </div>
      );
    } finally {
      setIsFetchingProjects(false);
    }
  };

  // Guardar mensaje de contacto
  const saveContactMessage = async (msg: string): Promise<React.ReactNode> => {
    setIsSubmittingContact(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();

      return (
        <div className="space-y-2 border border-current border-opacity-30 p-3 bg-black/30 rounded">
          <div className="flex items-center space-x-2">
            {data.isFallback ? (
              <AlertCircle className="text-yellow-400" size={16} />
            ) : (
              <Check className="text-green-400" size={16} />
            )}
            <span className="font-bold text-white">
              {data.isFallback ? 'Mensaje Recibido (Modo Local)' : 'Mensaje Enviado con Éxito'}
            </span>
          </div>
          <p className="text-xs">{data.message}</p>
          <div className="text-xs opacity-70 font-mono italic pt-1 border-t border-current border-opacity-10">
            Contenido: &quot;{msg}&quot;
          </div>
        </div>
      );
    } catch (err: any) {
      return (
        <div className="text-red-400 space-y-1">
          <p>No se pudo enviar el mensaje debido a un error de red.</p>
          <p className="text-xs opacity-75">Tu mensaje: &quot;{msg}&quot;</p>
        </div>
      );
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Obtener la sugerencia actual de autocompletado para mostrarla como preview opaco
  const getActiveSuggestion = (): string => {
    const trimmed = inputVal.trimStart();
    if (!trimmed) return '';

    const parts = inputVal.split(' ');
    const cmd = parts[0].toLowerCase();

    if (parts.length === 1) {
      const prefix = parts[0].toLowerCase();
      const match = ALL_COMMANDS.find(c => c.startsWith(prefix) && c !== prefix);
      if (match) {
        return parts[0] + match.substring(prefix.length);
      }
    } else if (parts.length > 1) {
      const argPrefix = parts.slice(1).join(' ').toLowerCase();
      let targets: string[] = [];
      if (currentPath === '~') {
        if (cmd === 'cd') {
          targets = ['projects', 'socials'];
        } else if (cmd === 'cat') {
          targets = ['about.txt', 'contact.txt'];
        }
      } else if (currentPath === '~/projects') {
        if (cmd === 'cd') {
          targets = ['..'];
        } else if (cmd === 'cat') {
          targets = ['projects.sh'];
        }
      } else if (currentPath === '~/socials') {
        if (cmd === 'cd') {
          targets = ['..'];
        } else if (cmd === 'cat') {
          targets = ['socials.txt'];
        }
      }

      const match = targets.find(t => t.toLowerCase().startsWith(argPrefix) && t.toLowerCase() !== argPrefix);
      if (match) {
        return `${parts[0]} ${match}`;
      }
    }
    return '';
  };

  // Atajos de teclado en la terminal (Flechas arriba/abajo y Tab/Flecha Derecha para autocompletar)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (executedCommands.length === 0) return;
      
      const newIndex = historyIndex > 0 ? historyIndex - 1 : 0;
      setHistoryIndex(newIndex);
      setInputVal(executedCommands[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      if (newIndex >= executedCommands.length) {
        setHistoryIndex(executedCommands.length);
        setInputVal('');
      } else {
        setHistoryIndex(newIndex);
        setInputVal(executedCommands[newIndex]);
      }
    } else if (e.key === 'ArrowRight' || e.key === 'End') {
      const activeSuggestion = getActiveSuggestion();
      if (activeSuggestion) {
        const isCursorAtEnd = inputRef.current 
          ? inputRef.current.selectionStart === inputVal.length 
          : true;
        if (isCursorAtEnd) {
          e.preventDefault();
          setInputVal(activeSuggestion);
          setTabCycle(null);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentInput = inputVal.trim();
      if (!currentInput) return;

      const parts = inputVal.split(' ');
      const isArgAutocomplete = parts.length > 1;
      const cmd = parts[0].toLowerCase();
      const argPrefix = parts.slice(1).join(' ').toLowerCase();

      let prefix = currentInput.toLowerCase();
      let matches: string[] = [];
      let nextIndex = 0;

      if (tabCycle && tabCycle.matches.length > 0) {
        prefix = tabCycle.originalPrefix;
        matches = tabCycle.matches;
        nextIndex = (tabCycle.index + 1) % matches.length;
      } else {
        if (isArgAutocomplete) {
          // Argument autocompletion
          let targets: string[] = [];
          if (currentPath === '~') {
            if (cmd === 'cd') {
              targets = ['projects', 'socials'];
            } else if (cmd === 'cat') {
              targets = ['about.txt', 'contact.txt'];
            }
          } else if (currentPath === '~/projects') {
            if (cmd === 'cd') {
              targets = ['..'];
            } else if (cmd === 'cat') {
              targets = ['projects.sh'];
            }
          } else if (currentPath === '~/socials') {
            if (cmd === 'cd') {
              targets = ['..'];
            } else if (cmd === 'cat') {
              targets = ['socials.txt'];
            }
          }
          
          matches = targets
            .filter(t => t.toLowerCase().startsWith(argPrefix))
            .map(t => `${parts[0]} ${t}`);
            
          if (matches.length === 0) return;
          prefix = currentInput.toLowerCase();
          nextIndex = 0;
        } else {
          // Command autocompletion
          matches = ALL_COMMANDS.filter(cmdName => cmdName.startsWith(prefix));
          if (matches.length === 0) return;
          nextIndex = 0;
        }
      }

      const matchedCmd = matches[nextIndex];
      setInputVal(matchedCmd);
      setTabCycle({
        originalPrefix: prefix,
        matches,
        index: nextIndex
      });
    }
  };

  // Quick Command Buttons para mayor usabilidad, especialmente en móviles
  const quickCommands = ['help', 'about', 'projects', 'socials', 'whoami', 'ping', 'sysinfo', 'uname', 'traceroute', 'cal', 'ls', 'matrix', 'clear'];

  const themeClasses = themesMap[theme] || themesMap.green;

  return (
    <main 
      className={`relative w-full h-screen overflow-hidden font-mono select-none flex flex-col justify-between p-3 sm:p-5 bg-black transition-all duration-300 ${themeClasses.glowBg} ${themeClasses.text}`}
      onClick={focusTerminal}
      id="terminal-container"
    >
      {matrixActive && <MatrixRain theme={theme} />}
      {/* Estilos locales para animaciones CRT personalizadas */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes flicker {
          0% { opacity: 0.985; }
          50% { opacity: 0.995; }
          100% { opacity: 0.985; }
        }
        .animate-blink {
          animation: blink 0.9s step-end infinite;
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .animate-flicker {
          animation: flicker 0.15s ease-in-out infinite;
        }
        /* Ocultar barra de desplazamiento */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        @keyframes progress-slide {
          0% { left: -30%; }
          100% { left: 100%; }
        }
        @keyframes bar-glitch {
          0%, 100% { transform: none; opacity: 1; }
          7% { transform: skewX(-25deg) scaleY(1.3); opacity: 0.8; }
          10% { transform: translateX(-15px) skewX(20deg); opacity: 0.9; }
          12% { transform: none; opacity: 1; }
          40% { transform: none; opacity: 1; }
          42% { transform: scaleX(1.4) translateX(10px); opacity: 0.6; }
          44% { transform: none; opacity: 1; }
          75% { transform: none; opacity: 1; }
          76% { transform: skewX(25deg) scaleY(0.7); opacity: 0.7; }
          78% { transform: none; opacity: 1; }
        }
        .animate-progress-slide {
          animation: progress-slide 1.5s infinite linear, bar-glitch 2.5s infinite steps(10, end);
        }
      `}</style>

      {/* Efecto de parpadeo CRT y líneas de escaneo en la pantalla */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]"
           style={{ 
             background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
             backgroundSize: '100% 4px, 3px 100%'
           }} />

      {/* Estilo de Marco CRT decorativo y Vignette Sutil */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] z-20" />

      {/* Cabecera de la Terminal - Window Header */}
      <div className="h-10 bg-[#161616] flex items-center px-4 border-b border-[#333] justify-between z-10 -mx-3 -mt-3 sm:-mx-5 sm:-mt-5 mb-4 select-none relative">
        {isFetchingProjects && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a] overflow-hidden z-20">
            <div 
              className="absolute top-0 h-full w-[30%] animate-progress-slide"
              style={{
                backgroundColor: themeHexMap[theme] || '#00FF41',
                boxShadow: `0 0 8px ${themeHexMap[theme] || '#00FF41'}`,
              }}
            />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[11px] text-[#888] tracking-widest uppercase font-mono hidden sm:inline">
            terminal — guest@portfolio — nexus_os
          </span>
          <span className="text-[11px] text-[#888] tracking-widest uppercase font-mono sm:hidden">
            guest@portfolio
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="hidden md:flex items-center space-x-1.5">
            <Database size={12} className="text-[#888]" />
            <span className="opacity-80 text-[#888]">Database:</span>
            <span className={isDbConnected ? 'text-[#00FF41] font-bold' : 'text-yellow-500 font-bold'}>
              {isDbConnected === null ? 'SYNCING...' : isDbConnected ? 'ONLINE' : 'LOCAL-EMU'}
            </span>
          </div>

          {/* Deck de colores interactivos en cabecera (exclusivo para look premium) */}
          <div className="hidden lg:flex items-center space-x-1.5 border border-[#2a2a2a] bg-black/60 rounded-full px-2 py-0.5 shadow-inner">
            <span className="text-[9px] text-[#666] uppercase font-mono tracking-wider font-bold">Cores:</span>
            <div className="flex space-x-1.5">
              {Object.entries(themesMap).map(([key, val]) => {
                const dotColor = key === 'green' ? '#00FF41' :
                                 key === 'amber' ? '#FFB13B' :
                                 key === 'purple' ? '#D026FF' :
                                 key === 'cyan' ? '#00E5FF' :
                                 key === 'red' ? '#FF3F3F' :
                                 key === 'pink' ? '#FF2E93' :
                                 key === 'yellow' ? '#E7FE00' :
                                 key === 'orange' ? '#FF6B00' :
                                 key === 'white' ? '#F3F4F6' :
                                 key === 'emerald' ? '#00F5D4' : '#BDB2FF';
                return (
                  <button
                    key={key}
                    onClick={(e) => { e.stopPropagation(); setTheme(key); }}
                    title={val.colorName}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-150 relative border cursor-pointer hover:scale-125 ${theme === key ? 'border-white scale-110 shadow-md shadow-white/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: dotColor }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-1 border border-[#333] px-2 py-0.5 text-[10px] rounded uppercase opacity-90 text-[#888]">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-1" />
            {themeClasses.colorName}
          </div>
        </div>
      </div>

      {/* Cuerpo principal de la terminal */}
      <div 
        ref={terminalBodyRef}
        className="flex-1 w-full overflow-y-auto no-scrollbar pr-1 z-10 space-y-3 text-xs sm:text-sm leading-relaxed animate-flicker"
      >
        {/* Líneas de arranque (Boot lines) */}
        <div className="space-y-1">
          {bootLines.map((line, i) => (
            <div key={i} className="font-mono">
              <span className="opacity-70 font-mono mr-2">[{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              {line}
            </div>
          ))}
        </div>

        {/* Banner espectacular interactivo estilo CLI moderno */}
        {terminalBooted && (
          <div className="border border-[#222] p-4 sm:p-6 rounded bg-[#0A0A0A] my-4 shadow-2xl select-none relative overflow-hidden">
            {/* Ambient background glow inside card using theme currentColor */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-current opacity-5 blur-3xl pointer-events-none" />
            
            {/* Logo Box - Mimicking the exact visual from the Gemini image */}
            <div className="bg-black border border-[#1f1f1f] rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 relative overflow-hidden mb-5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
              {/* Subtle grid pattern inside logo box */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                   style={{
                     backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                     backgroundSize: '16px 16px'
                   }} />

              {/* Huge pixelated > symbol on the left */}
              <pre className="font-mono text-[8px] xs:text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] leading-[1.1] font-bold bg-gradient-to-b from-[#4fa3e3] to-[#2575fc] bg-clip-text text-transparent select-none shrink-0 text-center">
{` ██
   ██
     ██
   ██
 ██`}
              </pre>

              {/* NEXUS pixel logo with gorgeous gradient - dynamically selected from available ASCII font styles */}
              <div className="flex-1 flex flex-col items-center justify-center min-w-0">
                <pre className={`font-mono text-[6px] xs:text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] leading-[1.2] font-bold bg-gradient-to-r ${asciiBanners[currentBannerIdx].gradientClass} bg-clip-text text-transparent select-none whitespace-pre overflow-x-auto no-scrollbar py-2 text-center origin-center ${asciiBanners[currentBannerIdx].skewClass || ''}`}>
                  {asciiBanners[currentBannerIdx].ascii}
                </pre>
                <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest mt-1 text-center">
                  Estilo de Fuente: {asciiBanners[currentBannerIdx].fontName}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-[#888] font-bold font-mono text-xs uppercase tracking-widest">Sugerencias para comenzar (Haz clic para ejecutar):</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                <div 
                  onClick={() => { setInputVal('help'); executeCommand('help'); }}
                  className="flex items-start space-x-2.5 cursor-pointer bg-black bg-opacity-40 hover:bg-current hover:bg-opacity-[0.05] p-2.5 rounded border border-[#181818] hover:border-current hover:border-opacity-30 transition-all duration-200 group"
                >
                  <span className="text-pink-500 font-bold font-mono group-hover:scale-110 transition-transform">1.</span>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Escribe <span className="text-white underline font-semibold font-mono">help</span> para ver todos los comandos de la terminal.</span>
                </div>
                <div 
                  onClick={() => { setInputVal('projects'); executeCommand('projects'); }}
                  className="flex items-start space-x-2.5 cursor-pointer bg-black bg-opacity-40 hover:bg-current hover:bg-opacity-[0.05] p-2.5 rounded border border-[#181818] hover:border-current hover:border-opacity-30 transition-all duration-200 group"
                >
                  <span className="text-purple-500 font-bold font-mono group-hover:scale-110 transition-transform">2.</span>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Ejecuta <span className="text-white underline font-semibold font-mono">projects</span> para conectar y listar el portafolio.</span>
                </div>
                <div 
                  onClick={() => { setInputVal('about'); executeCommand('about'); }}
                  className="flex items-start space-x-2.5 cursor-pointer bg-black bg-opacity-40 hover:bg-current hover:bg-opacity-[0.05] p-2.5 rounded border border-[#181818] hover:border-current hover:border-opacity-30 transition-all duration-200 group"
                >
                  <span className="text-blue-500 font-bold font-mono group-hover:scale-110 transition-transform">3.</span>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Conoce mi trayectoria con <span className="text-white underline font-semibold font-mono">about</span> y descubre mis habilidades.</span>
                </div>
                <div 
                  onClick={() => { setInputVal('socials'); executeCommand('socials'); }}
                  className="flex items-start space-x-2.5 cursor-pointer bg-black bg-opacity-40 hover:bg-current hover:bg-opacity-[0.05] p-2.5 rounded border border-[#181818] hover:border-current hover:border-opacity-30 transition-all duration-200 group"
                >
                  <span className="text-cyan-500 font-bold font-mono group-hover:scale-110 transition-transform">4.</span>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Encuentra mis redes escribiendo <span className="text-white underline font-semibold font-mono">socials</span> para conectar.</span>
                </div>
              </div>
            </div>

            {/* Panel de Interconexión de Núcleos de Color (CRT Premium) */}
            <div className="border border-current border-opacity-15 bg-black/45 p-3.5 rounded-lg space-y-2.5 relative group overflow-hidden mt-4 shadow-[inset_0_1px_8px_rgba(255,255,255,0.02)]">
              <div className="absolute top-0 right-0 text-[7px] sm:text-[9px] opacity-20 font-mono select-none pointer-events-none uppercase tracking-widest p-1 border-b border-l border-current border-opacity-10">CORE_MODULE_v3.2 // ANDRESSY_OS</div>
              <p className="text-xs font-bold uppercase tracking-wider flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-2" />
                Interconexión de Núcleos de Color (Guardado Automático)
              </p>
              <p className="text-[11px] opacity-75 leading-relaxed">
                Haz clic sobre un núcleo de color para reprogramar la frecuencia visual del sistema Nexus_OS. Tu elección se guardará automáticamente en <span className="font-mono text-white bg-white/10 px-1 py-0.5 rounded">localStorage</span>:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.entries(themesMap).map(([key, val]) => {
                  const isActive = theme === key;
                  const btnColor = themeHexMap[key] || '#00FF41';
                  return (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTheme(key);
                      }}
                      className="text-[10px] sm:text-xs px-2.5 py-1.5 rounded font-mono border transition-all duration-200 active:scale-95 cursor-pointer flex items-center space-x-2 text-white"
                      style={{
                        borderColor: isActive ? btnColor : `${btnColor}26`,
                        backgroundColor: isActive ? `${btnColor}26` : 'transparent',
                        boxShadow: isActive ? `0 0 10px ${btnColor}40` : 'none',
                        fontWeight: isActive ? 'bold' : 'normal',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = `${btnColor}80`;
                          e.currentTarget.style.backgroundColor = `${btnColor}0d`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = `${btnColor}26`;
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: btnColor, boxShadow: `0 0 6px ${btnColor}` }} />
                      <span className="capitalize">{key}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Status bar - exactly like the bottom panel in the Gemini image */}
            <div className="mt-5 pt-3 border-t border-[#1a1a1a] flex flex-col sm:flex-row justify-between text-[11px] text-gray-500 font-mono gap-2 select-none">
              <div className="flex items-center space-x-1">
                <span className="text-cyan-500 font-bold">~</span>
                <span className="text-gray-400 font-medium">/nexus-portfolio{currentPath.substring(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-600">sandbox-exec</span>
                <span className="text-yellow-500 font-semibold">(active)</span>
              </div>
              <div className="text-purple-400 font-bold italic tracking-wider">
                Nexus_OS
              </div>
            </div>
          </div>
        )}

        {/* Historial de Comandos Ejecutados en la Terminal */}
        {terminalBooted && (
          <div className="space-y-4">
            {commandHistory.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="opacity-40 text-[10px] font-mono">[{item.timestamp}]</span>
                  <span className="font-semibold flex items-center space-x-1 select-none">
                    <span className="text-[#FFB13B]">invitado@portfolio</span>
                    <span className="text-white">:</span>
                    <span className="text-[#5C5CFF]">{item.path || '~'}</span>
                    <span className="text-white">$</span>
                  </span>
                  <span className="font-mono font-bold text-white">{item.command}</span>
                </div>
                <div className="pl-4 font-mono whitespace-pre-wrap opacity-95">
                  {item.output}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Línea activa actual */}
        {terminalBooted && (
          <div className="flex items-center space-x-2 pt-2 border-t border-[#333] border-opacity-40">
            <span className="font-semibold flex-shrink-0 flex items-center space-x-1 select-none">
              <span className="text-[#FFB13B]">invitado@portfolio</span>
              <span className="text-white">:</span>
              <span className="text-[#5C5CFF]">{currentPath}</span>
              <span className="text-white">$</span>
            </span>
            <div className="flex-1 flex items-center relative">
              <div className="relative flex items-center font-mono font-semibold break-all z-10">
                <span className="text-white">
                  {inputVal}
                </span>
                <span className={`w-2.5 h-4 flex-shrink-0 animate-blink ${themeClasses.caret} mx-0.5`} />
                {(() => {
                  const suggestion = getActiveSuggestion();
                  if (suggestion && suggestion.toLowerCase().startsWith(inputVal.toLowerCase())) {
                    return (
                      <span className="text-white/30 select-none pointer-events-none">
                        {suggestion.substring(inputVal.length)}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              
              {/* Input escondido pero enfocable para soporte de dispositivos móviles y captura de teclado nativo */}
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setTabCycle(null);
                }}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 w-full h-full opacity-0 cursor-default focus:outline-none"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Terminal Input"
              />
            </div>
          </div>
        )}

        {/* Cargador de estado al enviar mensajes */}
        {isSubmittingContact && (
          <div className="flex items-center space-x-2 text-xs opacity-70">
            <RefreshCw size={12} className="animate-spin" />
            <span>Enviando mensaje y sincronizando con base de datos remota...</span>
          </div>
        )}

        {/* Div de anclaje para autoscroll */}
        <div ref={bottomRef} />
      </div>

      {/* System info bar / footer decoration */}
      {terminalBooted && (
        <div className="px-1 text-[10px] text-[#444] uppercase tracking-[0.15em] font-mono select-none mt-2">
          System active | Connected to Supabase Engine | Latency 14ms
        </div>
      )}

      {/* Teclado de Acciones Rápidas (Especialmente útil en móviles para evitar problemas de compatibilidad del input) */}
      {terminalBooted && (
        <div className="mt-2 pt-3 border-t border-[#333] z-10 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-[10px] opacity-70 px-1">
            <span className="flex items-center">
              <Keyboard size={10} className="mr-1" />
              CONSOLA INTERACTIVA (Haz clic en cualquier parte para escribir)
            </span>
            <span className="hidden sm:inline">ATAJOS RÁPIDOS</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                onClick={(e) => {
                  e.stopPropagation();
                  setInputVal(cmd);
                  executeCommand(cmd);
                }}
                className={`text-[10px] sm:text-xs px-2.5 py-1.5 border border-current rounded font-mono uppercase font-semibold hover:bg-opacity-15 hover:bg-white active:scale-95 transition-all cursor-pointer`}
                id={`btn-cmd-${cmd}`}
              >
                {cmd}
              </button>
            ))}
            
            {/* Botón extra para abrir el teclado móvil obligándolo */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                focusTerminal();
              }}
              className="text-[10px] sm:text-xs px-2.5 py-1.5 border border-dashed border-current rounded font-mono uppercase hover:bg-opacity-15 hover:bg-white active:scale-95 transition-all cursor-pointer sm:hidden flex items-center space-x-1 ml-auto"
              id="btn-open-keyboard"
            >
              <Keyboard size={12} />
              <span>Abrir Teclado</span>
            </button>
          </div>
        </div>
      )}

      {/* Pista de teclado móvil si es detectada una pantalla pequeña */}
      {showMobileKeyboardHint && (
        <div className="fixed top-2 right-2 bg-black/80 text-white border border-current border-opacity-30 text-[9px] p-2 rounded z-50 flex items-center space-x-2 animate-bounce">
          <Info size={10} className="text-yellow-400" />
          <span>¿No puedes escribir? Toca &quot;Abrir Teclado&quot; abajo.</span>
        </div>
      )}
    </main>
  );
}
