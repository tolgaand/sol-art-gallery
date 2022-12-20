import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismaClient";
import { IImage } from "types";

interface Image extends IImage {
  _count: {
    VotesFor: number;
    VotesAgainst: number;
  };
}

const generateCountPercent = (image: Image) => {
  const { VotesFor, VotesAgainst } = image._count;

  if (VotesFor + VotesAgainst === 0) return 0;

  return ((VotesFor / (VotesFor + VotesAgainst)) * 100).toFixed(2);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IImage[]>
) {
  try {
    const images = await prisma.image.findMany({
      orderBy: {
        VotesFor: {
          _count: "desc",
        },
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

        _count: {
          select: {
            VotesFor: true,
            VotesAgainst: true,
          },
        },
      },
    });

    images.sort((a, b) => {
      const difference =
        Number(generateCountPercent(b)) - Number(generateCountPercent(a));

      if (difference === 0) return b._count.VotesFor - a._count.VotesFor;

      return difference;
    });

    res.status(200).json(images);
  } catch (error) {
    console.log(error);
  }
}
