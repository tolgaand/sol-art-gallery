import { generateWords } from "lib/generateWords";
import openai from "lib/openai";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  words: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Make meaningful, descriptive sentences.",
    max_tokens: 10,
    temperature: 0.9,
  });

  const sentence = response.data.choices[0].text?.trim() || generateWords(5);

  res.status(200).json({ words: sentence });
}
