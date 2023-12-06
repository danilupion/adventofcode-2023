import { readFile } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const file = await readFile(join(__dirname, "./input.txt"));

const listOfStringNumbersToNumbers = (list) =>
  list.split(" ").map((str) => parseInt(str));

const seeds = Array.from(file.matchAll(/^seeds: (?<seed>(\d| )+)\n/g)).map(
  ({ groups }) => listOfStringNumbersToNumbers(groups.seed),
)[0];
const blocks = Array.from(
  file.matchAll(/(?<from>\w+)-to-(?<to>\w+) map:\n(?<lines>(\d| |\n)+)/g),
).map(({ groups }) => {
  const { from, to, lines } = groups;
  return {
    from,
    to,
    map: lines
      .split("\n")
      .filter((e) => e !== "")
      .map((line) => listOfStringNumbersToNumbers(line))
      .map((line) => {
        return {
          destinationStart: line[0],
          sourceStart: line[1],
          range: line[2],
        };
      }),
  };
});

const transform = ({ value, type }) => {
  const { to, map } = blocks.find((block) => block.from === type);
  const result = map.find(
    ({ sourceStart, range }) =>
      sourceStart <= value && value <= sourceStart + range,
  );

  return {
    type: to,
    value: result
      ? result.destinationStart + (value - result.sourceStart)
      : value,
  };
};

const seedRoad = seeds.map((seed) => {
  let result = transform({ value: seed, type: "seed" });
  const road = {
    [result.type]: result.value,
  };

  while (result.type !== "location") {
    result = transform(result);
    road[result.type] = result.value;
  }
  return road;
});

console.log(Math.min(...seedRoad.map(({ location }) => location)));
