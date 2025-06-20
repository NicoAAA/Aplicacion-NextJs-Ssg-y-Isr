// pages/index.tsx
import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';

// --- Interfaz para los datos de criptomonedas de CoinGecko ---
interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string; // URL de la imagen original del logo de la cripto
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

// --- Interfaz para las props de la página (ahora con nombres de R&M) ---
interface HomePageProps {
  coins: RickAndMortyCoin[];
  error?: string;
}

// --- Nueva interfaz para la moneda con nombre y símbolo de Rick y Morty ---
interface RickAndMortyCoin extends Omit<Coin, 'name' | 'symbol' | 'image'> {
    rickAndMortyName: string;
    rickAndMortySymbol: string;
    rickAndMortyImage: string; // Para la imagen del planeta/icono de R&M
}

// --- Mapeo de criptomonedas reales a monedas de Rick y Morty con IMÁGENES DE PLANETAS/ICONOS ---
const rickAndMortyCoinMap: { [key: string]: { name: string; symbol: string; image: string } } = {
  bitcoin: {
    name: 'Fleebcoin',
    symbol: 'FLB',
    image: '/images/beth-smith.png', // URL de un planeta o icono R&M que tú subas
  },
  ethereum: {
    name: 'Schmeckle',
    symbol: 'SCH',
    image: '/images/jerry-smith.png', // URL de un planeta o icono R&M que tú subas
  },
  tether: {
    name: 'Gromflomite Dabloon',
    symbol: 'GMD',
    image: '/images/personaje-homo-sapiens.png', // URL de un planeta o icono R&M que tú subas
  },
  binancecoin: {
    name: 'Picle-rick Token',
    symbol: 'PRT',
    image: '/images/rick-sanchez-morty-smith-pickle.png', // URL de un planeta o icono R&M que tú subas
  },
  solana: {
    name: 'Unity Shard',
    symbol: 'USH',
    image: '/images/verano-smith.png', // URL de un planeta o icono R&M que tú subas
  },
  // Añade más mapeos si CoinGecko devuelve más de 5 criptos en el top 10
  // Los IDs de CoinGecko son en minúsculas.
  'usd-coin': {
    name: 'Morty Coin',
    symbol: 'MTC',
    image: '/images/morty-smith.png', // Icono de Morty
  },
  ripple: {
    name: 'Mr. Poopybutthole Token',
    symbol: 'MRPBHT',
    image: '/images/rick-sanchez.png', // Icono de Mr. Poopybutthole
  },
  dogecoin: {
    name: 'Butter Robot Coin',
    symbol: 'BTR',
    image: '/images/perro-blanco.png', // Icono del Butter Robot
  },
  // Por defecto, si una criptomoneda no está en el mapa
  default: {
    name: 'Interdimensional Credit',
    symbol: 'IDC',
    image: '/images/rickymorty.png', // Icono de un portal
  },
};

/**
 * Función para transformar una criptomoneda real en una moneda de Rick y Morty.
 */
const transformToRickAndMortyCoin = (coin: Coin): RickAndMortyCoin => {
    // Usamos coin.id para buscar en nuestro mapa, ya que es el identificador único de CoinGecko
    const mapped = rickAndMortyCoinMap[coin.id] || rickAndMortyCoinMap.default;

    return {
        ...coin,
        rickAndMortyName: mapped.name,
        rickAndMortySymbol: mapped.symbol,
        rickAndMortyImage: mapped.image, // Usamos la imagen del planeta/icono de R&M
    };
};

/**
 * Página de inicio que demuestra Server-Side Rendering (SSR)
 * con la API de CoinGecko para precios de criptomonedas en "tiempo real",
 * transformadas en monedas del universo de Rick y Morty.
 */
const HomePage: React.FC<HomePageProps> = ({ coins, error }) => {
  return (
    <Layout title="Next.js SSR: Cripto de Rick y Morty">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        SSR: Valores del Mercado de Wubba Lubba Dub Dub Coins (tiempo real)
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

      {coins.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600 font-bold uppercase text-sm">Moneda Interdimensional</th>
                <th className="py-3 px-4 text-left text-gray-600 font-bold uppercase text-sm">Símbolo</th>
                <th className="py-3 px-4 text-right text-gray-600 font-bold uppercase text-sm">Valor Actual (USD)</th>
                <th className="py-3 px-4 text-right text-gray-600 font-bold uppercase text-sm">Fluctuación 24h (%)</th>
                <th className="py-3 px-4 text-right text-gray-600 font-bold uppercase text-sm">Capitalización Cósmica</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center">
                    {/* Usamos la imagen de Rick y Morty aquí */}
                    <img src={coin.rickAndMortyImage} alt={coin.rickAndMortyName} className="w-6 h-6 mr-2 rounded-full" />
                    {coin.rickAndMortyName}
                  </td>
                  <td className="py-3 px-4">{coin.rickAndMortySymbol}</td>
                  <td className="py-3 px-4 text-right">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className={`py-3 px-4 text-right ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : 'N/A'}%
                  </td>
                  <td className="py-3 px-4 text-right">${coin.market_cap.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p className="text-center text-gray-600">Cargando datos de monedas interdimensionales...</p>
      )}

      <p className="mt-8 text-center text-gray-600 text-sm">
        Esta página usa SSR. Los precios de las monedas interdimensionales se obtienen en el servidor en cada solicitud, garantizando los datos más actuales del multiverso.
      </p>
    </Layout>
  );
};

/**
 * getServerSideProps: Función para obtener datos en el lado del servidor para cada solicitud.
 * Obtiene los precios de las criptomonedas de la API de CoinGecko y las transforma.
 */
export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
    }

    const realCoins: Coin[] = await res.json();
    // Transforma las monedas reales en monedas de Rick y Morty antes de pasarlas a las props
    const rickAndMortyCoins: RickAndMortyCoin[] = realCoins.map(transformToRickAndMortyCoin);

    return {
      props: {
        coins: rickAndMortyCoins,
      },
    };
  } catch (error: any) {
    console.error('Error en getServerSideProps (index.tsx) con CoinGecko API:', error.message || error);
    let errorMessage = "No se pudieron cargar los precios de las monedas interdimensionales. Verifica tu conexión a internet.";
    if (error.cause && error.cause.code === 'ETIMEDOUT') {
      errorMessage = "Tiempo de espera agotado al intentar conectar con la API. Posible problema de red o API no disponible.";
    } else if (error.message.includes('HTTP')) {
      errorMessage = `Error del servidor al cargar precios: ${error.message}.`;
    }
    return {
      props: {
        coins: [],
        error: errorMessage,
      },
    };
  }
};

export default HomePage;