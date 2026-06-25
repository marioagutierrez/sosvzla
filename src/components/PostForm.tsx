'use client';

import { useState, useRef, useTransition } from 'react';
import { createPost } from '@/app/actions';

export default function PostForm() {
  const [compressedImage, setCompressedImage] = useState<string>('');
  const [compressionProgress, setCompressionProgress] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressionProgress('Comprimiendo imagen...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Limitar dimensiones máximas a 800px para ahorrar datos
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Comprimir a JPEG con calidad de 0.6 (60%) para optimizar al máximo
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          // Guardar solo la porción base64 pura (sin el prefijo "data:image/jpeg;base64,")
          const base64 = dataUrl.split(',')[1];
          setCompressedImage(base64);
          setCompressionProgress('Imagen comprimida con éxito y optimizada.');
        } else {
          setCompressionProgress('Error al procesar la imagen.');
        }
      };
      img.onerror = () => {
        setCompressionProgress('Error al cargar la imagen.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const formData = new FormData(e.currentTarget);
    
    // Si tenemos una imagen comprimida en base64, la adjuntamos
    if (compressedImage) {
      formData.set('compressedImageBase64', compressedImage);
    }

    startTransition(async () => {
      try {
        await createPost(formData);
        // Limpiar el formulario tras el envío exitoso
        formRef.current?.reset();
        setCompressedImage('');
        setCompressionProgress('');
      } catch (err) {
        console.error('Error al publicar:', err);
        alert('Hubo un error al publicar. Intente de nuevo.');
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mb-8 p-5 bg-white shadow-md rounded-xl border border-gray-200">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-extrabold text-slate-700 mb-1.5">
          Nombre de la persona desaparecida o afectada
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="mt-1 block w-full rounded-lg border-slate-300 p-3.5 border bg-white text-slate-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
          placeholder="Ej. Juan Pérez"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-extrabold text-slate-700 mb-1.5">
            Teléfono de Contacto <span className="text-xs font-normal text-slate-500">(Opcional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="mt-1 block w-full rounded-lg border-slate-300 p-3.5 border bg-white text-slate-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Ej. 0414-1234567"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-extrabold text-slate-700 mb-1.5">
            Última Ubicación Conocida <span className="text-xs font-normal text-slate-500">(Opcional)</span>
          </label>
          <input
            type="text"
            name="location"
            id="location"
            className="mt-1 block w-full rounded-lg border-slate-300 p-3.5 border bg-white text-slate-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Ej. Sector La Candelaria, Caracas"
          />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-extrabold text-slate-700 mb-1.5">
          Descripción Adicional (ropa, señas, etc.)
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-lg border-slate-300 p-3.5 border bg-white text-slate-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
          placeholder="Describe la ropa que llevaba, señas particulares o cualquier otro detalle que ayude a identificarle."
          required
        ></textarea>
      </div>
      <div className="mb-5">
        <label htmlFor="image" className="block text-sm font-extrabold text-slate-700 mb-1.5">
          Foto (Se comprimirá automáticamente para cargar rápido)
        </label>
        <div className="mt-1 block w-full text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50">
          <input
            ref={fileInputRef}
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-slate-500
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-md file:border-0
              file:text-xs file:font-black file:uppercase
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 touch-manipulation cursor-pointer"
          />
        </div>
        {compressionProgress && (
          <p className="mt-2 text-xs text-indigo-600 font-bold">{compressionProgress}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 py-3.5 px-4 text-sm font-extrabold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.99] transition-transform touch-manipulation cursor-pointer"
      >
        {isPending ? 'Publicando...' : 'Publicar Reporte'}
      </button>
    </form>
  );
}
