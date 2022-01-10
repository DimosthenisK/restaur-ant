import React from 'react';

export default function Profile() {
  return (
    <div className="w-full h-full flex">
      <div
        aria-haspopup="true"
        className="cursor-pointer w-full flex items-center justify-end relative"
      >
        <img
          className="rounded-full h-10 w-10 object-cover"
          src="https://eu.ui-avatars.com/api/?background=0D8ABC&color=fff&name=admin"
          alt="avatar"
        />
        <p className="text-gray-800 text-sm ml-3">Jane Doe</p>
      </div>
    </div>
  );
}
