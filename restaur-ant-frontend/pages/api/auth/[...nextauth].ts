import { decode } from 'jsonwebtoken';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { post } from '../../../utils/api';

export interface UserLoginOKResponse {
  success: true;
  token: string;
}

export interface UserLoginErrorResponse {
  success: false;
  reason: string;
  errorCode: string;
}

export type UserLoginResponse = UserLoginOKResponse | UserLoginErrorResponse;

export default NextAuth({
  secret: "secret",
  pages: { signIn: "/auth/signin" },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.backToken = user?.token as string;
        token.name = user?.name as string;
        token.role = user?.role as "USER" | "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      session.backToken = token.backToken;
      session.user.id = token.sub as string;
      session.user.name = token.name;
      session.user.role = token.role;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        keepLoggedIn: { label: "Remember me", type: "checkbox" },
      },

      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        try {
          const userLoginResponse = await post<UserLoginResponse>(
            "/authentication/login",
            credentials
          );
          const userLoginResponseData = userLoginResponse.data;

          if (userLoginResponseData.success) {
            const user = decode(userLoginResponseData.token, {
              json: true,
            });
            if (user) {
              user.token = userLoginResponseData.token;
              return user;
            }
          }
        } catch (err) {
          console.error(err);
        }
        return null;
      },
    }),
  ],
});
