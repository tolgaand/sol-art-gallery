import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismaClient";
import { IImage } from "types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IImage | { message: string }>
) {
  try {
    const { id } = req.query;

    const image = await prisma.image.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!image) return res.status(404).json({ message: "Image not found" });

    res.status(200).json(image);
  } catch (error) {
    console.log(error);
  }
}
