import prisma from '@/lib/prisma';
import { createComment } from '@/app/actions';

export default async function Feed() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      comments: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-lg border border-slate-200 shadow-sm">
        <p className="text-slate-600 font-bold text-base">No hay reportes activos en este momento.</p>
        <p className="text-slate-400 text-sm mt-1">Usa el formulario para reportar a alguien y que aparezca aquí.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Cabecera del Post */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 leading-tight">{post.name}</h3>
              <time className="text-xs text-slate-500 block mt-1" dateTime={post.createdAt.toISOString()}>
                Reportado el {post.createdAt.toLocaleDateString('es-VE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
            <span className="text-xs font-black tracking-wider uppercase bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              Buscado
            </span>
          </div>

          {/* Imagen si existe */}
          {post.image && (
            <div className="bg-slate-100 border-b border-slate-100 max-h-[350px] overflow-hidden flex items-center justify-center">
              <img
                src={`data:image/jpeg;base64,${post.image}`}
                alt={`Foto de ${post.name}`}
                className="w-full h-auto object-cover max-h-[350px]"
                loading="lazy"
              />
            </div>
          )}

          {/* Cuerpo del Post */}
          <div className="p-5 flex-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Información de contacto y detalles:</h4>
            <p className="text-base text-slate-700 whitespace-pre-line leading-relaxed font-normal">
              {post.description}
            </p>
          </div>

          {/* Sección de Comentarios */}
          <div className="bg-slate-50 p-5 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">
              Información de terceros y comentarios ({post.comments.length})
            </h4>

            {/* Listado de Comentarios existentes */}
            {post.comments.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-5 pr-1">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-3.5 rounded-lg border border-slate-200 text-sm shadow-sm">
                    <p className="text-slate-800 font-medium leading-relaxed">{comment.text}</p>
                    <time className="text-[10px] text-slate-400 block mt-2 font-semibold" dateTime={comment.createdAt.toISOString()}>
                      {comment.createdAt.toLocaleDateString('es-VE', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic mb-5">No hay comentarios aún. Deja un mensaje si tienes pistas o información útil.</p>
            )}

            {/* Formulario móvil-first grande para comentar */}
            <form action={createComment} className="flex flex-col gap-3">
              <input type="hidden" name="postId" value={post.id} />
              
              <div className="w-full">
                <textarea
                  name="text"
                  rows={3}
                  placeholder="Escribe aquí si has visto a esta persona, conoces su estado o tienes alguna pista de contacto..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm bg-white text-slate-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow leading-relaxed"
                  required
                  autoComplete="off"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-extrabold text-sm py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-slate-500 active:scale-[0.99] touch-manipulation shadow-md"
              >
                Publicar Comentario
              </button>
            </form>
          </div>

        </article>
      ))}
    </div>
  );
}
