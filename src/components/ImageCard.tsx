import { Box, Divider, Image, Link, Stack, Text } from "@chakra-ui/react";
import { IImage } from "types";

type ImageCardProps = {
  image: IImage;
};

const sanitizePublicKey = (publicKey: string) => {
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};

export const ImageCard = ({ image }: ImageCardProps) => {
  return (
    <Box key={image.id} backgroundColor="#607DE6" borderRadius="30px">
      <Link target="_blank" href={image.url}>
        <Image
          src={image.url}
          alt={image.prompt}
          borderTopRadius="30px"
          placeholder="blur"
        />
      </Link>

      <Stack padding="20px">
        <Text>{image.prompt}</Text>
        <Divider color="black" />
        <Text>
          Creator: <b>{sanitizePublicKey(image.user?.publicKey as string)}</b>
        </Text>
      </Stack>
    </Box>
  );
};