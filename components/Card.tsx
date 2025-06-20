import React from 'react';

interface CardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

/**
 * Componente reutilizable para mostrar una tarjeta con título, descripción y un enlace.
 * Utiliza Tailwind CSS para el estilo.
 */
const Card: React.FC<CardProps> = ({ title, description, link, linkText }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-80 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
      <a
        href={link}
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-300"
      >
        {linkText}
      </a>
    </div>
  );
};

export default Card;