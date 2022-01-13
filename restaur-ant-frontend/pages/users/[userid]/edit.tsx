import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { ActionButton, Modal } from '../../../components/common';
import Header from '../../../components/layout/Header';
import useModal from '../../../hooks/useModal';
import { deleteAuth, getAuth, patchAuth } from '../../../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface UserEditProps {
  user: {
    id: string;
    name: string;
    email: number;
    role: "USER" | "ADMIN";
  };
}

export interface EditUserFormData {
  name: string;
  email: string;
  password: string;
}

export interface EditUserBadResponse {
  success: false;
  message: string;
  errorCode: string;
}
export interface EditUserOKResponse {
  success: true;
}

const ReviewAdd: NextPage<UserEditProps> = ({ user }) => {
  const { data: session, status } = useSession({ required: true });
  const userAltRole = user.role === "ADMIN" ? "USER" : "ADMIN";
  const { isShowing: isDeleteModalShowing, toggle: toggleDeleteModal } =
    useModal(false);
  const { isShowing: isSwitchRoleModalShowing, toggle: toggleSwitchRoleModal } =
    useModal(false);
  const {
    isShowing: isSomethingWentWrongModalShowing,
    toggle: toggleSomethingWentWrongModal,
  } = useModal(false);

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
      password: "        ",
      global: "",
    },
  });

  const switchRoleHandler = async () => {
    try {
      const switchRoleResponse = await patchAuth(
        `/user/${user.id}/role`,
        { role: userAltRole },
        session?.backToken as string
      );
      if (switchRoleResponse.status === 200) {
        toggleSwitchRoleModal();
        Router.push(`/users`);
      }
    } catch (err) {
      console.error(err);
      toggleSwitchRoleModal();
      toggleSomethingWentWrongModal();
    }
  };
  const deleteHandler = async () => {
    try {
      const deleteResponse = await deleteAuth(
        `/user/${user.id}`,
        session?.backToken as string
      );
      if (deleteResponse.status === 200) {
        toggleDeleteModal();
        Router.push(`/users`);
      }
    } catch (err) {
      console.error(err);
      toggleDeleteModal();
      toggleSomethingWentWrongModal();
    }
  };
  let actions;
  if (session && session.user.role === "ADMIN") {
    actions = (
      <div className="flex">
        <ActionButton onClick={toggleDeleteModal} label="Delete" />
        <ActionButton onClick={toggleSwitchRoleModal} label={`Switch Role`} />
      </div>
    );
  }

  const handleFormSubmit = async (data: EditUserFormData) => {
    try {
      const response = await patchAuth<
        EditUserOKResponse | EditUserBadResponse
      >(
        `/user/${user.id}`,
        {
          name: data.name,
          email: data.email,
          password: data.password !== "        " ? data.password : undefined,
        },
        session?.backToken as string
      );

      if (response && response.status === 200) {
        Router.push(`/users`);
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
      <Header
        pageTitle={`Edit user ${user.name}`}
        breadcrumbs={["Restaurants", user.name, "Edit User"]}
        actions={actions}
      >
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
      <Modal
        title={`Delete this user`}
        description="Are you sure you want to delete this user? This action is permanent and cannot be undone."
        theme="danger"
        show={isDeleteModalShowing}
      >
        <>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-red-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm bg-red-800"
            onClick={deleteHandler}
          >
            Proceed
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={toggleDeleteModal}
          >
            Cancel
          </button>
        </>
      </Modal>
      <Modal
        title={`Switch this user's role to ${userAltRole}`}
        description="Are you sure you want to witch this user's role to ${userAltRole}?"
        theme="danger"
        show={isSwitchRoleModalShowing}
      >
        <>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-red-900 shadow-sm px-4 py-2 bg-white text-base font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm bg-red-800"
            onClick={switchRoleHandler}
          >
            Proceed
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={toggleSwitchRoleModal}
          >
            Cancel
          </button>
        </>
      </Modal>
      <Modal
        title={`Something went wrong`}
        description="We're sorry, something went wrong. Please try again later."
        theme="info"
        show={isSomethingWentWrongModalShowing}
        defaultAction={toggleSomethingWentWrongModal}
      ></Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context.params);
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
    };
  }

  try {
    const getUserResponse = await getAuth(
      `/user/${context.params?.userid}`,
      session.backToken
    );
    if (!getUserResponse.data.success) {
      throw getUserResponse.data.message;
    }

    return {
      props: {
        user: getUserResponse.data.data,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};

export default ReviewAdd;
