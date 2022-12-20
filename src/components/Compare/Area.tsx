import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { ImageCard } from "components/ImageCard";
import { useCastVote, useImage, useImageIds } from "hooks/useImages";
import { getOptionsForVote } from "lib/getRandomImage";
import { useEffect, useState } from "react";

export const CompareArea = () => {
  const imageIds = useImageIds();
  const castVote = useCastVote();

  const [firstId, setFirstId] = useState<string>("");
  const [secondId, setSecondId] = useState<string>("");

  useEffect(() => {
    reloadImages();
  }, [imageIds.data]);

  const reloadImages = () => {
    if (imageIds.data) {
      const [first, second] = getOptionsForVote(imageIds.data);
      setFirstId(first);
      setSecondId(second);
    }
  };

  const firstImage = useImage(firstId);
  const secondImage = useImage(secondId);

  const dataLoaded = firstImage.data && secondImage.data;

  const voteForAppropriate = async (selectedId: string) => {
    if (selectedId === firstId)
      await castVote.mutateAsync({
        votedForId: firstId,
        votedAgainstId: secondId,
      });
    else
      await castVote.mutateAsync({
        votedForId: secondId,
        votedAgainstId: firstId,
      });

    reloadImages();
  };

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      minHeight="300px"
    >
      {dataLoaded && !castVote.isLoading && (
        <SimpleGrid
          spacing={8}
          templateColumns={"repeat(2, 1fr)"}
          marginTop="5px"
          maxWidth="600px"
        >
          <ImageCard
            image={firstImage.data}
            vote={() => voteForAppropriate(firstId)}
          />
          <ImageCard
            image={secondImage.data}
            vote={() => voteForAppropriate(secondId)}
          />
        </SimpleGrid>
      )}
      {(!dataLoaded || castVote.isLoading) && <Spinner />}
    </Stack>
  );
};
