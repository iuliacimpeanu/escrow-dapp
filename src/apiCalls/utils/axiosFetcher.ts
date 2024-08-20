import { axiosInstance } from "./axiosInstance";


export const axiosFetcher = (url: string) =>
  axiosInstance.get(url).then((response) => response.data);
