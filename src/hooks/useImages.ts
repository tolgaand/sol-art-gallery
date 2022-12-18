import axios from "axios";
import { useQuery } from "react-query";

export const useImages = (page: number) => {
  return useQuery("images", async () => {
    const res = await axios(`/api/get-images?page=${page}`);
    return res.data;
  });
};
