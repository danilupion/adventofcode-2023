import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const lines = await readLines(join(__dirname, "./input.txt"));

const lineRegex = /^Card\s+\d+: (?<numbers>.+)$/g;
const numberRegex = /\d+/g;

const cards = lines.map((line) => {
  const res = Array.from(line.matchAll(lineRegex));
  const [winners, numbers] = res[0].groups.numbers
    .split("|")
    .map((str) =>
      Array.from(str.trim().matchAll(numberRegex)).map(([number]) =>
        parseInt(number),
      ),
    );

  return {
    numbers,
    winners,
  };
});

const scores = cards.map((card) => {
  const score = card.numbers.reduce((acc, number) => {
    return acc + (card.winners.includes(number) ? 1 : 0);
  }, 0);

  return score > 0 ? Math.pow(2, score - 1) : 0;
});

const totalSum = scores.reduce((acc, number) => acc + number, 0);

console.log(totalSum);
