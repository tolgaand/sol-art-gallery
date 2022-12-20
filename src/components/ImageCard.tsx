import {
  Box,
  Button,
  Divider,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IImage } from "types";

import { LazyLoadImage } from "react-lazy-load-image-component";

type ImageCardProps = {
  image: IImage;
  width?: string;
  height?: string;
  vote?: () => void;
};

const sanitizePublicKey = (publicKey: string) => {
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};

export const ImageCard = ({ image, width, height, vote }: ImageCardProps) => {
  return (
    <Box
      key={image.id}
      backgroundColor="#607DE6"
      borderRadius="30px"
      width={width || "auto"}
      height={height || "auto"}
    >
      <Link target="_blank" href={image.url}>
        <LazyLoadImage
          src={image.url}
          alt={image.prompt}
          effect="blur"
          style={{
            borderTopLeftRadius: "30px",
            borderTopRightRadius: "30px",
          }}
        />
      </Link>

      <Stack padding="20px">
        <Text>{image.prompt}</Text>
        Test:{" "}
        {image._count && (
          <Stack>
            <Text>votesFor({image._count.VotesFor})</Text>
            <Text>votesAgainst({image._count.VotesAgainst})</Text>
          </Stack>
        )}
        <Divider color="black" />
        {image.user && (
          <Text>
            Generator:{" "}
            <b>{sanitizePublicKey(image.user?.publicKey as string)}</b>
          </Text>
        )}
        {vote && <Button onClick={vote}>Vote!</Button>}
      </Stack>
    </Box>
  );
};
