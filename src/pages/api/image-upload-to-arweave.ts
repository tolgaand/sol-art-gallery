import { Connection } from "@solana/web3.js";
import { generateWords } from "lib/generateWords";
import { uploadImageToArweave } from "lib/uploadImageToArweave";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "lib/prismaClient";

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

  const { pk, prompt, uri, txBase64 } = req.body;

  if (!prompt || !uri || !txBase64 || !pk)
    return res.status(400).json({ message: "Missing prompt" });

  try {
    const { ok } = await fetch(
      `${process.env.NEXT_PUBLIC_SOLANA_AUTH_WORKER_URL as string}/${pk}`,
      {
        method: "POST",

        body: txBase64,
      }
    );

    if (!ok) throw new Error("Invalid signature");

    const uploadImageUri = await uploadImageToArweave(connection, uri);

    await prisma.image.create({
      data: {
        prompt,
        url: uploadImageUri,
        user: {
          connectOrCreate: {
            where: {
              publicKey: pk,
            },
            create: {
              publicKey: pk,
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
