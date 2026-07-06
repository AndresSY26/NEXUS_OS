import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json({
      success: true,
      isFallback: true,
      message: 'Supabase URL o Anon Key no configuradas en las variables de entorno. Mostrando proyectos por defecto.',
      projects: getFallbackProjects(),
    });
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      isFallback: false,
      projects: data && data.length > 0 ? data : getFallbackProjects(),
    });
  } catch (err: any) {
    console.error('Error fetching projects from Supabase:', err);
    return NextResponse.json({
      success: true,
      isFallback: true,
      message: `No se pudo consultar la tabla 'projects' (${err.message || err}). Mostrando proyectos de respaldo.`,
      projects: getFallbackProjects(),
    });
  }
}

function getFallbackProjects() {
  return [
    {
      id: 1,
      title: 'NeoTerminal Portfolio',
      description: 'Un portafolio interactivo estilo terminal retro CRT con comandos y persistencia.',
      technologies: ['Next.js', 'Supabase', 'Tailwind CSS', 'TypeScript'],
      link: 'https://github.com/user/neoterminal',
    },
    {
      id: 2,
      title: 'DevAI Assistant',
      description: 'Extensión para editores de código que asiste en documentación usando Gemini API.',
      technologies: ['Node.js', 'Gemini API', 'VS Code API'],
      link: 'https://github.com/user/devai',
    },
    {
      id: 3,
      title: 'TaskChain',
      description: 'Gestor de tareas descentralizado con contratos inteligentes en red de pruebas.',
      technologies: ['Solidity', 'Ethers.js', 'React', 'Tailwind CSS'],
      link: 'https://github.com/user/taskchain',
    },
    {
      id: 4,
      title: 'CyberSensor Dashboard',
      description: 'Panel de visualización de datos de sensores IoT industriales en tiempo real.',
      technologies: ['React', 'D3.js', 'WebSockets', 'Tailwind CSS'],
      link: 'https://github.com/user/cybersensor',
    },
  ];
}
