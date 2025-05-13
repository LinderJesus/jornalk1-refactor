import React from 'react';
import Link from 'next/link';
import { OptimizedImage } from './';

type CategoryCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
};

const CategoryCard = ({ title, description, imageUrl, slug }: CategoryCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <OptimizedImage
          src={imageUrl}
          alt={title}
          fill
          objectFit="cover"
          category={title}
          title={title}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-4 text-center">{description}</p>
        <div className="text-center">
          <Link 
            href={`/${slug}`} 
            className="inline-block bg-white text-primary border border-primary px-4 py-2 rounded font-medium hover:bg-primary hover:text-white transition-colors"
          >
            Ver notícias
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
