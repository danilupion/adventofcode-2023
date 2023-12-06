import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const [time, distance] = (await readLines(join(__dirname, "./input.txt"))).map(
  (line) => {
    return parseInt(
      Array.from(line.matchAll(/\d+/g)).reduce((acc, match) => {
        return `${acc}${match}`;
      }, ""),
    );
  },
);

const races = [
  {
    time,
    distance,
  },
];

const solutions = races.map(({ time, distance }) => {
  const sqrt = Math.sqrt(time * time - 4 * distance);
  const min = Math.ceil((time - sqrt) / 2);
  const max = Math.floor((time + sqrt) / 2);
  return {
    min,
    max,
  };
});

console.log(
  solutions
    .map(({ min, max }) => max - min + 1)
    .reduce((acc, number) => acc * number, 1),
);
