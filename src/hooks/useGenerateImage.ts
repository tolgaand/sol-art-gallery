import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useMutation } from "react-query";

export const useGenerateImage = () => {
  const toast = useToast();

  return useMutation(
    async (prompt: string) => {
      return (await axios(`/api/generate-image?prompt=${prompt}`)).data;
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Image generated",
          description: "Image generated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error generating image",
          description: error?.response?.data?.message || error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );
};
