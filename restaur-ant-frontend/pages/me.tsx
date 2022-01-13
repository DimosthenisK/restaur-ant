import { getSession, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import Header from '../components/layout/Header';
import { patchAuth } from '../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface UserUpdateProps {
  user: {
    name: string;
    email: string;
  };
}

export interface UserUpdateFormData {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateBadResponse {
  success: false;
  message: string;
  errorCode: string;
}
export interface UserUpdateOKResponse {
  success: true;
}

const UserUpdate: NextPage<UserUpdateProps> = ({ user }) => {
  const { data: session, status } = useSession({ required: true });
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      global: "",
      password: "        ",
    },
  });

  const handleSignOut = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: "/auth/signin",
    });
    Router.push(data.url);
  };

  const handleFormSubmit = async (data: UserUpdateFormData) => {
    try {
      const response = await patchAuth<
        UserUpdateOKResponse | UserUpdateBadResponse
      >(
        `/user/${session?.user.id}`,
        {
          name: data.name,
          email: data.email,
          password: data.password !== "        " ? data.password : undefined,
        },
        session?.backToken as string
      );

      if (response && response.status === 200) {
        handleSignOut();
      } else throw new Error("Failed, please try again later");
    } catch (err: any) {
      setError("global", {
        type: "manual",
        message: err.message,
      });
    }
  };

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
      <Header pageTitle={`My Profile`} breadcrumbs={["My Profile"]}>
        <div className="h-full pb-16 pt-4">
          <div className="flex flex-col items-center justify-center">
            <div className="shadow-xl rounded xl:w-2/5 lg:w-1/2 sm:w-4/5 w-full p-10 bg-red-800 mt-10">
              <p
                tabIndex={0}
                role="heading"
                className="text-2xl font-bold leading-6 text-white"
              >
                Edit my profile
              </p>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex flex-row flex-wrap">
                  <div className="mt-3 w-full">
                    <label className="text-sm font-medium leading-none text-white">
                      Name
                    </label>
                    <div className="relative flex items-center justify-center">
                      <input
                        {...register("name", {
                          required: true,
                          minLength: 3,
                          maxLength: 255,
                        })}
                        role="input"
                        type="text"
                        name="name"
                        className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3 w-full">
                    <label className="text-sm font-medium leading-none text-white">
                      Email
                    </label>
                    <div className="relative flex items-center justify-center">
                      <input
                        {...register("email", {
                          required: true,
                          minLength: 3,
                          maxLength: 255,
                        })}
                        role="input"
                        type="email"
                        name="email"
                        className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3 w-full">
                    <label className="text-sm font-medium leading-none text-white">
                      Password
                    </label>
                    <div className="relative flex items-center justify-center">
                      <input
                        {...register("password", {
                          minLength: 8,
                          maxLength: 255,
                        })}
                        role="input"
                        type="password"
                        name="password"
                        className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-5 w-full">
                    <div className="pb-1">
                      <p
                        className={`text-center text-white ${
                          errors.global || "invisible"
                        }`}
                      >
                        {errors.global?.message || "Global Errors"}
                      </p>
                    </div>
                    <button
                      role="button"
                      className="focus:ring-2 focus:ring-offset-2 focus:ring-red-800 text-sm font-semibold leading-none text-white focus:outline-none bg-red-800 border rounded hover:bg-red-900 py-4 w-full"
                      onClick={() => clearErrors()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
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
  }

  return {
    props: {
      user: { name: session.user.name, email: session.user.email },
    },
  };
};

export default UserUpdate;
