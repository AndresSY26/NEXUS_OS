'use client';

import React from 'react';
import { themeHexMap } from '../themes';

interface CalendarSimulationProps {
  args: string;
  theme: string;
}

export function CalendarSimulation({ args, theme }: CalendarSimulationProps) {
  const today = new Date();
  let month = today.getMonth(); // 0-indexed (enero es 0)
  let year = today.getFullYear();

  const parts = args.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const val = parseInt(parts[0], 10);
    if (!isNaN(val) && val >= 1 && val <= 12) {
      month = val - 1;
    }
  } else if (parts.length >= 2) {
    const mVal = parseInt(parts[0], 10);
    const yVal = parseInt(parts[1], 10);
    if (!isNaN(mVal) && mVal >= 1 && mVal <= 12) {
      month = mVal - 1;
    }
    if (!isNaN(yVal) && yVal > 0) {
      year = yVal;
    }
  }

  // Nombres de los meses en español
  const monthNames = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  const monthName = monthNames[month];

  // Cantidad de días en el mes actual
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Día de la semana del primer día del mes (0 = Domingo, 1 = Lunes, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Crear la cuadrícula de días
  const days: (number | null)[] = [];
  // Rellenar espacios vacíos antes del primer día del mes
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  // Rellenar con los días reales
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Agrupar en semanas (arreglos de 7 elementos)
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const isToday = (dayNum: number | null) => {
    if (dayNum === null) return false;
    return (
      dayNum === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const themeHex = themeHexMap[theme] || '#00FF41';

  return (
    <div className="font-mono text-xs select-text border border-current border-opacity-20 p-4 bg-black/35 rounded-lg max-w-xs space-y-3">
      {/* Cabecera del calendario con nombre de mes resaltado */}
      <div className="text-center font-bold tracking-wider text-sm border-b border-current border-opacity-10 pb-2 flex justify-between items-center" style={{ color: themeHex }}>
        <span className="opacity-50 select-none">«</span>
        <span>{monthName} {year}</span>
        <span className="opacity-50 select-none">»</span>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-x-1.5 text-center font-bold text-zinc-400 border-b border-current border-opacity-10 pb-1">
        <span>Do</span>
        <span>Lu</span>
        <span>Ma</span>
        <span>Mi</span>
        <span>Ju</span>
        <span>Vi</span>
        <span>Sá</span>
      </div>

      {/* Cuadrícula del calendario */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1.5 text-center">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="col-span-7 grid grid-cols-7 gap-x-1.5">
            {week.map((day, dIdx) => {
              if (day === null) {
                return <span key={`empty-${wIdx}-${dIdx}`} className="block w-6 h-6" />;
              }

              const currentDayIsToday = isToday(day);

              return (
                <span
                  key={`day-${day}`}
                  className={`block w-6 h-6 leading-6 text-center rounded font-semibold text-[11px] ${
                    currentDayIsToday
                      ? 'text-black font-extrabold shadow-[0_0_8px_rgba(255,255,255,0.45)]'
                      : 'text-white/90 hover:bg-white/10 hover:text-white transition-all cursor-default'
                  }`}
                  style={
                    currentDayIsToday
                      ? { backgroundColor: themeHex }
                      : undefined
                  }
                >
                  {day}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Estado y pie de página de fecha actual */}
      <div className="text-[10px] text-zinc-500 text-center border-t border-current border-opacity-10 pt-2 flex justify-between">
        <span>Hoy: {today.toLocaleDateString('es-ES')}</span>
        <span className="font-bold uppercase" style={{ color: themeHex }}>{theme} os</span>
      </div>
    </div>
  );
}
