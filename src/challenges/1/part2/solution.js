import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const lines = await readLines(join(__dirname, "./input.txt"));

const values = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const regex = new RegExp(
  `${[...Object.keys(values).map((text) => `(?=(${text}))`), "\\d"].join("|")}`,
  "g",
);

const listOfNumbers = lines.map((line) => {
  const lineNumbers = [];
  let m;

  while ((m = regex.exec(line)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    lineNumbers.push(
      m.filter((match) => match !== undefined && match !== "")[0],
    );
  }

  const firstNumber = values[lineNumbers.at(0)] || lineNumbers.at(0);
  const lastNumber =
    values[lineNumbers.at(lineNumbers.length - 1)] ||
    lineNumbers.at(lineNumbers.length - 1);

  return parseInt([firstNumber, lastNumber].join(""));
});

const totalSum = listOfNumbers.reduce((acc, number) => acc + number, 0);

console.log(totalSum);
