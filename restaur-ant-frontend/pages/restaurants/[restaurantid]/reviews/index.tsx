import { format, parseISO } from 'date-fns';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import { Rating, StarRatingDefinitions } from '../../../../components/common';
import Header from '../../../../components/layout/Header';
import { getAuth } from '../../../../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface ReviewIndexProps {
  restaurant: {
    id: string;
    name: string;
    rating: number;
    description: string;
  };
  reviews: Array<{
    id: string;
    dateOfVisit: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: string;
    user: { id: string; name: string };
  }>;
}

const ReviewIndex: NextPage<ReviewIndexProps> = ({ restaurant, reviews }) => {
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
      <StarRatingDefinitions fillColor="fff" />
      <Header
        pageTitle={`View reviews for ${restaurant.name}`}
        breadcrumbs={["Restaurants", restaurant.name, "View Reviews"]}
      >
        <div className="w-full flex flex-row flex-wrap items-center">
          {reviews.map((review) => (
            <div key={review.id} className="w-full lg:w-1/2">
              <div className="h-[20rem] md:h-64 flex flex-col justify-between bg-white dark:bg-red-800 rounded-lg border border-red-700 m-2 py-5 px-4">
                <div>
                  <div className="flex flex-row justify-between content-center mb-3">
                    <h2 className="text-gray-800 dark:text-gray-100 font-bold inline text-xl">
                      {review.user.name}
                    </h2>
                    <Rating rating={review.rating} size={36} />
                  </div>
                  <div className="flex flex-row justify-between content-center mb-3">
                    <h2 className="text-gray-800 dark:text-gray-100 font-bold inline">
                      {format(parseISO(review.dateOfVisit), "PPPP")}
                    </h2>
                  </div>

                  <p className="text-gray-800 dark:text-gray-100 text-sm line-clamp-5">
                    {review.comment}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-gray-800 w-full">
                    <p className="w-full md:w-1/2 text-xs dark:text-gray-100">
                      Created At {format(parseISO(review.createdAt), "PPPP")}
                    </p>

                    <div className="w-full md:w-1/2 flex justify-end">
                      <div className="flex flex-row justify-between">
                        {session?.user.role === "ADMIN" && (
                          <button
                            className="px-3 py-2 bg-gray-800 text-white text-sm font-bold uppercase rounded justify-self-end"
                            onClick={() =>
                              Router.push(
                                `/restaurants/${restaurant.id}/reviews/${review.id}/edit`
                              )
                            }
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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
  }

  try {
    const getRestaurantResponse = await getAuth(
      `/restaurant/${context.params?.restaurantid}`,
      session.backToken
    );
    if (!getRestaurantResponse.data.success) {
      throw getRestaurantResponse.data.message;
    }

    const getReviewsResponse = await getAuth(
      `/restaurant/${context.params?.restaurantid}/review/all`,
      session.backToken
    );
    if (!getReviewsResponse.data.success) {
      throw getReviewsResponse.data.message;
    }

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

export default ReviewIndex;
