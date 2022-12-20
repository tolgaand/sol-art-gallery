import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean } | { message: string }>
) {
  try {
    if (req.method === "GET")
      return res.status(405).json({ message: "Method not allowed" });

    const { votedForId, votedAgainstId } = req.body;

    await prisma.vote.create({
      data: {
        votedForId,
        votedAgainstId,
      },
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
  }
}
