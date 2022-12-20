import axios from "axios";
import { useMutation, useQuery } from "react-query";

export const useImages = (page: number) => {
  return useQuery("images", async () => {
    const res = await axios(`/api/get-images-in-order?page=${page}`);
    return res.data;
  });
};

export const useImage = (id: string) => {
  return useQuery(
    ["image", id],
    async () => {
      const res = await axios(`/api/get-image?id=${id}`);
      return res.data;
    },
    {
      enabled: !!id,
    }
  );
};

export const useImageIds = () => {
  return useQuery("imageIds", async () => {
    const res = await axios("/api/get-image-ids");
    return res.data;
  });
};

type Vote = {
  votedForId: string;
  votedAgainstId: string;
};

export const useCastVote = () => {
  return useMutation(async (vote: Vote) => {
    const res = await axios.post("/api/cast-vote", vote);
    return res.data;
  });
};
