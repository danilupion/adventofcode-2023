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
          sourceStart: line[1],
          destinationStart: line[0],
          length: line[2],
        };
      }),
  };
});

const transform = ({ ranges, type }) => {
  const { to, map } = blocks.find((block) => block.from === type);

  const newRanges = [];

  ranges.forEach(({ start, length }) => {
    const mapEntries = map
      .filter(({ sourceStart, length: sourceLength }) => {
        return (
          sourceStart <= start + length && sourceStart + sourceLength >= start
        );
      })
      .sort((a, b) => {
        return a.sourceStart - b.sourceStart;
      });

    let currentStart = start;

    if (mapEntries.length === 0) {
      newRanges.push({ start, length });
      return;
    }

    if (currentStart < mapEntries[0].sourceStart) {
      newRanges.push({
        start: currentStart,
        length: Math.min(
          mapEntries[0].sourceStart - currentStart,
          start + length - currentStart,
        ),
      });
      currentStart += newRanges[newRanges.length - 1].length;
    }

    mapEntries.forEach(
      ({ sourceStart, destinationStart, length: sourceLength }) => {
        const blockStart = destinationStart + (currentStart - sourceStart);
        const blockLength = Math.min(
          sourceLength - (currentStart - sourceStart),
          start + length - currentStart,
        );

        const newRange = {
          start: blockStart,
          length: blockLength,
        };

        newRanges.push(newRange);

        currentStart += newRange.length;
      },
    );

    if (currentStart < start + length) {
      newRanges.push({
        start: currentStart,
        length: start + length - currentStart,
      });
    }
  });

  return {
    type: to,
    ranges: newRanges,
  };
};

const pairs = (input) =>
  input.reduce((acc, curr, i) => {
    if (i % 2 === 0) {
      acc.push([curr]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  }, []);

let result = {
  type: "seed",
  ranges: pairs(seeds).map(([start, length]) => ({ start, length })),
};

const seedRoad = {
  [result.type]: result.ranges,
};

while (result.type !== "location") {
  const { ranges, type } = result;
  result = transform({ ranges, type });
  seedRoad[result.type] = result.ranges;
}

console.log(Math.min(...seedRoad["location"].map(({ start }) => start)));
