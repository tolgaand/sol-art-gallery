export const getRandomImage: (ids: string[], notThisOne?: number) => number = (
  ids,
  notThisOne
) => {
  const imageIndex = getRandomNumber(0, ids.length - 1);

  if (imageIndex !== notThisOne) return imageIndex;
  return getRandomImage(ids, notThisOne);
};

export const getOptionsForVote = (ids: string[]) => {
  if (!ids.length) return ["", ""];

  const firstIndex = getRandomImage(ids);
  const secondIndex = getRandomImage(ids, firstIndex);

  console.log(firstIndex, secondIndex);

  return [ids[firstIndex], ids[secondIndex]];
};

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
