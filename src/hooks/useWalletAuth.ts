import axios from "axios";
import { useMutation } from "react-query";

export const useWalletAuth = () => {
  return useMutation(async (pb: string) => {
    return (
      await axios(`${process.env.NEXT_PUBLIC_SOLANA_AUTH_WORKER_URL}/${pb}`)
    ).data;
  });
};
