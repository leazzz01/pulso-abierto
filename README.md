# Pulso Abierto

Aplicación React, TypeScript y Vite para consultar Bitcoin, Ethereum y Solana mediante la API pública de CoinGecko.

Utiliza React Router para la navegación, Zustand para los favoritos, Zod para la validación y Vitest y Testing Library para las pruebas.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Para comprobar tipos y generar la versión de producción: `npm run build`. Para ejecutar las pruebas una vez: `npm run test:run`; `npm test` las ejecuta en modo interactivo. Para previsualizarla: `npm run preview`.

El comando de preview muestra en la terminal la dirección local para abrir en el navegador; requiere haber generado antes el build.

## Uso

- La consulta inicial utiliza USD. Busca por nombre o símbolo; el filtro y la casilla de favoritos se aplican al instante sobre las tres criptomonedas descargadas.
- Una búsqueda puede estar vacía o contener al menos dos caracteres. El botón valida el formulario y consulta nuevamente con la moneda elegida (USD, EUR o ARS).
- Marca o desmarca favoritos desde las tarjetas o el detalle. Se guardan en el almacenamiento local de ese navegador y permanecen después de recargar.
- El detalle consulta la API por identificador, por lo que funciona al abrir directamente su URL para Bitcoin, Ethereum o Solana. La moneda se transmite en `?currency=usd`, `eur` o `ars`; si se omite, se usa USD.
- Se muestran estados de carga, error con reintento, resultados vacíos y página inexistente. CoinGecko puede limitar las solicitudes o no devolver algunos valores.
- Para demostrar los estados sin consultar la API, abre `/?demo=empty` o `/?demo=error`; elimina el parámetro para volver a la consulta normal.

## Estructura

`src/types` define los datos, `src/data` contiene los identificadores, nombres, símbolos e imágenes de las tres criptomonedas, `src/services` concentra la red y valida la respuesta, `src/schemas` valida el formulario, `src/components` contiene la interfaz reutilizable y `src/pages` implementa las rutas. `src/App.tsx` configura el enrutador, `src/main.tsx` inicia React, `src/index.css` contiene los estilos y `src/store` administra los favoritos con Zustand. `tests` contiene las pruebas.

Se utiliza el endpoint original `GET https://api.coingecko.com/api/v3/simple/price` con `ids` y `vs_currencies`. Se solicitan también capitalización, volumen y variación en 24 horas mediante los parámetros `include_market_cap`, `include_24hr_vol` e `include_24hr_change`. Los nombres, símbolos e imágenes se definen en la aplicación porque este endpoint no los devuelve.

## Despliegue

Al usar `BrowserRouter`, `vercel.json` configura la reescritura a `index.html` para que las rutas internas, como `/criptomonedas/bitcoin`, puedan abrirse directamente y recargarse en Vercel. La aplicación no requiere variables de entorno.

Al importar el repositorio en Vercel, selecciona como Root Directory la carpeta que contiene `package.json` y configura:

- Framework: Vite.
- Build Command: `npm run build`.
- Output Directory: `dist`.
- Install Command: `npm install`.

URL pública de Vercel: **pendiente de completar después del despliegue**.

## Mejora de mantenibilidad

Se eliminaron `src/main.ts`, `src/style.css` y `src/counter.ts`, archivos de una implementación anterior que no estaban conectados a la aplicación React. `index.html` utiliza `src/main.tsx`, que importa `src/index.css`; ninguna parte activa importaba los archivos eliminados. Las pruebas, el build y el preview permiten comprobar posibles regresiones; sus resultados se registran a continuación.

## Verificación final

- Pruebas: `npm run test:run`, 8 pruebas aprobadas en 2 archivos. Las pruebas del servicio utilizan respuestas simuladas.
- Build: `npm run build` finalizó correctamente; Vite mostró advertencias no bloqueantes sobre directivas `use client` de React Router.
- Preview: se verificaron la carga y los precios reales en USD de las tres criptomonedas, la búsqueda por símbolo, la validación, el filtro de favoritos, la navegación al detalle, la persistencia tras recargar y el regreso al listado. No se observó desbordamiento horizontal en anchos de 375 y 1280 píxeles. La recarga directa del detalle funcionó en preview.
- CoinGecko respondió posteriormente HTTP 429 sin cabecera CORS y la aplicación mostró el error previsto. Queda pendiente confirmar nuevamente con la API real las consultas en EUR y ARS y verificar la consola cuando el servicio deje de limitar las solicitudes.
- Confirmación del despliegue: pendiente; la reescritura debe comprobarse en Vercel una vez publicado.
- Fecha de verificación: 25/11/2026.
