import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import Header from '../../../../components/layout/Header';
import { getAuth, postAuth } from '../../../../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface ReviewAddProps {
  restaurant: {
    id: string;
    name: string;
    rating: number;
    description: string;
  };
}

export interface CreateReviewFormData {
  dateOfVisit: string;
  rating: number;
  comment: string;
}

export interface CreateReviewBadResponse {
  error: string;
  ok: false;
  status: number;
  url: null;
}
export interface CreateReviewOKResponse {
  error: null;
  ok: true;
  status: number;
  url: string;
}

const ReviewAdd: NextPage<ReviewAddProps> = ({ restaurant }) => {
  const { data: session, status } = useSession({ required: true });
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data: CreateReviewFormData) => {
    try {
      const response = await postAuth<
        CreateReviewOKResponse | CreateReviewBadResponse
      >(
        `/restaurant/${restaurant.id}/review`,
        {
          dateOfVisit: data.dateOfVisit,
          rating: Number(data.rating),
          comment: data.comment,
        },
        session?.backToken as string
      );

      if (response && response.status === 201) {
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
        pageTitle={`Add review for ${restaurant.name}`}
        breadcrumbs={["Restaurants", restaurant.name, "Add Review"]}
      >
        <div className="h-full pb-16 pt-4">
          <div className="flex flex-col items-center justify-center">
            <div className="shadow-xl rounded xl:w-2/5 lg:w-1/2 sm:w-4/5 w-full p-10 bg-red-800 mt-10">
              <p
                tabIndex={0}
                role="heading"
                className="text-2xl font-bold leading-6 text-white line-clamp-1"
              >
                Add a review for {restaurant.name}
              </p>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex flex-row flex-wrap">
                  <div className="mt-3 w-full sm:w-1/2 pr-1">
                    <label className="text-sm font-medium leading-none text-white">
                      Rating
                    </label>
                    <datalist id="validRating">
                      <option value="1" />
                      <option value="2" />
                      <option value="3" />
                      <option value="4" />
                      <option value="5" />
                    </datalist>
                    <input
                      {...register("rating", {
                        required: true,
                        min: 1,
                        max: 5,
                      })}
                      role="input"
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      list="validRating"
                      className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                    />
                  </div>
                  <div className="mt-3 w-full sm:w-1/2 pl-1">
                    <label className="text-sm font-medium leading-none text-white">
                      Date of Visit
                    </label>
                    <div className="relative flex items-center justify-center">
                      <input
                        {...register("dateOfVisit", {
                          required: true,
                        })}
                        role="input"
                        type="date"
                        name="dateOfVisit"
                        min="1970-01-01"
                        max={new Date().toISOString().split("T")[0]}
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
                        {...register("comment", {
                          required: true,
                          minLength: 1,
                          maxLength: 255,
                        })}
                        role="input"
                        type="textarea"
                        name="comment"
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
  } else if (session.user.role !== "USER") {
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

export default ReviewAdd;
