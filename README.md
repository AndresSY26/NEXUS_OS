# NexusOS — Terminal Portfolio & CLI Interactivo Profesional

![NexusOS Terminal Banner](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80)

Bienvenido a **NexusOS**, un portafolio interactivo de nivel profesional que simula una terminal de comandos retro-moderna de alta fidelidad. Este sistema combina la nostalgia de las consolas clásicas con una interfaz moderna y fluida optimizada tanto para escritorio como para dispositivos móviles.

El proyecto está diseñado bajo un estándar riguroso de desarrollo, con persistencia en el lado del cliente, integraciones modernas con bases de datos en la nube, y efectos de renderizado optimizados mediante elementos Canvas de HTML5.

---

## 🛠️ Tecnologías, Frameworks y Versiones

El núcleo de NexusOS se ha desarrollado utilizando los estándares de ingeniería web más modernos y robustos, logrando una arquitectura ligera, modular y de altísimo rendimiento:

<div align="left">
  <img src="https://img.shields.io/badge/TypeScript-v5.9.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-v15.4.9-black?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-v19.2.1-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.1.11-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Motion-v12.23.24-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Motion" />
  <img src="https://img.shields.io/badge/Supabase-v2.110.0-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Google_GenAI-v2.4.0-8E75C2?style=flat-square&logo=google-gemini&logoColor=white" alt="Google GenAI" />
</div>

### Detalles del Stack de Desarrollo
*   **Lenguaje**: **TypeScript (v5.9.3)** - Tipado estático estricto para garantizar la robustez del código.
*   **Framework Principal**: **Next.js (v15.4.9)** con arquitectura **App Router** para rendimiento de última generación.
*   **Biblioteca de UI**: **React (v19.2.1)** con Hooks avanzados (`useState`, `useEffect`, `useRef`).
*   **Motor de Estilos**: **Tailwind CSS (v4.1.11)** y PostCSS para utilidades dinámicas rápidas.
*   **Animaciones Fluidas**: **Motion (v12.23.24)** para transiciones de pantalla e interacciones suaves.
*   **Integración de Datos**: **Supabase Client (v2.110.0)** para persistencia remota PostgreSQL en tiempo real.
*   **Núcleo de Inteligencia**: **Google GenAI (v2.4.0)** para comunicación asíncrona segura con Gemini AI en el servidor.

---

## 🚀 Características Clave y Módulos de Software

### 1. Sistema de Archivos y Navegación Virtual (`cd`, `ls`, `cat`)
Se ha implementado una simulación completa de árbol de directorios para una experiencia de usuario interactiva y realista:
*   **Directorios Virtuales**: Rutas relativas y absolutas con soporte para el directorio raíz (`~`), el de proyectos (`~/projects`) y el de redes (`~/socials`).
*   **Comandos de Navegación**:
    *   `cd [directorio]`: Cambia de ruta virtual (ej: `cd projects` o `cd socials`).
    *   `cd ..`: Permite regresar de forma segura al directorio padre (`~`).
    *   `cd ~` o `cd`: Retorna directamente al home del sistema desde cualquier subcarpeta.
*   **Listado Inteligente (`ls`)**: El comando se adapta al directorio activo listando archivos válidos (como `about.txt`, `contact.txt`, `projects.sh` o `socials.txt`) y subcarpetas (`projects/`, `socials/`).
*   **Lectura Dinámica (`cat [archivo]`)**: Los comandos de lectura validan la ubicación del usuario, impidiendo leer archivos inexistentes o alertando adecuadamente si se intenta usar `cd` en un archivo plano. Permite ejecutar el script ejecutable `projects.sh` mediante `./projects.sh` para renderizar el portafolio en tiempo real.

### 2. Motor de Lluvia Digital Matrix Binaria (`matrix`)
Se ha desarrollado un algoritmo optimizado de animación matricial que se dibuja de fondo de manera no intrusiva:
*   **Código de Máquina Real**: A diferencia de las animaciones genéricas que usan texto aleatorio, esta lluvia está formada estrictamente por bits binarios (`0` y `1`) en código de máquina puro.
*   **Renderizado de Alta Performance**: Implementado directamente sobre un elemento `canvas` bidimensional de HTML5 con descarte automático y reciclaje de memoria al salir de la pantalla para evitar fugas de rendimiento (`requestAnimationFrame`).
*   **Velocidad Controlada**: Regulación precisa de la tasa de refresco a **15 FPS** (Frames Per Second). Esto permite una transición fluida en la que los números se deslizan a una velocidad óptima, garantizando que el usuario entienda con total claridad qué caracteres están cayendo.
*   **Tipografía y Legibilidad**: Escala de fuente expandida a **20px** con espaciado uniforme para proporcionar un impacto visual contundente pero legible.
*   **Adaptabilidad Cromática**: El color de la lluvia digital se ajusta de manera dinámica y en tiempo real al tema seleccionado actualmente por el usuario (ej. si cambias a tema `purple`, la lluvia binaria muta inmediatamente a tonos púrpuras neón).

