// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateWords } from "lib/generateWords";
import openai from "lib/openai";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismaClient";

type Data = {
  imageUri?: string;
  prompt: string;
};

import fs from "fs";
import path from "path";

const generateRandomImageName = () => {
  const random = Math.random().toString(36).substring(7);
  return `${random}.jpg`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { message: string }>
) {
  try {
    let { prompt } = req.query;
    prompt = prompt as string;

    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUri = response.data.data[0].url;

    // if (imageUri)
    //   await downloadImageFromUri(imageUri, generateRandomImageName());

    res.status(200).json({ imageUri, prompt });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error?.response?.data?.message || error.message });
  }
}
