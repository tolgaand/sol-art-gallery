import axios from "axios";
import { useMutation } from "react-query";

export const useGenerateWords = () => {
  return useMutation(async () => {
    return (await axios("/api/generate-words")).data;
  });
};
