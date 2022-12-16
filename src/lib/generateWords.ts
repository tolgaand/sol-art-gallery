import path from "path";
import fs from "fs";

const jsonDirectory = path.join(process.cwd(), "src/assets/data");
const words = fs.readFileSync(jsonDirectory + "/words.txt", "utf8").split("\n");

const adjectives = fs
  .readFileSync(jsonDirectory + "/adjectives.txt", "utf8")
  .split("\n");

//use words and adjectives
export function generateWords(wordCount: number) {
  let wordsArray: string[] = [];
  wordsArray.push(adjectives[Math.floor(Math.random() * adjectives.length)]);

  for (let i = 0; i < wordCount; i++) {
    wordsArray.push(words[Math.floor(Math.random() * words.length)]);
  }
  return wordsArray.join(" ");
}
