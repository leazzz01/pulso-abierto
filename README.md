Pulso Abierto — Consulta de criptomonedas
Descripción
Pulso Abierto es una aplicación web que permite consultar los precios de Bitcoin, Ethereum y Solana. Muestra la información en un listado y permite buscar criptomonedas, filtrar favoritos y entrar a una página con más detalles.

También permite elegir entre USD, EUR y ARS. Los favoritos se guardan en el navegador para que sigan disponibles después de cerrar o recargar la página.
API utilizada
- Nombre: CoinGecko API.
- Endpoint de referencia para la consulta inicial en USD: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd
- Método: GET.
- Parámetros principales:
  - ids: indica qué criptomonedas se consultan. En este caso, Bitcoin, Ethereum y Solana.
  - vs_currencies: indica la moneda en la que se muestran los precios. La URL de referencia utiliza usd; la aplicación también permite seleccionar eur y ars.
  - include_market_cap: solicita la capitalización de mercado.
  - include_24hr_vol: solicita el volumen de las últimas 24 horas.
  - include_24hr_change: solicita la variación de precio de las últimas 24 horas.
- Propiedades de la respuesta utilizadas: bitcoin.usd, ethereum.usd y solana.usd para los precios de la consulta en USD. También se utilizan los campos de capitalización, volumen y variación de 24 horas cuando vienen incluidos en la respuesta.
En el código, el servicio src/services/cryptoService.ts arma la consulta con los identificadores y la moneda seleccionada. Por eso, al cambiar la moneda o abrir el detalle de una criptomoneda, algunos parámetros de la solicitud cambian. Los nombres, símbolos e imágenes se encuentran definidos en el proyecto porque no se obtienen de este endpoint.
Instalación
Desde la carpeta del proyecto, ejecutar:
npm install
Este comando instala las dependencias definidas en package.json y package-lock.json.
Ejecución
Para iniciar la aplicación en modo desarrollo:
npm run dev
La aplicación queda disponible en la dirección que muestra la terminal, normalmente http://localhost:5173/.

Otros comandos disponibles:
npm run test:run  # ejecuta las pruebas una vez
npm run test      # ejecuta Vitest en modo interactivo
npm run build     # comprueba TypeScript y genera la versión de producción en dist/
npm run preview   # permite probar localmente la versión generada
Para utilizar npm run preview, primero hay que ejecutar npm run build.

El proyecto no tiene configurados los comandos npm run lint ni npm run format.
Estados de la interfaz
La aplicación contempla los siguientes estados:
- Inicial: muestra la vista principal y prepara la consulta.
- Carga: aparece mientras se solicitan los datos a CoinGecko.
- Resultado: muestra las criptomonedas y la información recibida.
- Vacío: informa cuando no hay resultados para mostrar.
- Error: informa si falla la consulta y permite volver a intentarlo.
- Página no encontrada: aparece cuando se accede a una ruta que no corresponde a una página disponible.
Tecnologías utilizadas
- React y TypeScript.
- Vite.
- React Router para la navegación.
- Zustand para administrar y conservar los favoritos.
- Zod para validar los datos del formulario.
- Vitest y Testing Library para las pruebas automatizadas.
Estructura del proyecto
src/types contiene los tipos de datos. src/data contiene los identificadores y la información básica de las criptomonedas. src/services concentra las consultas a CoinGecko. src/schemas contiene la validación del formulario. src/components contiene los componentes reutilizables y src/pages las páginas de la aplicación. src/App.tsx configura las rutas, src/main.tsx inicia React, src/index.css contiene los estilos y src/store administra los favoritos con Zustand. La carpeta tests contiene las pruebas automatizadas.
Despliegue
La aplicación está publicada en Vercel:

URL pública: https://pulso-abierto-rho.vercel.app/

El proyecto utiliza BrowserRouter. El archivo vercel.json configura la reescritura de las rutas para que las páginas internas puedan abrirse directamente y recargarse sin mostrar un error 404.

La configuración de despliegue utilizada es:
- Framework: Vite.
- Build Command: npm run build.
- Output Directory: dist.
- Install Command: npm install.
La aplicación no requiere variables de entorno.

Repositorio de GitHub: https://github.com/leazzz01/pulso-abierto
Mejora de mantenibilidad
Se eliminaron src/main.ts, src/style.css y src/counter.ts porque pertenecían a la plantilla inicial de Vite y no estaban conectados con la aplicación React. La entrada que utiliza el proyecto es src/main.tsx, que importa src/index.css. Después de la limpieza se ejecutaron las pruebas, el build y el preview para comprobar que la aplicación siguiera funcionando.
Verificación final
- Pruebas automatizadas: npm run test:run. Resultado: 8 pruebas aprobadas en 2 archivos.
- Build: npm run build finalizó correctamente. Se mostraron advertencias no bloqueantes de React Router.
- Preview: se comprobó la carga de la aplicación, los precios en USD, la búsqueda, la validación del formulario, el filtro de favoritos, la navegación al detalle, la persistencia de favoritos y el regreso al listado. También se revisaron los tamaños de 375 y 1280 píxeles.
- API: durante una comprobación posterior, CoinGecko respondió y la aplicación mostró el estado de error previsto. Queda pendiente repetir la consulta real en EUR y ARS cuando la API permita realizar nuevas solicitudes.
- Despliegue: realizado en Vercel. Falta completar la comprobación en producción de la recarga directa de una ruta de detalle y repetir las verificaciones de la API en la URL pública.