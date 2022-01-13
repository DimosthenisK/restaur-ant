import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import Header from '../../components/layout/Header';
import { getAuth } from '../../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface UsersProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

const Users: NextPage<UsersProps> = ({ users }) => {
  const { data: session, status } = useSession({ required: true });
  return (
    <>
      <Head>
        <title>RestaurAnt</title>
        <meta
          name="description"
          content="RestaurAnt is a service to rank the best restaurants around your area"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header pageTitle="Users" breadcrumbs={["Users"]}>
        <div className="flex flex-row flex-wrap items-center justify-center">
          {users.map((user) => (
            <div key={user.id} className="w-full md:w-1/3 p-3 lg:w-1/4">
              <div className="flex flex-col flex-wrap w-full bg-red-800 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-white text-center">
                  {user.name}
                </h2>
                <h2 className="text-lg text-white text-center">{user.email}</h2>
                <div className="flex justify-center w-full mt-2">
                  <button
                    className="px-3 py-2 bg-gray-800 text-white text-sm font-bold uppercase rounded"
                    onClick={() => {
                      user.id === session?.user.id
                        ? Router.push(`/me`)
                        : Router.push(`/users/${user.id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Header>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
    };
  } else if (session.user.role !== "ADMIN") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
        notFound: true,
      },
    };
  }

  try {
    const getUserResponse = await getAuth(`/user`, session.backToken);
    if (!getUserResponse.data.success) {
      throw getUserResponse.data.message;
    }

    return {
      props: {
        users: getUserResponse.data.data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default Users;
