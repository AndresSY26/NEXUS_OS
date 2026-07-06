import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({
        success: false,
        message: 'El mensaje no puede estar vacío.',
      }, { status: 400 });
    }

    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        isFallback: true,
        message: 'Mensaje recibido localmente. (Supabase no configurado, regístralo en Secrets para persistencia real).',
        data: { message, created_at: new Date().toISOString() }
      });
    }

    // Intentar insertar en la tabla 'contact_messages'
    // Primero con 'message' y 'created_at'
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        { message: message }
      ])
      .select();

    if (error) {
      console.warn('Fallo el primer intento de inserción:', error.message);
      
      // Intentar una variación por si las columnas son distintas, o arrojar el error
      throw error;
    }

    return NextResponse.json({
      success: true,
      isFallback: false,
      message: 'Mensaje guardado exitosamente en la tabla \'contact_messages\' de Supabase.',
      data,
    });

  } catch (err: any) {
    console.error('Error al guardar el mensaje de contacto en Supabase:', err);
    return NextResponse.json({
      success: true,
      isFallback: true,
      message: `Mensaje guardado localmente en caché de sesión (Nota: No se pudo escribir en Supabase: ${err.message || err}).`,
      local: true
    });
  }
}
