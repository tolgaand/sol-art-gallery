export type IImage = {
  id: string;
  url: string;
  prompt: string;
  user: {
    publicKey: string;
  } | null;
};
