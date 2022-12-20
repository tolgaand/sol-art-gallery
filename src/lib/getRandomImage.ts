export const getRandomImage: (ids: string[], notThisOne?: number) => number = (
  ids,
  notThisOne
) => {
  const imageIndex = Math.floor(Math.random() * ids.length + 1);

  if (imageIndex !== notThisOne) return imageIndex;
  return getRandomImage(ids, notThisOne);
};

export const getOptionsForVote = (ids: string[]) => {
  if (!ids.length) return ["", ""];

  const firstIndex = getRandomImage(ids);
  const secondIndex = getRandomImage(ids, firstIndex);

  return [ids[firstIndex], ids[secondIndex]];
};
