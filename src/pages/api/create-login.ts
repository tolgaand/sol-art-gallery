import { createLoginTx } from "lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  unsignedTx: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | Data
    | {
        message: string;
      }
  >
) {
  const { pb } = req.query;

  if (!pb) return res.status(400).json({ message: "Missing pb" });

  const unsignedTx = await createLoginTx(pb as string);

  res.json({
    unsignedTx,
  });
}
