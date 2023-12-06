import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const [time, distance] = (await readLines(join(__dirname, "./input.txt"))).map(
  (line) => {
    return Array.from(line.matchAll(/\d+/g)).map((match) => {
      return parseInt(match);
    });
  },
);

const races = time.map((time, index) => ({
  time,
  distance: distance[index],
}));

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
