import { Connection } from "@solana/web3.js";
import { generateWords } from "lib/generateWords";
import { uploadImageToArweave } from "lib/uploadImageToArweave";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "lib/prismaClient";
import { checkLoginTx } from "lib/checkLoginTx";

const connection = new Connection("https://api.devnet.solana.com");

type Data = {
  ok: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { message: string }>
) {
  //request type POST
  if (!(req.method === "POST"))
    return res.status(405).json({ message: "Method not allowed" });

  const { publicKey, prompt, uri, signature } = req.body;

  if (!prompt || !uri || !signature || !publicKey)
    return res.status(400).json({ message: "Missing prompt" });

  try {
    const ok = checkLoginTx(publicKey, signature);

    if (!ok) throw new Error("Invalid signature");

    const uploadImageUri = await uploadImageToArweave(connection, uri);

    await prisma.image.create({
      data: {
        prompt,
        url: uploadImageUri,
        user: {
          connectOrCreate: {
            where: {
              publicKey,
            },
            create: {
              publicKey,
            },
          },
        },
      },
    });

    res.status(200).json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
