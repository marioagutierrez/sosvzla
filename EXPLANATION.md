# Explicación del Proyecto - Unidos por Venezuela

Este sistema ha sido diseñado como una herramienta de emergencia humanitaria rápida, pública y abierta para reportar y localizar a personas desaparecidas tras el terremoto en Venezuela.

## ¿Cómo funciona el sistema?

Cualquier persona afectada, **sin necesidad de registrarse ni iniciar sesión** (para evitar cualquier fricción técnica en situaciones de caos), puede rellenar un sencillo formulario en la página web:
1.  **Nombre de la persona desaparecida:** Para que otros familiares, amigos o rescatistas la busquen en el sistema.
2.  **Detalles clave:** Lugares habituales, ropa que llevaba, señas particulares y teléfonos de contacto.
3.  **Foto (opcional):** Una imagen de referencia que ayude a reconocerle visualmente.

Una vez enviado, la persona aparece inmediatamente en el **Feed Principal**. Otras personas que visiten la página y tengan alguna pista, ubicación o información del afectado, podrán dejar un **Comentario Público** debajo de su reporte de manera inmediata.

---
## Configuración para Despliegue en la Nube (Vercel)

Para que esta herramienta pueda estar disponible en internet de forma global, se ha preparado para ser desplegada en **Vercel**, una plataforma de nube optimizada para aplicaciones Next.js.

*   **Variables de Entorno:** La dirección de la base de datos ya no está escrita directamente en el código. Ahora, la aplicación la busca en una variable de entorno llamada `DATABASE_URL`. Esto permite que, cuando se despliegue en Vercel, se pueda configurar una base de datos de producción sin cambiar el código, haciendo el sistema más seguro y flexible.
*   **Construcción Automatizada:** Se ha añadido un comando especial (`prisma generate && prisma migrate deploy`) que se ejecuta automáticamente cada vez que se despliega la aplicación en Vercel. Este comando se encarga de dos cosas:
    1.  Prepara el cliente de Prisma para que la aplicación pueda hablar con la base de datos.
    2.  Aplica cualquier cambio en la estructura de la base de datos (migraciones) de forma automática.

Esto asegura que la aplicación se construya y se actualice en la nube de forma fiable con cada cambio en el código.

*   **Sincronización de Base de Datos:** Para que el sistema funcione correctamente con tu base de datos de Neon, se ha utilizado la herramienta `prisma db push`. Esto sincroniza el diseño de las tablas (como el campo de teléfono `phone` que faltaba) directamente con tu base de datos en la nube, resolviendo errores de conexión y de estructura que impedían que la página cargara.

*   **Solución al Error de Historial de Migraciones (P3019):** Al migrar de SQLite a PostgreSQL, las migraciones antiguas generaban un conflicto de compatibilidad en Vercel. Para resolver esto, eliminamos el historial antiguo e inicializamos uno completamente nuevo y compatible con PostgreSQL de Neon (`init_postgres`). Esto garantiza que Vercel pueda construir la aplicación sin problemas.

---

## Diseño Responsivo y Optimización para Teléfonos (Uso Móvil Sencillo)

El sistema ha sido diseñado bajo un enfoque **"Móvil Primero" (Mobile-First)**, ya que la gran mayoría de personas en zonas de desastre utiliza únicamente su teléfono inteligente para comunicarse. Las mejoras incluyen:

### 1. Cuadro de Comentarios Ampliado
*   **¿Cuál era el problema?:** En pantallas móviles, los campos de texto pequeños obligan al usuario a escribir en un espacio reducido de una sola línea, imposibilitando revisar lo redactado antes de enviarlo.
*   **¿Qué se implementó?:** Se reemplazó el campo simple por una **caja de texto multilínea grande** donde se visualizan varios renglones a la vez. Escribir datos precisos de avistamientos o teléfonos es ahora sumamente cómodo.
*   **Botón de envío para el pulgar:** El botón para comentar ahora ocupa el 100% de la anchura de la pantalla debajo de la caja de comentarios. Tiene una altura ideal de toque (más de 48 píxeles), lo que evita pulsaciones accidentales y facilita enviar información usando una sola mano.

### 2. Teclado y Campos de Texto Cómodos
*   Todos los campos para ingresar nombres o detalles en el formulario de reportes se expandieron en tamaño y espacio interior (padding).
*   Al tocarlos en un teléfono, el teclado virtual se despliega sin distorsionar el diseño de la página, manteniendo los textos perfectamente legibles y grandes para evitar la fatiga visual.

---

## Características de optimización para zonas con poca señal (Baja Conectividad)

En situaciones de desastre natural, las antenas telefónicas suelen dañarse y el internet es extremadamente inestable o lento. Por esta razón, el sistema cuenta con optimizaciones clave:

### 1. Compresión Automática de Fotos en el Dispositivo (Muy Importante)
Normalmente, una foto tomada con un smartphone actual pesa entre 3 y 10 Megabytes (MB). Intentar subir una foto de ese tamaño con mala señal suele fallar constantemente, agotando la batería del teléfono.
*   **¿Qué hace el sistema?:** Al seleccionar una foto, el navegador (Google Chrome, Safari, Firefox, etc.) de tu celular **comprime la imagen automáticamente en tu propio dispositivo antes de enviarla**.
*   **¿Cuál es el resultado?:** Reduce las dimensiones de la imagen a un estándar óptimo y baja el peso de la foto de **5 MB a solo 50 Kilobytes (KB)** (¡100 veces más ligera!). Esto permite subir la foto con una señal de internet mínima y de forma casi instantánea.

### 2. Base de Datos Rápida e Imágenes Integradas
Las fotos comprimidas se convierten en texto encriptado (**Base64**) y se guardan directamente dentro de la base de datos segura de PostgreSQL usando Prisma. Al no requerir servicios de almacenamiento de fotos externos, la página se comunica con un solo servidor, reduciendo el tráfico de red necesario y cargando todo el contenido de una sola vez.

### 3. Carga Ultra-Ligera en Navegadores
Para visualizar el feed, el sistema utiliza etiquetas de imagen estándar y código de programación nativo optimizado, evitando el uso de procesos del servidor pesados. De esta forma, la página carga de golpe y gasta el mínimo posible de datos del plan móvil de los afectados.

---

## Resumen de Tecnologías Aplicadas

*   **Next.js (Versión 16):** Para una estructura web sumamente veloz y capaz de entregar el contenido pre-procesado a los navegadores.
*   **Prisma (Versión 5):** El motor de base de datos eficiente y moderno encargado de guardar los reportes y los comentarios en tiempo real.
*   **HTML5 Canvas:** La tecnología nativa del navegador usada para comprimir las fotos al vuelo y en el cliente.
*   **Tailwind CSS:** Un conjunto de estilos sumamente ligero que permite crear un diseño con aspecto de alerta humanitaria profesional sin recargar el sitio.
