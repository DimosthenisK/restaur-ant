import { format } from 'date-fns';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { ActionButton, Modal } from '../../../../../components/common';
import Header from '../../../../../components/layout/Header';
import useModal from '../../../../../hooks/useModal';
import { deleteAuth, getAuth, patchAuth } from '../../../../../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface ReviewEditProps {
  restaurant: {
    id: string;
    name: string;
    rating: number;
    description: string;
  };
  review: {
    id: string;
    rating: number;
    comment: string;
    dateOfVisit: string;
  };
}

export interface EditReviewFormData {
  dateOfVisit: string;
  rating: number;
  comment: string;
}

export interface EditReviewBadResponse {
  success: false;
  message: string;
  errorCode: string;
}
export interface EditReviewOKResponse {
  success: true;
}

const ReviewAdd: NextPage<ReviewEditProps> = ({ restaurant, review }) => {
  const { data: session, status } = useSession({ required: true });
  const { isShowing: isDeleteModalShowing, toggle: toggleDeleteModal } =
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
      dateOfVisit: format(new Date(review.dateOfVisit), "yyyy-MM-dd"),
      rating: review.rating,
      comment: review.comment,
      global: "",
    },
  });

  const deleteHandler = async () => {
    try {
      const deleteResponse = await deleteAuth(
        `/restaurant/${restaurant.id}/review/${review.id}`,
        session?.backToken as string
      );
      if (deleteResponse.status === 200) {
        toggleDeleteModal();
        Router.push(`/restaurants/${restaurant.id}/reviews`);
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
      </div>
    );
  }

  const handleFormSubmit = async (data: EditReviewFormData) => {
    try {
      const response = await patchAuth<
        EditReviewOKResponse | EditReviewBadResponse
      >(
        `/restaurant/${restaurant.id}/review/${review.id}`,
        {
          dateOfVisit: data.dateOfVisit,
          rating: Number(data.rating),
          comment: data.comment,
        },
        session?.backToken as string
      );

      if (response && response.status === 200) {
        Router.push(`/restaurants/${restaurant.id}/reviews`);
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
        pageTitle={`Edit review for ${restaurant.name}`}
        breadcrumbs={["Restaurants", restaurant.name, "Edit Review"]}
        actions={actions}
      >
        <div className="h-full pb-16 pt-4">
          <div className="flex flex-col items-center justify-center">
            <div className="shadow-xl rounded xl:w-2/5 lg:w-1/2 sm:w-4/5 w-full p-10 bg-red-800 mt-10">
              <p
                tabIndex={0}
                role="heading"
                className="text-2xl font-bold leading-6 text-white line-clamp-1"
              >
                Edit a review for {restaurant.name}
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
      <Modal
        title={`Delete this review`}
        description="Are you sure you want to delete this review? This action is permanent and cannot be undone."
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
    const getRestaurantResponse = await getAuth(
      `/restaurant/${context.params?.restaurantid}`,
      session.backToken
    );
    if (!getRestaurantResponse.data.success) {
      throw getRestaurantResponse.data.message;
    }
    const getReviewResponse = await getAuth(
      `/restaurant/${context.params?.restaurantid}/review/${context.params?.reviewid}`,
      session.backToken
    );
    if (!getReviewResponse.data.success) {
      throw getReviewResponse.data.message;
    }
    console.log(getReviewResponse.data);

    return {
      props: {
        restaurant: getRestaurantResponse.data.data,
        review: getReviewResponse.data.data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default ReviewAdd;
