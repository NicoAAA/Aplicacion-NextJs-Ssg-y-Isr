// pages/isr/[id].tsx (Implementación de ISR - Incremental Static Regeneration con Rick and Morty API)
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

interface ISRPageProps {
  character?: Character;
  revalidatedAt?: string;
  error?: string;
}

/**
 * Página que demuestra Incremental Static Regeneration (ISR) con rutas dinámicas de la Rick and Morty API.
 * Las páginas se pre-renderizan en tiempo de construcción y se revalidan en el servidor.
 */
const ISRPage: React.FC<ISRPageProps> = ({ character, revalidatedAt, error }) => {
  if (error) {
    return (
      <Layout title="Error al cargar personaje ISR">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center" role="alert">
          <strong className="font-bold">Error de Carga: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">
            Este personaje no pudo ser generado o revalidado. Por favor, verifica tu conexión a internet o intenta más tarde.
          </p>
        </div>
      </Layout>
    );
  }

  if (!character) {
    return (
      <Layout title="Personaje no encontrado">
        <div className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative mb-6 text-center" role="alert">
          <strong className="font-bold">Personaje no encontrado: </strong>
          <span className="block sm:inline">El ID del personaje no existe o no pudo ser generado.</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`ISR: ${character.name}`}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start">
        <img
          src={character.image}
          alt={character.name}
          className="w-48 h-48 object-cover rounded-full shadow-md mb-6 md:mb-0 md:mr-8"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/200x200/e0e0e0/505050?text=No+Image`;
          }}
        />
        <div>
          <h2 className="text-4xl font-extrabold text-purple-700 mb-4">{character.name}</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-2">
            <strong>Estado:</strong> {character.status}
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-2">
            <strong>Especie:</strong> {character.species}
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-2">
            <strong>Género:</strong> {character.gender}
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mb-2">
            <strong>Origen:</strong> {character.origin.name}
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            <strong>Última Ubicación:</strong> {character.location.name}
          </p>
          <p className="mt-6 text-sm text-gray-500">
            Esta página fue generada estáticamente y revalidada cada 60 segundos (ISR).
          </p>
          {revalidatedAt && (
              <p className="text-sm text-gray-500">
              Última revalidación: {new Date(revalidatedAt).toLocaleTimeString()}
              </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

/**
 * getStaticPaths: Define las rutas de personajes que Next.js debe pre-renderizar.
 * 'fallback: 'blocking'' permite generar páginas en demanda si no están en paths.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // Pre-renderizamos los IDs 1 y 2. Otros IDs serán generados en la primera solicitud.
  const charactersToPreRender = [1, 2];
  const paths = charactersToPreRender.map((id) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking', // Para ISR, 'blocking' es común para nuevas rutas no pre-renderizadas
  };
};

/**
 * getStaticProps: Obtiene los datos para cada personaje y define la estrategia de revalidación.
 * 'revalidate: 60' indica que la página se revalidará si una solicitud llega después de 60 segundos.
 */
export const getStaticProps: GetStaticProps<ISRPageProps> = async ({ params }) => {
  const id = params?.id as string;

  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        return { notFound: true, revalidate: 60 }; // Si el personaje no existe, 404 y revalida
      }
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }
    const character: Character = await res.json();

    return {
      props: {
        character,
        revalidatedAt: new Date().toISOString(),
      },
      revalidate: 60, // Revalidar cada 60 segundos
    };
  } catch (error: any) {
    console.error(`Error en getStaticProps (isr/[id].tsx) para ID ${id} con Rick and Morty API:`, error.message || error);
    let errorMessage = `No se pudo generar/revalidar la página para el ID ${id}. Verifica tu conexión a internet.`;
    if (error.cause && error.cause.code === 'ETIMEDOUT') {
        errorMessage = `Tiempo de espera agotado al generar/revalidar la página ISR para ID ${id}. Posible problema de red o API no disponible.`;
    } else if (error.message.includes('HTTP')) {
        errorMessage = `Error del servidor al generar/revalidar la página ISR para ID ${id}: ${error.message}.`;
    }
    return {
      notFound: true, // Mostrará la página 404 de Next.js
      revalidate: 60, // Aún así, intenta revalidar en el futuro si la página se accede
    };
  }
};

export default ISRPage;