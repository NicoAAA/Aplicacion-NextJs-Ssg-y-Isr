import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
// Make sure the path is correct; adjust if Card is in a different folder
import Card from '../components/Card';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string; // URL de la imagen del personaje
}

interface HomePageProps {
  characters: Character[];
  error?: string;
}

/**
 * Página de inicio que demuestra Server-Side Rendering (SSR) con la Rick and Morty API.
 * Los datos se obtienen en cada solicitud a través de getServerSideProps.
 */
const HomePage: React.FC<HomePageProps> = ({ characters, error }) => {
  return (
    <Layout title="Next.js SSR con Rick and Morty">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        SSR: Personajes de Rick y Morty obtenidos en el servidor en cada solicitud
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
        {characters.map((character) => (
          <Card
            key={character.id}
            title={character.name}
            description={`Especie: ${character.species} - Estado: ${character.status}`}
            link={`/isr/${character.id}`} // Enlace a la página SSG del personaje
            linkText="Ver detalles"
            imageUrl={character.image} // Pasamos la URL de la imagen
            imageAlt={character.name}
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
    const res = await fetch('https://rickandmortyapi.com/api/character?page=1'); // Obtener algunos personajes
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    const characters: Character[] = data.results.slice(0, 6); // Limitar a 6 personajes

    return {
      props: {
        characters,
      },
    };
  } catch (error: any) {
    console.error('Error en getServerSideProps (index.tsx) con Rick and Morty API:', error.message || error);
    let errorMessage = "No se pudieron cargar los personajes. Verifica tu conexión a internet.";
    if (error.cause && error.cause.code === 'ETIMEDOUT') {
        errorMessage = "Tiempo de espera agotado al intentar conectar con la API de Rick and Morty. Posible problema de red o API no disponible.";
    } else if (error.message.includes('HTTP')) {
        errorMessage = `Error del servidor al cargar personajes: ${error.message}.`;
    }
    return {
      props: {
        characters: [],
        error: errorMessage,
      },
    };
  }
};

export default HomePage;

