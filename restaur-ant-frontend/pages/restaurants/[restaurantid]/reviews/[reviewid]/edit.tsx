import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '../../../../../components/layout/Header';
import type { GetServerSideProps, NextPage } from "next";

export interface ReviewEditProps {
  review: {
    id: string;
    name: string;
    rating: number;
    description: string;
  };
}

const ReviewEdit: NextPage<ReviewEditProps> = ({ review }) => {
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
        pageTitle={review.id}
        breadcrumbs={["Restaurants", review.id]}
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
  } else if (session.user.role !== "ADMIN") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
        notFound: true,
      },
    };
  }

  return {
    props: {
      review: {
        id: "1",
        name: "Restaurant 1",
        rating: 4,
        description: "This is a description for Restaurant 1",
      },
    },
  };
};

export default ReviewEdit;
