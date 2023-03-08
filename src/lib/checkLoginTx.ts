import { decode } from "bs58";
import { sign } from "tweetnacl";

export const checkLoginTx = async (publicKey: string, signature: string) => {
  if (!publicKey || !signature) throw new Error("Invalid request");

  const loginSignMessage = "Submit Image to Solart.place";
  const code = Math.floor(Date.now() / 12e4);

  if (!code) throw new Error("Invalid code, please try again");

  const msg = new TextEncoder().encode(`${loginSignMessage} ${code}`);

  const ok = sign.detached.verify(msg, decode(signature), decode(publicKey));

  return ok;
};
