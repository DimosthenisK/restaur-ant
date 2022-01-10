import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { StarRatingDefinitions } from '../components/common';
import { Restaurant } from '../components/index/Restaurant';
import Header from '../components/layout/Header';
import styles from '../styles/Home.module.css';
import type { GetServerSideProps, NextPage } from "next";

export interface props {
  restaurants: any[];
  children: any[];
}

const Home: NextPage = ({ restaurants }: props) => {
  const { data: session, status } = useSession({ required: true });

  return (
    <Header pageTitle="Restaurants" breadcrumbs={["Restaurants"]}>
      <div className={styles.container}>
        <Head>
          <title>RestaurAnt</title>
          <meta
            name="description"
            content="RestaurAnt is a service to rank the best restaurants around your area"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <StarRatingDefinitions />
        <div className="flex flex-row justify-center flex-wrap w-full">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="p-2 w-full lg:w-1/2 xl:w-1/3">
              <Restaurant
                id={restaurant.id}
                name={restaurant.name}
                rating={restaurant.rating}
                description={restaurant.description}
              ></Restaurant>
            </div>
          ))}
        </div>
      </div>
    </Header>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      restaurants: [
        {
          id: "1",
          name: "Restaurant 1",
          rating: 4,
          description: "This is a description for Restaurant 1",
        },
        {
          id: "2",
          name: "Restaurant 2",
          rating: 3,
          description: "This is a description for Restaurant 2",
        },
        {
          id: "3",
          name: "Restaurant 3",
          rating: 3,
          description: "This is a description for Restaurant 3",
        },
        {
          id: "4",
          name: "Restaurant 4",
          rating: 3,
          description: "This is a description for Restaurant 4",
        },
      ],
    },
  };
};

export default Home;
