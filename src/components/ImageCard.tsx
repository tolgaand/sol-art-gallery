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
import { IoIosRocket, IoMdRocket } from "react-icons/io";
import { FiUser } from "react-icons/fi";

type ImageCardProps = {
  image: IImage;
  width?: string;
  height?: string;
  vote?: () => void;
};

const sanitizePublicKey = (publicKey: string) => {
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};

const sanitizeImageDescription = (description: string) => {
  return description.length > 100
    ? `${description.slice(0, 100)}...`
    : description;
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

      <Stack padding="20px" alignItems="space-between">
        <Text fontSize="14px" minHeight="50px">
          {sanitizeImageDescription(image.prompt)}
        </Text>
        <Divider background="blue.300" />
        <Stack
          direction={{
            base: "column",
            md: "row",
          }}
        >
          {image.user && (
            <Stack
              direction="row"
              alignItems="center"
              backgroundColor="cyan.700"
              borderLeftRadius="30px"
              borderRightRadius={{ base: "30px", md: "5px" }}
              padding="10px"
              width="100%"
            >
              <FiUser size="30px" />
              <Text>{sanitizePublicKey(image.user.publicKey)}</Text>
            </Stack>
          )}
          {image.percent != undefined && (
            <Stack
              direction="row"
              alignItems="center"
              bgGradient="linear(to-r, green.200, pink.500)"
              borderRightRadius="30px"
              borderLeftRadius={{ base: "30px", md: "5px" }}
              padding="10px"
              color="black"
            >
              <IoIosRocket size="30px" />
              <Text>{image.percent.toFixed(2)}%</Text>
            </Stack>
          )}
        </Stack>

        {vote && <Button onClick={vote}>Vote!</Button>}
      </Stack>
    </Box>
  );
};
