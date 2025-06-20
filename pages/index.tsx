// pages/index.tsx (Implementación de SSR - Server-Side Rendering)
import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import Card from '../components/Card';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface HomePageProps {
  posts: Post[];
  error?: string; // Agregamos una prop para el error
}

/**
 * Página de inicio que demuestra Server-Side Rendering (SSR).
 * Los datos se obtienen en cada solicitud a través de getServerSideProps.
 */
const HomePage: React.FC<HomePageProps> = ({ posts, error }) => {
  return (
    <Layout title="Next.js SSR Example">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        SSR: Posts obtenidos en el servidor en cada solicitud
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error de Carga: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">
            Por favor, verifica tu conexión a internet o intenta más tarde.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {posts.map((post) => (
          <Card
            key={post.id}
            title={post.title}
            description={post.body.substring(0, 100) + '...'}
            link={`/ssg/${post.id}`}
            linkText="Ver detalles"
          />
        ))}
      </div>
    </Layout>
  );
};

/**
 * getServerSideProps: Función para obtener datos en el lado del servidor para cada solicitud.
 * Los datos se pasan como props al componente de la página.
 */
export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
    if (!res.ok) {
      // Si la respuesta no es OK, aún lanzamos un error
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }
    const posts: Post[] = await res.json();
    return {
      props: {
        posts,
      },
    };
  } catch (error: any) { // Capturamos cualquier tipo de error
    console.error('Error en getServerSideProps (index.tsx):', error.message || error);
    let errorMessage = "No se pudieron cargar las publicaciones. Verifica tu conexión a internet.";
    if (error.cause && error.cause.code === 'ETIMEDOUT') {
        errorMessage = "Tiempo de espera agotado al intentar conectar con la API. Posible problema de red o API no disponible.";
    } else if (error.message.includes('HTTP')) {
        errorMessage = `Error del servidor al cargar publicaciones: ${error.message}.`;
    }
    return {
      props: {
        posts: [], // Retorna un array vacío en caso de error
        error: errorMessage, // Pasa el mensaje de error para mostrar en la UI
      },
    };
  }
};

export default HomePage;
