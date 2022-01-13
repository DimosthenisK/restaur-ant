import { format, parseISO } from 'date-fns';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import Header from '../../components/layout/Header';
import useModal from '../../hooks/useModal';
import { deleteAuth, getAuth } from '../../utils/api';
import type { GetServerSideProps, NextPage } from "next";
import {
  ActionButton,
  Modal,
  Rating,
  StarRatingDefinitions,
} from "../../components/common";
export interface RestaurantViewProps {
  restaurant: {
    id: string;
    name: string;
    rating: number;
    description: string;
  };
  reviews: Object;
}

const RestaurantView: NextPage<RestaurantViewProps> = ({
  restaurant,
  reviews,
}) => {
  const { data: session, status } = useSession({ required: true });
  const { isShowing: isDeleteModalShowing, toggle: toggleDeleteModal } =
    useModal(false);
  const {
    isShowing: isSomethingWentWrongModalShowing,
    toggle: toggleSomethingWentWrongModal,
  } = useModal(false);
  console.log(session);
  const deleteHandler = async () => {
    try {
      const deleteResponse = await deleteAuth(
        `/restaurant/${restaurant.id}`,
        session?.backToken as string
      );
      if (deleteResponse.status === 200) {
        toggleDeleteModal();
        Router.push("/restaurants");
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
        <ActionButton
          onClick={() => Router.push(`/restaurants/${restaurant.id}/reviews`)}
          label="View all reviews"
        />
        <ActionButton
          onClick={() => Router.push(`/restaurants/${restaurant.id}/edit`)}
          label="Edit"
        />
        <ActionButton onClick={toggleDeleteModal} label="Delete" />
      </div>
    );
  }
  if (session && session.user.role === "USER") {
    actions = (
      <div className="flex">
        <ActionButton
          onClick={() =>
            Router.push(`/restaurants/${restaurant.id}/reviews/add`)
          }
          label="Add Review"
        />
      </div>
    );
  }

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
      <StarRatingDefinitions fillColor="fff" />
      <Header
        pageTitle={restaurant.name}
        breadcrumbs={["Restaurants", restaurant.name]}
        actions={actions}
      >
        {reviews.latest ? (
          <div className="flex flex-row flex-wrap items-center">
            <div className="w-full lg:w-1/2">
              <div className="h-64 flex flex-col justify-between bg-white dark:bg-red-800 rounded-lg border border-red-700 m-6 py-5 px-4">
                <div>
                  <h2 className="text-gray-800 dark:text-gray-100 font-bold mb-3 text-xl">
                    Overall Rating
                  </h2>
                  <Rating rating={reviews.averageRating} size={64} />
                </div>
                <div>
                  <div className="flex items-center justify-between text-gray-800">
                    <p className="text-xs dark:text-gray-100">
                      Based on {reviews.totalReviews} review
                      {reviews.totalReviews > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="h-64 flex flex-col justify-between bg-white dark:bg-red-800 rounded-lg border border-red-700 m-6 py-5 px-4">
                <div>
                  <div className="flex flex-row justify-between content-center mb-3">
                    <h2 className="text-gray-800 dark:text-gray-100 font-bold inline text-xl">
                      Latest Rating
                    </h2>
                    <Rating rating={reviews.latest.rating} size={36} />
                  </div>
                  <div className="flex flex-row justify-between content-center mb-3">
                    <h2 className="text-gray-800 dark:text-gray-100 font-bold inline">
                      {reviews.latest.user.name}
                    </h2>
                  </div>

                  <p className="text-gray-800 dark:text-gray-100 text-sm line-clamp-5">
                    {reviews.latest.comment}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-gray-800">
                    <p className="text-xs dark:text-gray-100">
                      Submitted{" "}
                      {format(parseISO(reviews.latest.createdAt), "PPPP")}
                    </p>
                    <p className="text-xs dark:text-gray-100">
                      Date of Visit{" "}
                      {format(parseISO(reviews.latest.dateOfVisit), "PPPP")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="h-64 flex flex-col justify-between bg-white dark:bg-red-800 rounded-lg border border-red-700 m-6 py-5 px-4">
                <div>
                  <div className="flex flex-row justify-between content-center mb-3">
                    <h2 className="text-gray-800 dark:text-gray-100 font-bold inline text-xl">
                      Worst Rating
                    </h2>
                    <Rating rating={reviews.lowestReview.rating} size={36} />
                  </div>
                  <div className="flex flex-row justify-between content-center mb-3">
                    <h2 className="text-gray-800 dark:text-gray-100 font-bold inline">
                      {reviews.lowestReview.user.name}
                    </h2>
                  </div>

                  <p className="text-gray-800 dark:text-gray-100 text-sm line-clamp-5">
                    {reviews.lowestReview.comment}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-gray-800">
                    <p className="text-xs dark:text-gray-100">
                      Submitted{" "}
                      {format(parseISO(reviews.lowestReview.createdAt), "PPPP")}
                    </p>
                    <p className="text-xs dark:text-gray-100">
                      Date of Visit{" "}
                      {format(
                        parseISO(reviews.lowestReview.dateOfVisit),
                        "PPPP"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="h-64 flex flex-col justify-between bg-white dark:bg-red-800 rounded-lg border border-red-700 m-6 py-5 px-4">
                <div>
                  <div className="flex flex-row justify-between content-center mb-3">
                    <h2 className="text-gray-800 dark:text-gray-100 font-bold inline text-xl">
                      Best Rating
                    </h2>
                    <Rating rating={reviews.highestReview.rating} size={36} />
                  </div>
                  <div className="flex flex-row justify-between content-center mb-3">
                    <h2 className="text-gray-800 dark:text-gray-100 font-bold inline">
                      {reviews.highestReview.user.name}
                    </h2>
                  </div>

                  <p className="text-gray-800 dark:text-gray-100 text-sm line-clamp-5">
                    {reviews.highestReview.comment}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-gray-800">
                    <p className="text-xs dark:text-gray-100">
                      Submitted{" "}
                      {format(
                        parseISO(reviews.highestReview.createdAt),
                        "PPPP"
                      )}
                    </p>
                    <p className="text-xs dark:text-gray-100">
                      Date of Visit{" "}
                      {format(
                        parseISO(reviews.highestReview.dateOfVisit),
                        "PPPP"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-red-800 font-bold text-xl">
              No reviews found for this restaurant
            </h2>
          </div>
        )}
      </Header>
      <Modal
        title={`Delete ${restaurant.name}`}
        description="Are you sure you want to delete this restaurant? This action is permanent and cannot be undone."
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
    console.log(getRestaurantResponse.data);

    const getReviewsResponse = await getAuth(
      `/restaurant/${context.params?.restaurantid}/review`,
      session.backToken
    );
    if (!getReviewsResponse.data.success) {
      throw getReviewsResponse.data.message;
    }
    console.log(getReviewsResponse.data);

    return {
      props: {
        restaurant: getRestaurantResponse.data.data,
        reviews: getReviewsResponse.data.data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

export default RestaurantView;
