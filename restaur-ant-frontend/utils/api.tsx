import axios, { AxiosResponse } from 'axios';

export async function getAuth<T = any, K = any>(
  url: string,
  token: string
): Promise<AxiosResponse<T, K>> {
  const response = await axios.get(`${process.env["BACKEND_URL"]}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
}

export async function postAuth<T = any, K = any>(
  url: string,
  data: any,
  token: string
): Promise<AxiosResponse<T, K>> {
  const response = await axios.post(
    `${process.env["BACKEND_URL"]}${url}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response;
}

export async function patchAuth<T = any, K = any>(
  url: string,
  data: any,
  token: string
): Promise<AxiosResponse<T, K>> {
  const response = await axios.patch(
    `${process.env["BACKEND_URL"]}${url}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response;
}

export async function deleteAuth<T = any, K = any>(
  url: string,
  data: any,
  token: string
): Promise<AxiosResponse<T, K>> {
  const response = await axios.delete(`${process.env["BACKEND_URL"]}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
}

export async function get<T = any, K = any>(
  url: string
): Promise<AxiosResponse<T, K>> {
  const response = await axios.get(`${process.env["BACKEND_URL"]}${url}`);

  return response;
}

export async function post<T = any, K = any>(
  url: string,
  data: any
): Promise<AxiosResponse<T, K>> {
  const response = await axios.post(
    `${process.env["BACKEND_URL"]}${url}`,
    data
  );

  return response;
}
