import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const lines = await readLines(join(__dirname, "./input.txt"));

const listOfNumbers = lines.map((line) => {
  const match = line.matchAll(/\d/g);
  const lineNumbers = Array.from(match).map(([number]) => number);

  return parseInt(
    [lineNumbers.at(0), lineNumbers.at(lineNumbers.length - 1)].join(""),
  );
});

const totalSum = listOfNumbers.reduce((acc, number) => acc + number, 0);

console.log(totalSum);
