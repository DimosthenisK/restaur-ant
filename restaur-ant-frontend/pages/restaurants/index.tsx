import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Router from 'next/router';
import { ActionButton, StarRatingDefinitions } from '../../components/common';
import { Restaurant } from '../../components/index/Restaurant';
import Header from '../../components/layout/Header';
import { getAuth } from '../../utils/api';
import type { GetServerSideProps, NextPage } from "next";

export interface RestaurantsListProps {
  restaurants: any[];
}

const RestaurantsList: NextPage<RestaurantsListProps> = ({ restaurants }) => {
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
      `/restaurant/1`,
      session.backToken
    );
    if (!getRestaurantsResponse.data.success) {
      throw getRestaurantsResponse.data.message;
    }

    return {
      props: {
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
