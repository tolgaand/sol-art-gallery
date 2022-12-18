import { generateWords } from "lib/generateWords";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "lib/prismaClient";
import { IImage } from "types";

const PER_PAGE = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IImage[] | { message: string }>
) {
  try {
    const { page } = req.query;
    const pageInt = parseInt(page as string, 10);
    const images = await prisma.image.findMany({
      skip: (pageInt - 1) * PER_PAGE,
      take: PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        prompt: true,
        url: true,
        user: {
          select: {
            publicKey: true,
          },
        },
      },
    });
    return res.status(200).json(images);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
