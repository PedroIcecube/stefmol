# Stefmol Store — Next.js + Supabase + Vercel

Tienda inicial basada en la referencia visual: catálogo responsive, categorías, búsqueda, carrito, total y envío del pedido por WhatsApp. El panel `/admin` permite subir imágenes desde la galería del celular o desde el computador.

## 1. Requisitos
- Node.js 20.9 o superior
- Cuenta en Supabase
- Cuenta en Vercel
- Número de WhatsApp del negocio con indicativo de país

## 2. Configurar Supabase
1. Crea un proyecto en https://supabase.com.
2. Entra a **SQL Editor**, crea una consulta y pega todo el contenido de `supabase.sql`; pulsa Run.
3. En **Project Settings > API** copia Project URL, `anon`/publishable key y `service_role`/secret key.
4. La clave service role es privada: solo se configura como variable de entorno del servidor. Nunca la pongas en una variable `NEXT_PUBLIC_`.

## 3. Ejecutar localmente
1. Instala Node.js.
2. En la carpeta del proyecto, copia `.env.example` como `.env.local`.
3. Completa las variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` (contraseña larga y única)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (ej. `573001234567`, sin + ni espacios)
   - `NEXT_PUBLIC_STORE_NAME` (opcional)
4. En terminal:
   ```bash
   npm install
   npm run dev
   ```
5. Abre http://localhost:3000. El administrador está en http://localhost:3000/admin.

## 4. Publicar en Vercel
1. Sube la carpeta a un repositorio privado de GitHub.
2. En https://vercel.com importa ese repositorio.
3. En **Settings > Environment Variables**, agrega las mismas variables del `.env.local`.
4. Haz Deploy. Si agregas/cambias variables después, vuelve a desplegar.
5. Abre `https://tu-proyecto.vercel.app/admin` para añadir productos.

## 5. Subir imágenes desde celular o computador
Entra a `/admin`, escribe la contraseña, rellena los datos y toca **Toca para elegir una imagen**. En el celular se abre el selector de fotos/archivos; en computador, el explorador de archivos. Al guardar, la foto se almacena en Supabase Storage y el producto en la tabla `products`.

## Importante antes de vender
- Reemplaza el número de WhatsApp de ejemplo.
- Cambia la contraseña de administrador por una segura.
- Prueba el proceso de pedido en móvil y computador.
- El carrito solo arma y envía el pedido por WhatsApp; no procesa pagos ni calcula transportadoras automáticamente.
- El catálogo de demostración se muestra si aún no hay productos cargados o si la API no está configurada. Para una tienda real, revisa que Supabase esté configurado y que la tabla tenga los productos.
- Agrega tus políticas de privacidad, cambios/devoluciones, cobertura de envío y condiciones de compra. Mantén la venta restringida a mayores de 18 años.
