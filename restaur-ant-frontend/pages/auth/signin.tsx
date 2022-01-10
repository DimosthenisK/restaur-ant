import { GetServerSideProps } from 'next';
import { getCsrfToken } from 'next-auth/react';
import Header from '../../components/layout/Header';

export interface SignInProps {
  csrfToken: string;
}

export default function SignIn({ csrfToken }) {
  return (
    <Header pageTitle="Sign In" breadcrumbs={["Authentication", "Sign In"]}>
      <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </Header>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};
