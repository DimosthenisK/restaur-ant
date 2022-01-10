import { signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function LogOut() {
  const { data: session } = useSession();

  if (!session) {
    return <></>;
  }

  return (
    <div className="w-full h-full flex" onClick={() => signOut()}>
      <div
        aria-haspopup="true"
        className="cursor-pointer w-full flex items-center justify-end relative"
      ></div>
    </div>
  );
}
