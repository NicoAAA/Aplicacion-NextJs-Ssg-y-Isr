import '../styles/globals.css'; // Importa los estilos globales de Tailwind
import type { AppProps } from 'next/app';

/**
 * Componente _App personalizado para Next.js.
 * Aquí se importan los estilos globales de Tailwind CSS.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
