import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '../../../components/layout/Header';
import type { GetServerSideProps, NextPage } from "next";

export interface RestaurantEditProps {
  restaurant: {
    id: string;
    name: string;
    rating: number;
    description: string;
  };
}

const RestaurantEdit: NextPage<RestaurantEditProps> = ({ restaurant }) => {
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
      <Header
        pageTitle={restaurant.name}
        breadcrumbs={["Restaurants", restaurant.name]}
      ></Header>
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

export default RestaurantEdit;
