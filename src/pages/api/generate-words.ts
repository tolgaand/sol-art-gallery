import { generateWords } from "lib/generateWords";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  words: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ words: generateWords(5) });
}