### 3. Banners de Arte ASCII Dinámicos (`clear`)
Al ejecutar el comando `clear`, no solo se limpia el historial de comandos de la pantalla, sino que el sistema regenera un logotipo de **NEXUS** con un diseño completamente aleatorio para dar variedad al usuario:
*   **7 Fuentes Tipográficas Retro**: El sistema rota aleatoriamente entre fuentes estilizadas como *Matrix Slant*, *Cyber Block*, *Retro Isometric*, *Collegiate Bold*, *Minimalist Code*, *Rounded Bubble* y *Slanted Line*.
*   **Gradientes y Estilos de Rejilla**: Cada fuente de banner cuenta con su propia combinación de colores cromáticos y deformaciones sesgadas (skew) personalizadas, mostrando en texto de consola el nombre de la fuente activa.

### 4. Personalización Multi-Tema de Alta Fidelidad
Incorporación de **11 núcleos de color cromáticos** retro-futuristas:
1.  **Green (Verde Fósforo)** - `#00FF41`
2.  **Amber (Ámbar Clásico)** - `#FFB000`
3.  **Purple (Púrpura Hacker)** - `#D800FF`
4.  **Cyan (Cian Holográfico)** - `#00FFFF`
5.  **Red (Alerta Roja)** - `#FF003C`
6.  **Pink (Rosa Sintetizador)** - `#FF007F`
7.  **Yellow (Amarillo Cyberpunk)** - `#FFFF00`
8.  **Orange (Naranja Consola)** - `#FF5500`
9.  **White (Mono Monocromo)** - `#FFFFFF`
10. **Emerald (Esmeralda Brillante)** - `#50FA7B`
11. **Lavender (Lavanda Retro)** - `#BD93F9`

*El tema elegido es persistido automáticamente en el navegador usando `localStorage` para recordar la preferencia en visitas futuras.*

### 5. Conectividad en Tiempo Real
Visualizador integrado de estado de bases de datos de alta gama. La interfaz cuenta con indicadores en tiempo real que confirman si el sistema está conectado a Supabase:
*   Muestra un indicador `Database: ONLINE` (o un estado degradado si no hay conectividad).
*   Monitoreo dinámico del número de núcleos lógicos activos en el sistema del cliente.

### 6. Accesibilidad y Usabilidad Móvil
*   **Botonera de Comandos Rápidos**: Un menú adaptativo e intuitivo para pantallas táctiles que permite ejecutar comandos frecuentes con un solo toque sin requerir teclado físico.
*   **Ajuste Elástico**: Redimensionamiento automático del canvas de Matrix ante eventos de reorientación o cambio de tamaño del navegador.

### 7. Comando Secreto Hacker (`hack`)
Se ha integrado un comando secreto interactivo que simula una intrusión de terminal retro de alta gama con un panel de control secuencial unificado de ciencia ficción optimizado para el espacio de trabajo:
*   **Diseño Secuencial Integrado Vertical**: El módulo de hacking se presenta como una lista unificada de fases apiladas de forma vertical en lugar de tarjetas separadas, permitiendo seguir visualmente el flujo cronológico y ordenado de la intrusión.
*   **Secuencia de Fases de Infección Dinámica**:
    *   **Fase 01: Supabase Firewall & Gateway Disruption**: Muestra el escaneo de puertos, desborde SYN y la evasión RLS hasta romper la conexión de forma segura.
    *   **Fase 02: Kernel Exploit & Privilege Escalation**: Simula la inyección de shellcode, sobrescritura del registro de retorno (RIP offset) y el escalado de privilegios de invitado a administrador root.
    *   **Fase 03: Frame Buffer Matrix Override**: Secuestra el descriptor `/dev/fb0` del dispositivo gráfico e inyecta la lluvia digital a 60 FPS estables.
