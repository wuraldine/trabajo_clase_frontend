# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Idea central de la clase

Hasta la semana 09 la aplicación permitía agregar productos al carrito, completar el checkout, confirmar una compra y guardar órdenes localmente, pero faltaba una pieza clave: el usuario no podía volver a consultar sus compras.

En esta clase resolvimos eso añadiendo una sección "Mi cuenta" donde el usuario puede ver su perfil mock y el historial de órdenes guardadas en `localStorage`. También agregamos una vista de detalle de orden accesible desde el listado, de modo que el usuario pueda revisar lo comprado, los totales (con IVA y envío) y los datos de entrega.

Los cambios preservan el flujo de carrito y checkout existente: las órdenes se persisten con la utilidad `src/utils/ordersStorage.js`, y las nuevas rutas son `/account` y `/account/order/:orderId`.

