import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import { ActionButton, StarRatingDefinitions } from '../../components/common';
import { Restaurant } from '../../components/index/Restaurant';
import Header from '../../components/layout/Header';
import { getAuth } from '../../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface RestaurantsListProps {
  page: number;
  restaurants: any[];
}

const RestaurantsList: NextPage<RestaurantsListProps> = ({
  page,
  restaurants,
}) => {
  const { data: session, status } = useSession({ required: true });

  let actions;
  if (session && session.user.role === "ADMIN") {
    actions = (
      <div className="flex">
        <ActionButton
          onClick={() => Router.push(`/restaurants/add`)}
          label="Add"
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
      <Header
        pageTitle="Restaurants"
        breadcrumbs={["Restaurants"]}
        actions={actions}
      >
        <div>
          <StarRatingDefinitions />
          <div className="flex flex-row justify-center flex-wrap w-full">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="p-2 w-full lg:w-1/2 xl:w-1/3">
                <Restaurant
                  id={restaurant.id}
                  name={restaurant.name}
                  rating={restaurant._avgrating}
                  description={restaurant.description}
                ></Restaurant>
              </div>
            ))}
          </div>
          <div className="flex flew-row items-center justify-center pt-5">
            <button
              className="px-3 py-2 bg-gray-800 text-white text-sm font-bold uppercase rounded disabled:opacity-75"
              onClick={() =>
                Router.push(`/restaurants?page=${Number(page) - 1}`)
              }
              disabled={page === 1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M20,10V14H11L14.5,17.5L12.08,19.92L4.16,12L12.08,4.08L14.5,6.5L11,10H20Z"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold mx-4">{page}</h1>
            <button
              className="px-3 py-2 bg-gray-800 text-white text-sm font-bold uppercase rounded disabled:opacity-75"
              onClick={() =>
                Router.push(`/restaurants?page=${Number(page) + 1}`)
              }
              disabled={restaurants.length < 12}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4,10V14H13L9.5,17.5L11.92,19.92L19.84,12L11.92,4.08L9.5,6.5L13,10H4Z"
                />
              </svg>
            </button>
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
  try {
    const getRestaurantsResponse = await getAuth(
      `/restaurant/${context.query?.page || 1}`,
      session.backToken
    );
    if (!getRestaurantsResponse.data.success) {
      throw getRestaurantsResponse.data.message;
    }

    return {
      props: {
        page: context.query?.page || 1,
        restaurants: getRestaurantsResponse.data.data,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
};

export default RestaurantsList;
