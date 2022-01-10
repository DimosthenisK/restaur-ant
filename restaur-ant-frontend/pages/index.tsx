import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '../components/layout/Header';
import styles from '../styles/Home.module.css';
import type { NextPage } from "next";

const Home: NextPage = () => {
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
      </div>
    </Header>
  );
};

export default Home;
