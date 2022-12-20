export type IImage = {
  id: string;
  url: string;
  prompt: string;
  user?: {
    publicKey: string;
  } | null;
  _count?: {
    VotesFor: number;
    VotesAgainst: number;
  };
};
