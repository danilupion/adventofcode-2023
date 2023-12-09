import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const histories = (await readLines(join(__dirname, "./input.txt"))).map(
  (line) =>
    line
      .trim()
      .split(" ")
      .map((number) => parseInt(number, 10)),
);

const isFinished = (line) => {
  return line.every((number) => number === 0);
};
const process = (history) => {
  const lines = [history];
  let line = lines[lines.length - 1];
  while (!isFinished(line)) {
    const newLine = [];
    for (let i = 1; i < line.length; i++) {
      newLine.push(line[i] - line[i - 1]);
    }
    line = newLine;
    lines.push(newLine);
  }

  const next = lines.reverse().reduce((acc, line) => {
    return line[0] - acc;
  }, 0);

  return {
    lines,
    next,
  };
};

console.log(histories.map(process).reduce((acc, { next }) => acc + next, 0));
