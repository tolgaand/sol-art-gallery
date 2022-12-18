import {
  bundlrStorage,
  findMetadataPda,
  keypairIdentity,
  Metaplex,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import { generateImageName } from "./generateImageName";

import bs58 from "bs58";

const fromKeypair = Keypair.fromSecretKey(
  bs58.decode(process.env.WALLET_PRIVATE_KEY as string)
);

const getImageFromUri = async (uri: string) => {
  const res = await fetch(uri);
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();
  return buffer;
};

export const uploadImageToArweave = async (
  connection: Connection,
  image: string
) => {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(fromKeypair))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  const imageBuffer = await getImageFromUri(image);

  const file = toMetaplexFile(imageBuffer, generateImageName());

  const imageUri = await metaplex.storage().upload(file);

  return imageUri;
};
