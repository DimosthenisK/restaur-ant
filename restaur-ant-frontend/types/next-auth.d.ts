import 'next-auth';

declare module "next-auth" {
  interface Session {
    backToken: string;
    user: {
      token: string;
      id: string;
      name: string;
      email: string;
      role: "USER" | "ADMIN";
      keepLoggedIn: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    backToken: string;
    role: "USER" | "ADMIN";
  }
}
