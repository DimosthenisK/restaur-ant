import { signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return <></>;
  }

  return (
    <div className="w-full h-full flex" onClick={() => signOut()}>
      <div
        aria-haspopup="true"
        className="cursor-pointer w-full flex items-center justify-end relative"
      >
        <img
          className="rounded-full h-10 w-10 object-cover"
          src={`https://eu.ui-avatars.com/api/?background=0D8ABC&color=fff&name=${session.user?.name}`}
          alt="avatar"
        />
        <p className="text-gray-800 text-sm ml-3">{session.user?.name}</p>
      </div>
    </div>
  );
}
