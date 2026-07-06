export const themesMap: Record<string, {
  text: string;
  border: string;
  bg: string;
  caret: string;
  glow: string;
  colorName: string;
  glowBg: string;
}> = {
  green: {
    text: 'text-[#00FF41]',
    border: 'border-[#00FF41]',
    bg: 'bg-[#00FF41]',
    caret: 'bg-[#00FF41]',
    glow: 'shadow-[0_0_15px_rgba(0,255,65,0.3)]',
    colorName: 'Verde CRT (Fósforo)',
    glowBg: 'bg-black'
  },
  amber: {
    text: 'text-[#FFB13B]',
    border: 'border-[#FFB13B]',
    bg: 'bg-[#FFB13B]',
    caret: 'bg-[#FFB13B]',
    glow: 'shadow-[0_0_15px_rgba(255,177,59,0.3)]',
    colorName: 'Ámbar CRT (Fósforo)',
    glowBg: 'bg-black'
  },
  purple: {
    text: 'text-[#D026FF]',
    border: 'border-[#D026FF]',
    bg: 'bg-[#D026FF]',
    caret: 'bg-[#D026FF]',
    glow: 'shadow-[0_0_15px_rgba(208,38,255,0.3)]',
    colorName: 'Púrpura Neón (CRT)',
    glowBg: 'bg-black'
  },
  cyan: {
    text: 'text-[#00E5FF]',
    border: 'border-[#00E5FF]',
    bg: 'bg-[#00E5FF]',
    caret: 'bg-[#00E5FF]',
    glow: 'shadow-[0_0_15px_rgba(0,229,255,0.3)]',
    colorName: 'Cian Cyberspace',
    glowBg: 'bg-black'
  },
  red: {
    text: 'text-[#FF3F3F]',
    border: 'border-[#FF3F3F]',
    bg: 'bg-[#FF3F3F]',
    caret: 'bg-[#FF3F3F]',
    glow: 'shadow-[0_0_15px_rgba(255,63,63,0.3)]',
    colorName: 'Rojo Alerta Crítica',
    glowBg: 'bg-black'
  },
  pink: {
    text: 'text-[#FF2E93]',
    border: 'border-[#FF2E93]',
    bg: 'bg-[#FF2E93]',
    caret: 'bg-[#FF2E93]',
    glow: 'shadow-[0_0_15px_rgba(255,46,147,0.3)]',
    colorName: 'Rosa Synthwave',
    glowBg: 'bg-black'
  },
  yellow: {
    text: 'text-[#E7FE00]',
    border: 'border-[#E7FE00]',
    bg: 'bg-[#E7FE00]',
    caret: 'bg-[#E7FE00]',
    glow: 'shadow-[0_0_15px_rgba(231,254,0,0.3)]',
    colorName: 'Voltio Amarillo',
    glowBg: 'bg-black'
  },
  orange: {
    text: 'text-[#FF6B00]',
    border: 'border-[#FF6B00]',
    bg: 'bg-[#FF6B00]',
    caret: 'bg-[#FF6B00]',
    glow: 'shadow-[0_0_15px_rgba(255,107,0,0.3)]',
    colorName: 'Naranja Plasma',
    glowBg: 'bg-black'
  },
  white: {
    text: 'text-[#F3F4F6]',
    border: 'border-[#F3F4F6]',
    bg: 'bg-[#F3F4F6]',
    caret: 'bg-[#F3F4F6]',
    glow: 'shadow-[0_0_15px_rgba(243,244,246,0.3)]',
    colorName: 'Blanco Monocromo',
    glowBg: 'bg-black'
  },
  emerald: {
    text: 'text-[#00F5D4]',
    border: 'border-[#00F5D4]',
    bg: 'bg-[#00F5D4]',
    caret: 'bg-[#00F5D4]',
    glow: 'shadow-[0_0_15px_rgba(0,245,212,0.3)]',
    colorName: 'Esmeralda Virtual',
    glowBg: 'bg-black'
  },
  lavender: {
    text: 'text-[#BDB2FF]',
    border: 'border-[#BDB2FF]',
    bg: 'bg-[#BDB2FF]',
    caret: 'bg-[#BDB2FF]',
    glow: 'shadow-[0_0_15px_rgba(189,178,255,0.3)]',
    colorName: 'Lavanda Retro',
    glowBg: 'bg-black'
  }
};

export const themeHexMap: Record<string, string> = {
  green: '#00FF41',
  amber: '#FFB13B',
  purple: '#D026FF',
  cyan: '#00E5FF',
  red: '#FF3F3F',
  pink: '#FF2E93',
  yellow: '#E7FE00',
  orange: '#FF6B00',
  white: '#F3F4F6',
  emerald: '#00F5D4',
  lavender: '#BDB2FF'
};

export const themeMapping: Record<string, string> = {
  green: 'green',
  g: 'green',
  verde: 'green',
  v: 'green',
  
  amber: 'amber',
  a: 'amber',
  ambar: 'amber',
  
  purple: 'purple',
  p: 'purple',
  morado: 'purple',
  purpura: 'purple',
  m: 'purple',
  
  cyan: 'cyan',
  c: 'cyan',
  cian: 'cyan',
  
  red: 'red',
  r: 'red',
  rojo: 'red',
  
  pink: 'pink',
  rosa: 'pink',
  rosado: 'pink',
  
  yellow: 'yellow',
  y: 'yellow',
  amarillo: 'yellow',
  
  orange: 'orange',
  o: 'orange',
  naranja: 'orange',
  
  white: 'white',
  w: 'white',
  blanco: 'white',
  b: 'white',
  
  emerald: 'emerald',
  e: 'emerald',
  esmeralda: 'emerald',
  
  lavender: 'lavender',
  l: 'lavender',
  lavanda: 'lavender',
};
