import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '../components/layout/Header';
import type { GetServerSideProps, NextPage } from "next";

export interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
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
      <Header pageTitle="Restaurants" breadcrumbs={["Restaurants"]}>
        <div></div>
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
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/restaurants",
      },
    };
  }
};

export default Home;