*   **Consola General de Intrusión Unificada**: Un panel que centraliza todas las salidas y logs de infección del sistema. Este flujo reactivo lee los porcentajes de progreso de cada fase y va imprimiendo cada subproceso en tiempo real con códigos de color de alta fidelidad.
*   **Sin Contenedores de Scroll Interno (Visualización Completa)**: Se eliminó cualquier scrollbox o limitación de altura fija en el flujo de logs de la terminal de hackeo. Todo el flujo de la infección del sistema se despliega al 100% de manera fluida y visible de inmediato sin obligar al usuario a hacer scroll manual para leer el historial de eventos de intrusión.
*   **Barras de Progreso Segmentadas Premium**: Cada una de las tres fases principales cuenta con un indicador de barra segmentada de 30 bloques con glow de neón en color rojo/esmeralda según el nivel de completado.
*   **Decodificador de Memoria Hexadecimal en Tiempo Real (`HexDump`)**: Simula el escaneo recursivo de direcciones de memoria RAM mapeada (0x7FFF1A00 - 0x7FFF1A2F) para forzar los overrides gráficos en el sistema.
*   **Glitch Alert & System Compromised**: Culmina con un gigantesco logotipo ASCII animado de "SYSTEM COMPROMISED" sobre un fondo de aviso pulsante en rojo y una advertencia glitch de acceso root concedido.
*   **Botón de Restauración de Núcleo**: Añade un botón interactivo "Restaurar Núcleo de Nexus_OS" para limpiar el historial y restablecer la terminal de manera elegante.

### 8. Comandos de Sistema Adicionales (`whoami`, `ping`, `sysinfo`, `uname`, `traceroute` & `cal`)
Para enriquecer la interactividad realista de la consola de comandos, se han implementado utilidades de red, diagnóstico de recursos e información de versión:
*   **Comando `whoami`**: Despliega un panel con la información simulada de la sesión actual del usuario, como el ID del proceso activo (PID aleatorio), una dirección IP de red local simulada generada de manera pura, ubicación física virtual y tiempo exacto transcurrido desde el inicio de la conexión actual.
*   **Comando `ping [host]`**: Ejecuta una simulación interactiva en tiempo real enviando 4 paquetes ICMP consecutivos hacia cualquier IP o host provisto por el usuario (por defecto `google.com`). Cada paquete muestra el tamaño en bytes, número de secuencia, TTL y un tiempo de latencia realista aleatorio (RTT en ms). Al finalizar, calcula y despliega estadísticas profesionales de rendimiento (`min/avg/max/mdev` y % de pérdida de paquetes).
*   **Comando `sysinfo`**: Genera un reporte detallado en tiempo real con el estado del sistema operativo (`Nexus_OS v3.2.0-secure`), el tiempo de actividad acumulado (uptime dinámico de simulación continua), la asignación y consumo de memoria 100% real obtenido a través de las Web APIs del navegador (`performance.memory` para el JS Heap de la pestaña activa y `navigator.deviceMemory` para la RAM física real del dispositivo), y el porcentaje de uso de procesador (carga de CPU dinámica sobre 16 núcleos lógicos activos). Todo el panel de información de recursos se actualiza dinámicamente en vivo segundo a segundo.
*   **Comando `uname`**: Devuelve una cadena de texto estilizada que detalla la versión del kernel del sistema operativo activo (`Nexus_OS Kernel 5.15.0-generic`).
*   **Comando `traceroute [host]`**: Realiza una simulación interactiva de diagnóstico de ruta que rastrea el salto de paquetes hacia el destino indicado, imprimiendo cada nodo intermedio con latencias crecientes para representar de manera realista la topología e infraestructura de la red.
*   **Comando `cal [mes] [año]`**: Renderiza un elegante calendario en formato ASCII directamente en la terminal. El día y mes actuales se resaltan con un bloque de color de alto contraste determinado por el tema visual seleccionado por el usuario en tiempo real. Soporta el paso de argumentos dinámicos para visualizar cualquier mes del año deseado.

