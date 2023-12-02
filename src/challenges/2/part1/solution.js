import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const lines = await readLines(join(__dirname, "./input.txt"));

const lineRegex = /^Game (?<id>\d+): (?<description>.*)$/g;

const max = {
  red: 12,
  green: 13,
  blue: 14,
};

const listOfGames = lines.map((line) => {
  const [[, id, game]] = Array.from(line.matchAll(lineRegex));
  const hands = game.split("; ").map((hand) => {
    return hand.split(", ").reduce((acc, current) => {
      const [number, card] = current.split(" ");
      return {
        ...acc,
        [card]: parseInt(number),
      };
    }, {});
  });

  const exceedsLimit = hands.some((hand) =>
    Object.entries(hand).some(([color, count]) => {
      return max[color] < count;
    }),
  );

  return exceedsLimit ? 0 : parseInt(id);
});

const totalSum = listOfGames.reduce((acc, number) => acc + number, 0);

console.log(totalSum);
