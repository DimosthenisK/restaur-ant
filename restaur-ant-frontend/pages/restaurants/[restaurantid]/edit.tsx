import { getSession, useSession } from 'next-auth/react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import Header from '../../../components/layout/Header';
import { getAuth, patchAuth } from '../../../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface RestaurantEditProps {
  restaurant: {
    id: string;
    name: string;
    address: string;
    phone: string;
    description: string;
  };
}

export interface EditRestaurantFormData {
  name: string;
  address: string;
  phone: string;
  description: string;
}

export interface EditRestaurantBadResponse {
  success: false;
  message: string;
  errorCode: string;
}
export interface EditRestaurantOKResponse {
  success: true;
}

const RestaurantEdit: NextPage<RestaurantEditProps> = ({ restaurant }) => {
  const { data: session, status } = useSession({ required: true });
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues: { ...restaurant, global: "" } });

  const handleFormSubmit = async (data: EditRestaurantFormData) => {
    try {
      const response = await patchAuth<
        EditRestaurantOKResponse | EditRestaurantBadResponse
      >(
        `/restaurant/${restaurant.id}`,
        {
          name: data.name,
          phone: data.phone,
          address: data.address,
          description: data.description,
        },
        session?.backToken as string
      );

      if (response && response.status === 200) {
        Router.push("/");
      } else throw new Error("Failed, please try again later");
    } catch (err: any) {
      setError("global", {
        type: "manual",
        message: err.message,
      });
    }
  };
  return (
    <Header
      pageTitle={`Edit ${restaurant.name}`}
      breadcrumbs={["Restaurants", restaurant.name, "Edit"]}
    >
      <div className="h-full pb-16 pt-4">
        <div className="flex flex-col items-center justify-center">
          <div className="shadow-xl rounded xl:w-2/5 lg:w-1/2 sm:w-4/5 w-full p-10 bg-red-800 mt-10">
            <p
              tabIndex={0}
              role="heading"
              className="text-2xl font-bold leading-6 text-white"
            >
              Edit {restaurant.name}
            </p>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="flex flex-row flex-wrap">
                <div className="mt-3 w-full">
                  <label className="text-sm font-medium leading-none text-white">
                    Name
                  </label>
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
                <div className="mt-3 w-full sm:w-1/2 pr-1">
                  <label className="text-sm font-medium leading-none text-white">
                    Phone
                  </label>
                  <div className="relative flex items-center justify-center">
                    <input
                      {...register("phone", {
                        required: true,
                        minLength: 8,
                        maxLength: 255,
                      })}
                      role="input"
                      type="phone"
                      name="phone"
                      className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    />
                  </div>
                </div>
                <div className="mt-3 w-full sm:w-1/2 pl-1">
                  <label className="text-sm font-medium leading-none text-white">
                    Address
                  </label>
                  <div className="relative flex items-center justify-center">
                    <input
                      {...register("address", {
                        required: true,
                        minLength: 3,
                        maxLength: 255,
                      })}
                      role="input"
                      type="text"
                      name="address"
                      className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    />
                  </div>
                </div>
                <div className="mt-3 w-full">
                  <label className="text-sm font-medium leading-none text-white">
                    Description
                  </label>
                  <div className="relative flex items-center justify-center">
                    <input
                      {...register("description", {
                        required: true,
                        minLength: 1,
                        maxLength: 255,
                      })}
                      role="input"
                      type="textarea"
                      name="description"
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
    const getRestaurantResponse = await getAuth(
      `/restaurant/${context.params?.restaurantid}`,
      session.backToken
    );
    if (!getRestaurantResponse.data.success) {
      throw getRestaurantResponse.data.message;
    }

    return {
      props: {
        restaurant: getRestaurantResponse.data.data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default RestaurantEdit;
