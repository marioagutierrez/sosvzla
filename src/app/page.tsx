import PostForm from '@/components/PostForm';
import Feed from '@/components/Feed';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Banner Principal / Alerta */}
      <header className="bg-red-600 text-white py-4 px-6 shadow-md text-center">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tight uppercase">S.O.S. Terremoto Venezuela</h1>
            <p className="text-sm font-semibold opacity-90 mt-1">
              Plataforma pública de búsqueda y reporte de personas desaparecidas. No requiere registro.
            </p>
          </div>
          <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
            Canal de Ayuda Humanitaria
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Información de Emergencia y Formulario */}
        <section className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
            <h2 className="font-bold text-amber-800 text-sm uppercase tracking-wide">💡 Recomendación para baja señal:</h2>
            <p className="text-amber-900 text-xs mt-1 leading-relaxed">
              Las imágenes cargadas se comprimen directamente en tu teléfono/computadora antes de subirse. 
              Esto reduce su tamaño de 5MB a solo 50KB, permitiéndote publicar con muy poco internet.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-800 mb-2">Reportar Desaparecido</h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Llena los datos más precisos posibles. Cualquier persona que tenga información podrá comentar directamente en la publicación para ayudarte a localizarle.
            </p>
            <PostForm />
          </div>
        </section>

        {/* Columna Derecha: Feed de Desaparecidos */}
        <section className="md:col-span-7">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Últimos Reportes</h2>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              Actualizado en tiempo real
            </span>
          </div>
          
          <Feed />
        </section>
        
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center border-t border-slate-800 text-xs mt-12">
        <p className="max-w-xl mx-auto px-4 leading-relaxed">
          Este sistema es de uso público y libre. Diseñado para optimizar el ancho de banda y ayudar a salvar vidas en momentos críticos de desastre natural en Venezuela.
        </p>
      </footer>
    </div>
  );
}
