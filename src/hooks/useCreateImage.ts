import { useMutation } from "react-query";

export const useCreateImage = () => {
  return useMutation(async () => {
    return await (await fetch("/api/generate-image")).json();
  });
};
