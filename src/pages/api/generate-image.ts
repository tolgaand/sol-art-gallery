// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateWords } from "lib/generateWords";
import openai from "lib/openai";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismaClient";

type Data = {
  imageUri?: string;
  prompt: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const prompt = generateWords(7) + " photorealistic";

  const response = await openai.createImage({
    prompt,
    n: 1,
    size: "1024x1024",
  });

  console.log(response.data.data);

  const imageUri = response.data.data[0].url;

  await prisma.image.create({
    data: {
      name: prompt,
      url: imageUri as string,
    },
  });

  res.status(200).json({ imageUri, prompt });
}
