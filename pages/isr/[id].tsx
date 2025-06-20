// pages/isr/[id].tsx (Implementación de ISR - Incremental Static Regeneration con getStaticPaths)
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface ISRPageProps {
  post: Post;
  revalidatedAt: string; // Para mostrar cuándo se revalidó la página
}

/**
 * Página que demuestra Incremental Static Regeneration (ISR) con rutas dinámicas.
 * Las páginas se pre-renderizan en tiempo de construcción y se revalidan en el servidor.
 */
const ISRPage: React.FC<ISRPageProps> = ({ post, revalidatedAt }) => {
  if (!post) {
    return (
      <Layout title="Cargando ISR...">
        <p className="text-center text-xl text-gray-700">Cargando...</p>
      </Layout>
    );
  }

  return (
    <Layout title={`ISR Post ID: ${post.id}`}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-4">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed text-lg">{post.body}</p>
        <p className="mt-6 text-sm text-gray-500">
          Esta página fue generada estáticamente y revalidada cada 60 segundos (ISR).
        </p>
        <p className="text-sm text-gray-500">
          Última revalidación: {new Date(revalidatedAt).toLocaleTimeString()}
        </p>
      </div>
    </Layout>
  );
};

/**
 * getStaticPaths: Define las rutas que Next.js debe pre-renderizar.
 * 'fallback: 'blocking'' o 'true' permite generar páginas en demanda si no están en paths.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
  ];

  return {
    paths,
    fallback: 'blocking', // Las rutas no generadas en build-time serán generadas en la primera solicitud y luego cacheadas.
  };
};

/**
 * getStaticProps: Obtiene los datos para cada ruta y define la estrategia de revalidación.
 * 'revalidate: 60' indica que la página se revalidará (se re-generará) si una solicitud
 * llega después de 60 segundos desde la última generación.
 */
export const getStaticProps: GetStaticProps<ISRPageProps> = async ({ params }) => {
  const id = params?.id as string;

  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!res.ok) {
      throw new Error(`Error fetching post ${id}: ${res.statusText}`);
    }
    const post: Post = await res.json();

    return {
      props: {
        post,
        revalidatedAt: new Date().toISOString(), // Marca de tiempo de la revalidación
      },
      revalidate: 60, // Revalidar cada 60 segundos
    };
  } catch (error) {
    console.error(`Error fetching post ${id} for ISR:`, error);
    return {
      notFound: true, // Si hay un error, muestra una página 404
      revalidate: 60, // Aún así, intenta revalidar en el futuro si la página se accede
    };
  }
};

export default ISRPage;