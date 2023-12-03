import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const lines = await readLines(join(__dirname, "./input.txt"));

const numberRegex = /\d+/g;
const symbolRegex = /[^.\d]/g;

const numbers = [];
const symbols = [];

lines.forEach((line, index) => {
  const numberMatches = Array.from(line.matchAll(numberRegex));
  numbers.push(
    ...numberMatches.map((match) => ({
      value: parseInt(match[0], 10),
      y: index,
      x: [match.index, match.index + match[0].length - 1],
    })),
  );

  const symbolMatches = Array.from(line.matchAll(symbolRegex));
  symbols.push(
    ...symbolMatches.map((match) => ({
      symbol: match[0],
      y: index,
      x: match.index,
    })),
  );
});

const verticalMatch = (numberY, symbolY) => {
  return (
    numberY === symbolY || numberY === symbolY + 1 || numberY === symbolY - 1
  );
};

const horizontalMatch = ([numberMinX, numberMaX], symbolX) => {
  return symbolX - 1 <= numberMaX && symbolX + 1 >= numberMinX;
};

const selectedNumbers = numbers
  .filter((number) => {
    return symbols.some((symbol) => {
      return (
        verticalMatch(number.y, symbol.y) && horizontalMatch(number.x, symbol.x)
      );
    });
  })
  .map((number) => number.value);

const totalSum = selectedNumbers.reduce((acc, number) => acc + number, 0);

console.log(totalSum);
