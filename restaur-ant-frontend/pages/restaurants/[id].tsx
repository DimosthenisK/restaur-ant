import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { StarRatingDefinitions } from '../../components/common';
import Header from '../../components/layout/Header';
import type { GetServerSideProps, NextPage } from "next";

export interface props {
  restaurant: {
    id: string;
    name: string;
    rating: number;
    description: string;
  };
}

const RestaurantView: NextPage = ({ restaurant }: props) => {
  const { data: session, status } = useSession({ required: true });

  return (
    <Header
      pageTitle={restaurant.name}
      breadcrumbs={["Restaurants", restaurant.name]}
    >
      <Head>
        <title>RestaurAnt</title>
        <meta
          name="description"
          content="RestaurAnt is a service to rank the best restaurants around your area"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StarRatingDefinitions />
    </Header>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      restaurant: {
        id: "1",
        name: "Restaurant 1",
        rating: 4,
        description: "This is a description for Restaurant 1",
      },
    },
  };
};

export default RestaurantView;
