import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = "YOUR_TOKEN";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const request = async (
  url: string,
  method = Method.GET,
  data: any,
  onError: any
) => {
  try {
    const { data: response }: any =
    (await api[method](
      url,
      method === Method.GET ? { params: data } : data
    )) || {}

    return response
  } catch (e) {
    onError && onError(e)
    return {
      status: 'ERROR',
      errorAxiosMessage: e.message,
      message: e?.response?.data?.message,
    }
  }
}

export const Method = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  OPTIONS: 'options',
  HEAD: 'head',
  PATCH: 'patch',
}

export default api
