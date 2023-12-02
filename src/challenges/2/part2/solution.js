import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const lines = await readLines(join(__dirname, "./input.txt"));

const lineRegex = /^Game (?<id>\d+): (?<description>.*)$/g;

const listOfGames = lines.map((line) => {
  const [[, , game]] = Array.from(line.matchAll(lineRegex));
  const hands = game.split("; ").map((hand) => {
    return hand.split(", ").reduce((acc, current) => {
      const [number, card] = current.split(" ");
      return {
        ...acc,
        [card]: parseInt(number),
      };
    }, {});
  });

  const minimum = hands.reduce(
    (acc, hand) => {
      return {
        red: Math.max(acc.red, hand.red || 0),
        blue: Math.max(acc.blue, hand.blue || 0),
        green: Math.max(acc.green, hand.green || 0),
      };
    },
    {
      red: 0,
      blue: 0,
      green: 0,
    },
  );

  return minimum.red * minimum.blue * minimum.green;
});

const totalSum = listOfGames.reduce((acc, number) => acc + number, 0);

console.log(totalSum);