### 9. Autocompletado Inteligente en Tiempo Real y Previsualización Fantasma (`Tab` / `ArrowRight`)
Para recrear la experiencia de terminales avanzadas y editores de código modernos (como *Zsh con Auto-suggestions* o *VS Code*), se ha implementado un motor inteligente de predicción interactivo:
*   **Texto Fantasma / Opaco (Inline Prediction)**: Mientras el usuario escribe, el sistema detecta de manera instantánea las coincidencias disponibles y proyecta de forma sutil lo que falta por completar en un color semitransparente (`text-white/30`) alineado inmediatamente después del texto actual y detrás del cursor.
*   **Autocompletado Contextual Integrado**:
    *   **Autocompletado de Comandos**: Al presionar `Tab`, el sistema busca entre los 20 comandos instalados y autocompleta el texto o cicla de forma rotativa entre todas las opciones válidas del mismo prefijo.
    *   **Autocompletado de Argumentos**: Detecta dinámicamente el directorio virtual activo (`currentPath`) para comandos como `cd` y `cat`, sugiriendo únicamente los archivos planos o carpetas que existen en esa ubicación (ej. `projects`, `socials`, `about.txt`, `projects.sh`, `socials.txt`, etc.).
*   **Aceptación Instantánea por Teclado**: Además de `Tab`, el usuario puede aceptar la sugerencia autocompletando la línea completa de manera rápida presionando la **Flecha Derecha (`ArrowRight`)** o la tecla **`End`** cuando el cursor de escritura esté al final del texto.

---

## 📁 Estructura del Directorio de la Aplicación

```text
/
├── app/
│   ├── api/                     # Endpoints del lado del servidor (API Routes de Supabase y Gemini)
│   ├── globals.css              # Estilos globales y directivas de Tailwind CSS
│   ├── layout.tsx               # Layout principal y declaración de fuentes (next/font/google)
│   └── page.tsx                 # Página de entrada limpia que renderiza el contenedor principal
├── components/                  # Arquitectura de componentes desacoplada y modular
│   └── terminal/                # Módulos de la consola retro-moderna
│       ├── simulations/         # Simulaciones CLI encapsuladas (Ping, Traceroute, Whoami, SysInfo, etc.)
│       ├── AsciiBanner.tsx      # Colección de banners dinámicos artísticos de NEXUS
│       ├── HackProgress.tsx     # Flujo secuencial interactivo del comando 'hack'
│       ├── MatrixRain.tsx       # Lluvia digital de bits binarios optimizada en Canvas HTML5
│       ├── TerminalContainer.tsx# Orquestador del CLI, entrada de comandos, historial y UI de terminal
│       ├── session.ts           # Gestor de sesión persistente (generación de PID, IP virtual, cronómetros)
│       └── themes.ts            # Definición y mapeo de las 11 paletas de colores retro neón
├── lib/                         # Librerías y clientes de servicios integrados
│   └── supabase.ts              # Inicialización bajo demanda del cliente Supabase
├── .env.example                 # Plantilla de variables de entorno requeridas
├── metadata.json                # Metadatos del applet y permisos de AI Studio
├── package.json                 # Gestión de dependencias y scripts de compilación
├── postcss.config.mjs           # Configuración de PostCSS con soporte para Tailwind v4
└── tsconfig.json                # Configuración del compilador TypeScript
```

---

## 🛠️ Instrucciones de Instalación y Uso Local

Para ejecutar y probar este proyecto de manera local, siga los siguientes pasos:

### 1. Clonar el repositorio e Instalar dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Cree un archivo `.env` en la raíz del proyecto basándose en `.env.example`:
```env
# Gemini API Key (Requerido para llamadas de inteligencia artificial)
GEMINI_API_KEY="tu_clave_de_gemini"

# Supabase Configurations (Requerido para la persistencia e historial)
SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_ANON_KEY="tu_clave_anon_de_supabase"
```

### 3. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible localmente en `http://localhost:3000`.

### 4. Compilar para Producción
Para compilar y verificar el estado listo para despliegue de la aplicación:
```bash
npm run build
```

---

## ✨ Diseño y Craftmanship
El proyecto sigue principios rigurosos de **Aesthetic Pairings** y **Architectural Honesty**:
*   **Tipografía Curada**: Uso estructurado de fuentes monoespaciadas y modernas de alta legibilidad para recrear la estética clásica de computadora central.
*   **Efecto CRT e Iluminación de Fondo**: Sutiles sombreados de texto y animaciones de parpadeo que le dan vida al panel interactivo.
*   **Negativo Inteligente**: Generoso uso de espacios vacíos para permitir que los contrastes de los colores neón destaquen sin sobrecargar la vista del usuario.
