import { GetServerSideProps } from 'next';
import { getCsrfToken } from 'next-auth/react';
import Link from 'next/link';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import Header from '../../components/layout/Header';
import { post } from '../../utils/api';

export interface SignUpProps {
  csrfToken: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  csrfToken: string;
}

export interface RegisterBadResponse {
  error: string;
  ok: false;
  status: number;
  url: null;
}
export interface RegisterOKResponse {
  error: null;
  ok: true;
  status: number;
  url: string;
}

export default function SignUp({ csrfToken }: SignUpProps) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      const response = await post<RegisterOKResponse | RegisterBadResponse>(
        "/user",
        {
          redirect: false,
          name: data.name,
          email: data.email,
          password: data.password,
          csrfToken: data.csrfToken,
        }
      );

      if (response && response.status === 201) {
        Router.push("/auth/signin?message=Thank you, you may now sign in.");
      } else throw new Error("Email already exists");
    } catch (err: any) {
      setError("global", {
        type: "manual",
        message: err.message,
      });
    }
  };
  return (
    <Header pageTitle="Sign In" breadcrumbs={["Authentication", "Sign In"]}>
      <div className="h-full pb-16 pt-4">
        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="100px"
            height="100px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 100 100"
            xmlSpace="preserve"
          >
            <path
              fill="#000000"
              d="M98.479,32.524c-0.316,0.007-7.81,0.214-14.223,3.062c-6.164,2.739-8.887,2.788-11.135,2.603  c-0.115-0.008-0.226,0.023-0.328,0.069c-0.427-0.325-0.891-0.618-1.394-0.884c7.011-10.117,15.19-15.146,15.274-15.196  c0.334-0.203,0.44-0.636,0.238-0.97c-0.201-0.334-0.636-0.441-0.97-0.239c-0.35,0.211-8.635,5.291-15.862,15.82  c-0.281-0.104-0.553-0.221-0.85-0.304c-4.231-1.188-8.334,0.249-9.164,3.207c-0.242,0.863-0.171,1.761,0.144,2.629  c-1.638-1.27-4.341-1.888-7.32-1.557c-0.263-0.791-0.532-1.618-0.815-2.495c-0.425-1.32-0.633-1.964-0.737-2.201  c-0.081-0.188-0.14-0.371-0.193-0.533c-0.147-0.453-0.333-1.015-0.931-1.094c-0.649-0.076-1.145,0.559-1.749,1.489  c-0.903,1.386-1.446,4.695-1.73,7.03c-0.698,0.483-1.29,1.019-1.753,1.591l-5.294-6.122l-0.163-0.138  c-0.703-0.433-1.323-0.527-1.839-0.287c-0.521,0.242-0.718,0.737-0.787,0.995l-4.869,8.583c-2.217-1.671-3.622-2.521-4.179-2.521  c-0.396,0-1.221,0-16.686,19.254c-0.026,0.046-2.687,4.556-9.741,3.886c-0.391-0.023-0.731,0.249-0.769,0.638  c-0.036,0.389,0.25,0.733,0.639,0.77c0.536,0.05,1.05,0.073,1.542,0.073c6.807,0,9.436-4.456,9.493-4.572  c5.312-6.61,14.002-17.185,15.629-18.577c0.558,0.257,1.89,1.187,3.364,2.297l-1.352,2.382c-3.81,3.355-6.551,8.127-6.619,11.669  l-0.687,1.21c-0.008,0.022-0.804,2.288-4.73,1.428c-0.381-0.08-0.757,0.157-0.842,0.538c-0.084,0.381,0.158,0.758,0.539,0.842  c0.727,0.16,1.376,0.229,1.955,0.229c2.563,0,3.718-1.35,4.148-2.052c0.125,0.286,0.271,0.558,0.459,0.804  c2.66,3.479,10.842,1.365,16.537-2.984c2.71-2.071,4.675-4.594,5.716-7.046c0.876,4.557,1.938,11.692,2.779,18.441l0.075,0.241  c0.479,0.914,2.127,3.943,3.201,4.529c0.109,0.061,0.226,0.088,0.34,0.088c0.248,0,0.493-0.133,0.619-0.369  c0.188-0.342,0.06-0.771-0.281-0.957c-0.458-0.25-1.681-2.161-2.569-3.834c-0.663-5.312-2.077-15.927-3.372-21.064  c0.055-0.516,0.055-1.016,0.005-1.499c0.864,0.33,1.854,0.546,2.922,0.631c0.162,0.075,0.34,0.082,0.507,0.028  c0.856,0.036,1.753-0.013,2.675-0.15c1.756,3.689,4.835,10.242,5.444,12.072c0.081,0.242,0.149,0.468,0.215,0.681  c0.688,2.275,1.419,3.057,5.686,3.057c0.787,0,1.697-0.026,2.751-0.077c0.39-0.017,0.69-0.347,0.674-0.737  c-0.02-0.39-0.377-0.731-0.739-0.672c-6.326,0.292-6.478-0.187-7.019-1.98c-0.067-0.223-0.142-0.462-0.225-0.718  c-0.623-1.864-3.566-8.142-5.355-11.904c0.264-0.066,0.521-0.141,0.778-0.22c0.459,0.774,0.863,1.226,1.237,1.395  c0.151,0.066,0.307,0.102,0.46,0.102c0.142,0,0.281-0.03,0.409-0.087c0.54-0.236,0.841-0.352,1.002-0.409  c0.213,0.033,0.433-0.025,0.599-0.183l0.454-0.452l-0.329-0.497c-0.369-0.561-0.965-0.337-2.111,0.168  c-0.12-0.102-0.258-0.28-0.411-0.522c1.215-0.517,2.262-1.176,3.077-1.924c2.825-0.418,5.118-0.647,5.654-0.468  c0.186,0.063,0.319,0.113,0.415,0.151c-0.041,0.189-0.064,0.444-0.002,0.756c0.106,0.531,4.558,13.479,7.406,15.109  c1.007,0.573,1.791,0.762,2.478,0.76c0.617,0,1.158-0.15,1.713-0.305c0.548-0.153,1.116-0.312,1.861-0.363  c0.392-0.028,0.683-0.366,0.655-0.755c-0.029-0.392-0.415-0.687-0.755-0.656c-0.891,0.064-1.554,0.251-2.14,0.414  c-1.065,0.294-1.71,0.478-3.11-0.322c-2.053-1.172-6.457-12.876-6.724-14.16c-0.024-0.12-0.006-0.185,0.031-0.305  c0.324-1.094-0.623-1.41-1.383-1.663c-0.699-0.233-2.644-0.081-4.791,0.197c0.491-0.864,0.696-1.777,0.531-2.676  c-0.004-0.022-0.013-0.042-0.017-0.063c1.105,1.104,2.645,2.012,4.456,2.521c0.303,0.085,2.55,0.378,5.602,0.017  c2.255-0.267,2.689-2.404,5.633-2.227l-1.453-0.748l1.944-0.295l-1.649-0.941c-1.044-1.043-0.485-0.763-1.056-1.634  c-0.215-0.593-0.547-1.171-0.981-1.715c0.095,0.002,0.179,0.013,0.277,0.013c2.204,0,5.108-0.486,10.287-2.789  c6.151-2.733,13.607-2.94,13.684-2.942c0.39-0.01,0.698-0.333,0.688-0.723C99.191,32.825,98.844,32.562,98.479,32.524z   M49.648,36.701c0.103-0.156,0.191-0.287,0.267-0.395c0.039,0.107,0.082,0.218,0.13,0.328c0.079,0.183,0.36,1.056,0.686,2.067  c0.261,0.81,0.507,1.563,0.747,2.293c-1.16,0.242-2.236,0.607-3.194,1.069C48.584,39.946,49.043,37.63,49.648,36.701z   M38.178,39.609l0.092-0.32c0.01,0,0.133-0.011,0.424,0.155l5.502,6.36c-0.176,0.396-0.284,0.801-0.329,1.208  c-2.71-1.045-6.616-0.436-10.379,1.697c-0.112-0.088-0.222-0.174-0.331-0.259L38.178,39.609z"
            />
          </svg>
          <div className="bg-white shadow-xl rounded  xl:w-1/3 lg:w-1/2 md:w-3/5 sm:w-4/5 w-full p-10 mt-8 bg-red-800">
            <p tabIndex={0} className="text-2xl font-bold leading-6 text-white">
              Create an account for RestaurAnt
            </p>
            <p className="text-sm mt-4 font-medium leading-none text-white">
              Already have account?{" "}
              <Link href="/auth/signin">
                <a
                  tabIndex={0}
                  role="link"
                  className="text-sm font-medium leading-none underline text-white cursor-pointer"
                >
                  {" "}
                  Sign in here
                </a>
              </Link>
            </p>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <input
                type="hidden"
                {...register("csrfToken", { required: true, value: csrfToken })}
              />
              <div className="mt-3">
                <label className="text-sm font-medium leading-none text-white">
                  Name
                </label>
                <input
                  {...register("name", {
                    required: true,
                    minLength: 3,
                    maxLength: 255,
                  })}
                  aria-label="enter name"
                  role="input"
                  type="text"
                  name="name"
                  className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                />
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium leading-none text-white">
                  Email
                </label>
                <input
                  {...register("email", {
                    required: true,
                    minLength: 3,
                    maxLength: 255,
                  })}
                  aria-label="enter email adress"
                  role="input"
                  type="email"
                  name="email"
                  className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                />
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium leading-none text-white">
                  Password
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    {...register("password", {
                      required: true,
                      minLength: 8,
                      maxLength: 255,
                    })}
                    aria-label="enter Password"
                    role="input"
                    type="password"
                    name="password"
                    className="bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                  />
                </div>
              </div>
              <div className="mt-5">
                <div className="pb-1">
                  <p
                    className={`text-center text-white ${
                      errors.global || "invisible"
                    }`}
                  >
                    {errors.global?.message || "Global Errors"}
                  </p>
                </div>
                <button
                  role="button"
                  aria-label="Sign In"
                  className="focus:ring-2 focus:ring-offset-2 focus:ring-red-800 text-sm font-semibold leading-none text-white focus:outline-none bg-red-800 border rounded hover:bg-red-900 py-4 w-full"
                  onClick={() => clearErrors()}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
