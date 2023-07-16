export const setPaddingToArray = (
  arr: (string | number)[][],
  fillType: number,
  padding: number
) => {
  const xPadding = new Array(padding).fill(0).map(() => fillType);
  const yPadding = new Array(padding)
    .fill(new Array(arr[0].length + padding * 2).fill(0))
    .map((row) => row.map(() => fillType)) as number[][];
  return [
    ...yPadding,
    ...arr.map((row) => [...xPadding, ...row, ...xPadding]),
    ...yPadding,
  ];
};
