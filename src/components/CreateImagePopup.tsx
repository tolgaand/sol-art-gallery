import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  LinkBox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import { encode } from "bs58";
import { verify } from "crypto";
import { useGenerateImage } from "hooks/useGenerateImage";
import { useGenerateWords } from "hooks/useGenerateWords";
import { useUploadImage } from "hooks/useUploadImage";
import { useEffect, useState } from "react";

type CreateImagePopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateImagePopup = (props: CreateImagePopupProps) => {
  const { isOpen, onClose } = props;

  const wallet = useWallet();
  // const { wallet } = useWallet();

  const [magicWords, setMagicWords] = useState<string>("");
  const [generatedImageUri, setGeneratedImageUri] = useState<string>("");

  const generateWords = useGenerateWords();
  const generateImage = useGenerateImage();
  const uploadImage = useUploadImage();

  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  const handleGenerateWords = async () => {
    const { words } = await generateWords.mutateAsync();
    setMagicWords(words);
  };

  const handleGenerateImage = async () => {
    const { imageUri } = await generateImage.mutateAsync(magicWords);
    setGeneratedImageUri(imageUri);
  };

  const handleUploadGeneratedImage = async () => {
    if (!generatedImageUri || !magicWords || !wallet) return;

    try {
      setIsImageUploading(true);

      if (!wallet) throw new Error("Wallet not connected");

      const publicKey = wallet.publicKey?.toBase58();

      if (!publicKey || !wallet.signMessage)
        throw new Error("Wallet does not support signMessage");

      const loginSignMessage = "Submit Image to Solart.place";
      const code = Math.floor(Date.now() / 12e4);

      const msg = new TextEncoder().encode(`${loginSignMessage} ${code}`);
      const signed = await wallet.signMessage(msg);

      await uploadImage.mutateAsync({
        uri: generatedImageUri,
        prompt: magicWords,
        publicKey,
        signature: encode(signed),
      });

      onClose();
    } catch (error) {
    } finally {
      setIsImageUploading(false);
    }
  };

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setGeneratedImageUri("");
    setMagicWords("");
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Random Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {!generatedImageUri && (
              <Box>
                <FormControl>
                  <FormLabel>Your magic words</FormLabel>
                  <Input
                    placeholder="dog reading book"
                    value={magicWords}
                    onChange={(e) => setMagicWords(e.target.value)}
                    disabled={
                      generateWords.isLoading || generateImage.isLoading
                    }
                  />
                  <Link
                    fontSize="13px"
                    marginLeft="20px"
                    onClick={handleGenerateWords}
                  >
                    {generateWords.isLoading && "Loading"}
                    {!generateWords.isLoading && "Create random magic words"}
                  </Link>
                </FormControl>
                <Button
                  onClick={handleGenerateImage}
                  marginTop="10px"
                  width="100%"
                  colorScheme="teal"
                  isLoading={generateImage.isLoading}
                >
                  Generate Image
                </Button>
              </Box>
            )}

            {generatedImageUri && (
              <>
                <Text>{magicWords};</Text>
                <img src={generatedImageUri} />
                <Stack marginTop="10px">
                  <Button onClick={resetForm}>Regenerate Image</Button>
                  {!wallet?.publicKey && <WalletMultiButton />}
                  {wallet?.publicKey && (
                    <Button
                      colorScheme="linkedin"
                      isLoading={isImageUploading}
                      onClick={handleUploadGeneratedImage}
                    >
                      Submit!
                    </Button>
                  )}
                </Stack>
              </>
            )}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
