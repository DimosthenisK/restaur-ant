import Head from 'next/head';
import styles from '../styles/Home.module.css';
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
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
  );
};

export default Home;
