import React, { useState } from 'react';
import Nav from './Nav';

interface props {
  children: any;
}

export default function Layout({ children }: props) {
  const [profile, setProfile] = useState(false);
  return (
    <>
      <div className="bg-gray-200 pb-10 h-full">
        <Nav />
        {/* Page title starts */}
        <div className="bg-red-800 pt-8 pb-16 relative z-10">
          <div className="container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="flex-col flex lg:flex-row items-start lg:items-center">
              <div className="ml-0 my-6 lg:my-0">
                <h4 className="text-2xl font-bold leading-tight text-white mb-2">
                  Restaurants
                </h4>
                <p className="flex items-center text-gray-300 text-xs">
                  <span>Home</span>
                  <span className="mx-2">&gt;</span>
                  <span>Restaurants</span>
                </p>
              </div>
            </div>
            <div>
              <button className="focus:outline-none transition duration-150 ease-in-out hover:bg-green-700 border bg-green-600 rounded text-white px-8 py-2 text-sm">
                Add New
              </button>
            </div>
          </div>
        </div>
        {/* Page title ends */}
        <div className="container px-6 mx-auto">
          {/* Remove class [ h-64 ] when adding a card block */}
          <div className="rounded shadow relative bg-white z-10 -mt-8 mb-8 w-full h-64">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
