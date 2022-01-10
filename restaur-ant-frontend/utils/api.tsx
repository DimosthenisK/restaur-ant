import axios from 'axios';

export const getAuth = async (url: string, token: string) => {
  const response = await axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .catch((err) => err.response);

  return response.data;
};

export const postAuth = async (url: string, data: any, token: string) => {
  const response = await axios
    .post(url, data, { headers: { Authorization: `Bearer ${token}` } })
    .catch((err) => err.response);

  return response.data;
};

export const patchAuth = async (url: string, data: any, token: string) => {
  const response = await axios
    .patch(url, data, { headers: { Authorization: `Bearer ${token}` } })
    .catch((err) => err.response);

  return response.data;
};

export const deleteAuth = async (url: string, data: any, token: string) => {
  const response = await axios
    .delete(url, { headers: { Authorization: `Bearer ${token}` } })
    .catch((err) => err.response);

  return response.data;
};

export const get = async (url: string) => {
  const response = await axios.get(url).catch((err) => err.response);

  return response.data;
};

export const post = async (url: string, data: any) => {
  const response = await axios.post(url, data).catch((err) => err.response);

  return response.data;
};
