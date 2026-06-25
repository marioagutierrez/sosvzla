## Cambios

### Migración a PostgreSQL y Prisma 5 (Estabilidad)

*   **Cambio:** Se migró la base de datos de SQLite a PostgreSQL y se degradó Prisma de la versión 7 a la 5.
*   **Propósito:** Solucionar una serie de errores de inestabilidad y corrupción en Prisma 7 que impedían la generación del cliente y la conexión a la base de datos. Se adoptó PostgreSQL para ser compatible con el proveedor de base de datos en la nube Neon.
*   **Lógica Aplicada:**
    1.  Se desinstalaron las versiones de `prisma`, `@prisma/client` y `@prisma/adapter-pg` de la familia 7.
    2.  Se instalaron las versiones estables de la familia 5 para los mismos paquetes.
    3.  Se actualizó `prisma/schema.prisma` para usar el proveedor `postgresql` y se restauró la propiedad `url` en el `datasource`, que es el método de configuración estándar para Prisma 5.
    4.  Se eliminó el archivo `prisma.config.ts` que era un requerimiento experimental de Prisma 7.
    5.  Se actualizó `src/lib/prisma.ts` para usar el `PrismaPg` adapter, permitiendo conexiones eficientes desde entornos serverless como Vercel a bases de datos como Neon.

### Sincronización de Base de Datos

*   **Cambio:** Se ejecutó `npx prisma db push` para sincronizar el esquema de Prisma con la base de datos de Neon en la nube.
*   **Propósito:** Crear las tablas y columnas necesarias (como `Post.phone`) que faltaban en la base de datos PostgreSQL de Neon, resolviendo el error de ejecución de Prisma.
*   **Lógica Aplicada:** Se utilizó el comando de la CLI de Prisma para aplicar directamente los cambios de `schema.prisma` a la base de datos configurada en el archivo `.env`.

### Configuración de Entorno y Vercel

*   **Cambio:** Se configuró la aplicación para usar una variable de entorno `DATABASE_URL` y se preparó para el despliegue en Vercel.
*   **Propósito:** Permitir que la URL de la base de datos se gestione de forma segura a través de variables de entorno, tanto en desarrollo local como en producción en Vercel.
*   **Lógica Aplicada:**
    1.  Se modificó `prisma/schema.prisma` para que el `datasource` lea la URL desde `env("DATABASE_URL")`.
    2.  Se actualizó el script `build` en `package.json` a `"prisma generate && prisma migrate deploy && next build"` para asegurar que Prisma genere el cliente y aplique las migraciones de la base de datos durante el proceso de construcción de Vercel.

### Creación del Proyecto

*   **Cambio:** Creación del proyecto inicial de Next.js.
*   **Propósito:** Establecer la base para el sistema de publicación de personas desaparecidas.
*   **Lógica Aplicada:** Se utilizó `npx create-next-app` para generar la estructura del proyecto con TypeScript, Tailwind CSS y la estructura de `src`.

### Integración de Prisma 7 y PostgreSQL

*   **Cambio:** Se agregó Prisma y se configuró para PostgreSQL, adaptando la arquitectura a Prisma 7.
*   **Propósito:** Definir el esquema de la base de datos para almacenar la información de las personas desaparecidas y los comentarios de forma compatible con la nueva versión.
*   **Lógica Aplicada:** Se instalaron las dependencias de Prisma, se inicializó un `schema.prisma` y se definieron los modelos `Post` y `Comment` con sus respectivos campos. Se configuró la URL de la base de datos en el archivo `.env`. Para ser compatibles con **Prisma 7**, se removió la propiedad `url` directa en el esquema de Prisma y se configuró el archivo `prisma.config.ts`. Asimismo, se instalaron `@prisma/adapter-pg` y `pg` y se instanció el cliente utilizando un Driver Adapter dentro de `src/lib/prisma.ts`.

### Reestructuración y Unificación del Directorio

*   **Cambio:** Reubicación de todos los archivos y carpetas del subdirectorio redundante `unidosxvzla/unidosxvzla` al directorio raíz.
*   **Propósito:** Simplificar la estructura del proyecto y evitar colisiones de rutas al ejecutar comandos de Prisma o del servidor de desarrollo de Next.js.
*   **Lógica Aplicada:** Se usaron comandos de PowerShell para remover `package.json` temporal del directorio raíz, mover todos los archivos del subdirectorio `unidosxvzla` al raíz, y luego eliminar el subdirectorio vacío resultante. Se reinstalaron las dependencias de forma centralizada en la raíz.

### Compresión de Imágenes en el Cliente (Optimización para Baja Señal)

*   **Cambio:** Implementación de compresión de fotos utilizando la API de HTML5 Canvas en el cliente antes de subir la información.
*   **Propósito:** Minimizar el peso de la imagen base64 (reducción de un archivo de 5MB a solo ~50KB) para permitir que las personas con muy poca señal de internet o datos puedan publicar con éxito de manera instantánea.
*   **Lógica Aplicada:** Se creó el componente de cliente `src/components/PostForm.tsx` que lee el archivo seleccionado con un `FileReader`, lo procesa en un `Canvas` HTML5 limitando las dimensiones a 800px y reduciendo la calidad JPEG a un 60% (0.6). El string base64 resultante es enviado a través del formulario como parte de la acción de servidor (`createPost` en `src/app/actions.ts`).

### Optimización y Rediseño de la Interfaz

*   **Cambio:** Reemplazo de la etiqueta `<Image>` de Next.js por la etiqueta nativa `<img>` de HTML y rediseño de las tarjetas del feed.
*   **Propósito:** Mejorar el rendimiento y reducir el consumo de recursos en el servidor eliminando el procesamiento dinámico y pesado de base64 que realiza Next.js, logrando una carga instantánea ideal para zonas de desastre.
*   **Lógica Aplicada:** Se adaptó `src/components/Feed.tsx` para mostrar los datos cronológicamente, usando clases utilitarias de Tailwind CSS para crear una interfaz de alerta clara, sobria e informativa (colores rojo y ámbar para guiar al usuario). Se incluyó un formulario de comentario rápido integrado de forma sencilla en cada tarjeta.

### Optimización de Usabilidad en Teléfonos Celulares (Mobile-First)

*   **Cambio:** Rediseño adaptativo completo con ampliación del campo de comentarios y áreas táctiles (touch targets) en todo el sitio.
*   **Propósito:** Hacer la aplicación extremadamente cómoda y rápida de usar con una sola mano en pantallas de teléfonos bajo estrés, mejorando significativamente la ergonomía y la velocidad de digitación.
*   **Lógica Aplicada:** 
    1.  Se cambió el campo de comentarios de un input horizontal ajustado a una caja `textarea` multilínea (`rows={3}`) amplia y cómoda de presionar.
    2.  Se colocó el botón "Publicar Comentario" debajo de la caja de texto ocupando el 100% del ancho del contenedor en móviles, ofreciendo una superficie de pulsación grande de más de 48px de alto para el pulgar.
    3.  Se ampliaron los campos del formulario de reportes en `src/components/PostForm.tsx` aumentando el padding a `p-3.5` e incrementando el área táctil del botón "Publicar Reporte" para evitar fallas táctiles al escribir de prisa.
