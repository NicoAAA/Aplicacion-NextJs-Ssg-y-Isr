// components/Layout.tsx
import React from 'react';
import Link from 'next/link';
import { FaHome, FaServer, FaCode, FaSyncAlt } from 'react-icons/fa'; // Importa iconos de react-icons

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

/**
 * Componente de layout reutilizable que incluye una barra de navegación y un encabezado.
 * Muestra el uso de font icons de react-icons y estilos de Tailwind CSS.
 */
const Layout: React.FC<LayoutProps> = ({ children, title = 'Next.js Modules Project' }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-4xl font-extrabold mb-4 md:mb-0">{title}</h1>
          <nav>
            <ul className="flex flex-wrap justify-center space-x-6">
              <li>
                <Link href="/" className="flex items-center text-lg hover:text-blue-200 transition-colors duration-200">
                  <FaHome className="mr-2" /> Inicio (SSR)
                </Link>
              </li>
              <li>
                <Link href="/ssg/1" className="flex items-center text-lg hover:text-blue-200 transition-colors duration-200">
                  <FaCode className="mr-2" /> SSG (ID 1)
                </Link>
              </li>
              <li>
                <Link href="/isr/1" className="flex items-center text-lg hover:text-blue-200 transition-colors duration-200">
                  <FaSyncAlt className="mr-2" /> ISR (ID 1)
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-10 text-center">
        <p>&copy; {new Date().getFullYear()} Next.js Modules Project. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Layout;
