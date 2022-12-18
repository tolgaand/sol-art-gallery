import { ImageList } from "components/ImageList";
import { useImages } from "hooks/useImages";
import { useState } from "react";

export default function Home() {
  const [page, setPage] = useState<number>(1);

  const { isLoading, data: images } = useImages(page);

  return <ImageList images={images} isLoading={isLoading} />;
}
