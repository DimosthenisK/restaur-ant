import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Router from 'next/router';
import React, { useState } from 'react';

export default function Profile() {
  const { data: session } = useSession();
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  if (!session) {
    return <></>;
  }

  const handleSignOut = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: "/auth/signin",
    });
    Router.push(data.url);
  };

  return (
    <div
      className="w-full h-full flex"
      onClick={() => setShowProfileOptions(!showProfileOptions)}
    >
      <div
        aria-haspopup="true"
        className="cursor-pointer w-full flex items-center justify-end relative"
      >
        {showProfileOptions && (
          <ul className="p-2 w-full border-r bg-white absolute rounded z-40 shadow mt-44 ">
            <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
              <Link href="/me">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-user"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx={12} cy={7} r={4} />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  </svg>
                  <span className="ml-2">My Profile</span>
                </div>
              </Link>
            </li>
            <li
              className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 flex items-center focus:text-indigo-700 focus:outline-none"
              onClick={() => handleSignOut()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                aria-labelledby="title"
                aria-describedby="desc"
                role="img"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="20px"
                height="20px"
              >
                <path d="M51 17.25L46.75 13 32 27.75 17.25 13 13 17.25 27.75 32 13 46.75 17.25 51 32 36.25 46.75 51 51 46.75 36.25 32 51 17.25z"></path>
              </svg>
              <span className="ml-2">Sign Out</span>
            </li>
          </ul>
        )}
        <img
          className="rounded-full h-10 w-10 object-cover"
          src={`https://eu.ui-avatars.com/api/?background=991b1b&color=fff&name=${session.user?.name}`}
          alt="avatar"
        />
        <p className="text-gray-800 text-sm ml-3 mr-5">{session.user.name}</p>
      </div>
    </div>
  );
}
