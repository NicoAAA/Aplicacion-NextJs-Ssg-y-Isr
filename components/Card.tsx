// components/Card.tsx
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
  imageUrl?: string; // Agregamos una prop para la URL de la imagen
  imageAlt?: string; // Agregamos una prop para el texto alternativo de la imagen
}

/**
 * Componente reutilizable para mostrar una tarjeta con título, descripción, imagen y un enlace.
 * Utiliza Tailwind CSS para el estilo.
 */
const Card: React.FC<CardProps> = ({ title, description, link, linkText, imageUrl, imageAlt }) => {
  return (
    <div className="bg-[#262c3a] rounded-lg shadow-lg p-6 m-4 w-80 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt || title}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
          onError={(e) => {
            // Placeholder si la imagen falla al cargar
            e.currentTarget.src = `https://placehold.co/400x300/e0e0e0/505050?text=No+Image`;
          }}
        />
      )}
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-100">{title}</h2>
        <p className="text-gray-400 mb-4">{description}</p>
      </div>
      <a
        href={link}
        className="inline-block bg-purple-700 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-300"
      >
        {linkText}
      </a>
    </div>
  );
};

export default Card;
