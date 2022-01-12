import React from 'react';
import Nav from './Nav';

interface props {
  children: any;
}

export default function Layout({ children }: props) {
  return (
    <>
      <div className="bg-gray-200 pb-10 h-full min-h-screen">
        <Nav />
        {children}
      </div>
    </>
  );
}
