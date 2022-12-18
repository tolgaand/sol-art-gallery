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
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import { verify } from "crypto";
import { useGenerateImage } from "hooks/useGenerateImage";
import { useGenerateWords } from "hooks/useGenerateWords";
import { useUploadImage } from "hooks/useUploadImage";
import { useWalletAuth } from "hooks/useWalletAuth";
import { useEffect, useState } from "react";

type CreateImagePopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateImagePopup = (props: CreateImagePopupProps) => {
  const { isOpen, onClose } = props;

  const anchorWallet = useAnchorWallet();

  const [magicWords, setMagicWords] = useState<string>("");
  const [generatedImageUri, setGeneratedImageUri] = useState<string>("");

  const generateWords = useGenerateWords();
  const generateImage = useGenerateImage();
  const uploadImage = useUploadImage();
  const walletAuth = useWalletAuth();

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
    if (!generatedImageUri || !magicWords || !anchorWallet) return;

    try {
      setIsImageUploading(true);

      const { unsignedTransaction } = await walletAuth.mutateAsync(
        anchorWallet.publicKey.toString()
      );

      const uParseTx = Transaction.from(
        Buffer.from(unsignedTransaction, "base64")
      );

      const tx = await anchorWallet.signTransaction(uParseTx);

      const txBase64 = Buffer.from(tx.serialize()).toString("base64");

      await uploadImage.mutateAsync({
        uri: generatedImageUri,
        prompt: magicWords,
        txBase64,
        pk: anchorWallet.publicKey.toString(),
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
                  {!anchorWallet?.publicKey && <WalletMultiButton />}
                  {anchorWallet?.publicKey && (
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
