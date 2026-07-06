'use client';

import React, { useState } from 'react';
import { Database, AlertCircle, Cpu, ExternalLink, Search } from 'lucide-react';
import { themeHexMap } from '../themes';

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ProjectListSearchProps {
  projectsList: Project[];
  fallbackMode: boolean;
  theme: string;
}

export function ProjectListSearch({ projectsList, fallbackMode, theme }: ProjectListSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const hex = themeHexMap[theme] || '#00FF41';

  const filteredProjects = projectsList.filter((project) => {
    const term = searchTerm.toLowerCase();
    const matchesTitle = project.title ? project.title.toLowerCase().includes(term) : false;
    const matchesDesc = project.description ? project.description.toLowerCase().includes(term) : false;
    const matchesTech = project.technologies && project.technologies.some(tech => tech.toLowerCase().includes(term));
    return matchesTitle || matchesDesc || matchesTech;
  });

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs opacity-75 pb-2 border-b border-current border-opacity-20">
        <div className="flex items-center space-x-2">
          <Database size={12} />
          <span>{fallbackMode ? 'Supabase desconectado - Usando respaldo local' : "Consultando Supabase (tabla 'projects')..."}</span>
          {fallbackMode && (
            <span className="ml-2 flex items-center text-yellow-500 font-bold">
              <AlertCircle size={10} className="mr-1" /> MODULO EMULADO
            </span>
          )}
        </div>
        <div className="text-[10px] font-mono">
          PROYECTOS: {filteredProjects.length} / {projectsList.length}
        </div>
      </div>

      {/* Real-time search bar */}
      <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={14} style={{ color: hex }} className="opacity-70" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="Filtrar por nombre o tecnología..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#080808] text-white rounded border font-mono placeholder-gray-600 focus:outline-none transition-all duration-200"
          style={{
            borderColor: `${hex}33`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = hex;
            e.currentTarget.style.boxShadow = `0 0 8px ${hex}33`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = `${hex}33`;
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {searchTerm && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSearchTerm('');
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] text-gray-500 hover:text-white transition-colors font-mono cursor-pointer"
          >
            [X]
          </button>
        )}
      </div>

      {/* Grid of cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-5 pt-1">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id || index} 
              className="bg-gradient-to-br from-[#0c0c0c] to-[#040404] p-4 border rounded-xl relative group overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_12px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              style={{
                borderColor: `${hex}26`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${hex}99`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${hex}26`;
              }}
            >
              {/* Glowing subtle top bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 opacity-40 group-hover:opacity-100" 
                style={{ backgroundColor: hex }}
              />
              
              <div>
                {/* Card Header metadata */}
                <div className="flex items-center justify-between text-[9px] opacity-40 font-mono tracking-wider mb-2.5">
                  <span className="flex items-center space-x-1">
                    <Cpu size={9} className="animate-pulse" />
                    <span>NEXUS_MOD // {String(index + 1).padStart(2, '0')}</span>
                  </span>
                  <span>ID_{project.id || index}</span>
                </div>

                {/* Title */}
                <h3 
                  className="text-white font-bold font-mono text-xs sm:text-sm uppercase tracking-tight transition-colors duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hex;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  {project.title}
                </h3>

                {/* Technology badgelines */}
                <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                  {project.technologies && project.technologies.length > 0 ? (
                    project.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded border transition-all duration-200"
                        style={{
                          borderColor: `${hex}26`,
                          backgroundColor: `${hex}0d`,
                          color: hex,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${hex}26`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `${hex}0d`;
                        }}
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span 
                      className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded border"
                      style={{
                        borderColor: `${hex}26`,
                        backgroundColor: `${hex}0d`,
                        color: hex,
                      }}
                    >
                      TypeScript
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 group-hover:text-gray-300 leading-relaxed font-sans mb-4 italic transition-colors">
                  &ldquo;{project.description}&rdquo;
                </p>
              </div>

              {/* Connect button at bottom */}
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-auto flex items-center justify-between w-full text-[9px] uppercase font-bold tracking-widest font-mono py-2 px-3 rounded-lg border transition-all duration-200 cursor-pointer text-white"
                  style={{
                    borderColor: `${hex}33`,
                    backgroundColor: `${hex}0d`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hex;
                    e.currentTarget.style.borderColor = hex;
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${hex}0d`;
                    e.currentTarget.style.borderColor = `${hex}33`;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  <span>CONECTAR REPOSITORIO</span>
                  <ExternalLink size={10} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded border border-dashed border-opacity-20 font-mono text-xs text-gray-500" style={{ borderColor: hex }}>
          No se encontraron proyectos con ese criterio de búsqueda.
        </div>
      )}

      {fallbackMode && (
        <div className="text-[10px] opacity-65 pt-2 border-t border-current border-opacity-10 leading-snug">
          * Nota: Para persistir tus proyectos reales en PostgreSQL, crea la tabla &quot;projects&quot; en tu consola Supabase y agrega &quot;SUPABASE_URL&quot; y &quot;SUPABASE_ANON_KEY&quot; en tus Secrets de AI Studio.
        </div>
      )}
    </div>
  );
}
