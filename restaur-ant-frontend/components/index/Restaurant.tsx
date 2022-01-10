import Link from 'next/link';
import React from 'react';
import { Rating } from '../common';

interface props {
  id: string;
  name: string;
  rating: number;
  description: string;
}

export const Restaurant = ({ id, name, rating, description }: props) => {
  return (
    <div className="flex bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="w-full p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-gray-900 font-bold text-3xl text-ellipsis max-w-1/2 line-clamp-1">
            {name}
          </h1>
          <div className="flex item-center max-w-1/2">
            <Rating rating={rating} />
          </div>
        </div>
        <p className="mt-2 text-gray-600 h-24 sm:h-16 md:h-12 lg:h-36 text-ellipsis">
          {description}
        </p>
        <div className="flex flex-row-reverse mt-3">
          <Link href={`/restaurants/${id}`}>
            <button className="px-3 py-2 bg-gray-800 text-white text-sm font-bold uppercase rounded justify-self-end">
              View More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
