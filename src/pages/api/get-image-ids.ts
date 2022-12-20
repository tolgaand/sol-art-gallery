import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  try {
    const imageIds = await prisma.image.findMany({
      select: {
        id: true,
      },
    });

    const mappedImageIds = imageIds.map((image) => image.id);

    res.status(200).json(mappedImageIds);
  } catch (error) {
    console.log(error);
  }
}
