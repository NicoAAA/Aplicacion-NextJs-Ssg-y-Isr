// pages/ssg/[id].tsx (Implementación de SSG - Static Site Generation con getStaticPaths)
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface SSGPageProps {
  post: Post;
}

/**
 * Página que demuestra Static Site Generation (SSG) con rutas dinámicas.
 * Las páginas se pre-renderizan en tiempo de construcción.
 */
const SSGPage: React.FC<SSGPageProps> = ({ post }) => {
  if (!post) {
    return (
      <Layout title="Cargando SSG...">
        <p className="text-center text-xl text-gray-700">Cargando...</p>
      </Layout>
    );
  }

  return (
    <Layout title={`SSG Post ID: ${post.id}`}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-4">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed text-lg">{post.body}</p>
        <p className="mt-6 text-sm text-gray-500">
          Esta página fue generada estáticamente en tiempo de construcción (SSG).
        </p>
      </div>
    </Layout>
  );
};

/**
 * getStaticPaths: Define las rutas que Next.js debe pre-renderizar en tiempo de construcción.
 * 'fallback: false' significa que cualquier ruta no definida aquí resultará en un 404.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // En un proyecto real, esto podría venir de una API para obtener todos los IDs posibles
  const paths = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];

  return {
    paths,
    fallback: false, // Cualquier ID que no sea 1, 2 o 3 resultará en un 404
  };
};

/**
 * getStaticProps: Obtiene los datos para cada ruta pre-renderizada en tiempo de construcción.
 */
export const getStaticProps: GetStaticProps<SSGPageProps> = async ({ params }) => {
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
      },
    };
  } catch (error) {
    console.error(`Error fetching post ${id} for SSG:`, error);
    return {
      notFound: true, // Si hay un error, muestra una página 404
    };
  }
};

export default SSGPage;
