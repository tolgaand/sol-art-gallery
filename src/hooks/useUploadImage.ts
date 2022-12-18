import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type InputType = {
  uri: string;
  prompt: string;
  txBase64: string;
  pk: string;
};

export const useUploadImage = () => {
  const toast = useToast();
  const clientQuery = useQueryClient();

  return useMutation(
    async (input: InputType) => {
      return (await axios.post("/api/image-upload-to-arweave", input)).data;
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Image uploaded",
          description: "Image uploaded to Arweave",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        clientQuery.invalidateQueries("images");
      },
      onError: (error: any) => {
        toast({
          title: "Error uploading image",
          description: error?.response?.data?.message || error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );
};
