import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

let map = (await readLines(join(__dirname, "./input.txt"))).map((line) =>
  line.split(""),
);

const galaxies = [];
const emptyRows = [];
const emptyColumns = [];

const emptyLineValue = 2;

for (let y = 0; y < map.length; y++) {
  const row = map[y];
  if (row.every((char) => char === ".")) {
    emptyRows.push(y);
  }
}

for (let x = 0; x < map[0].length; x++) {
  if (map.every((row) => row[x] === ".")) {
    emptyColumns.push(x);
  }
}

for (let y = 0; y < map.length; y++) {
  const row = map[y];
  for (let x = 0; x < map[0].length; x++) {
    const char = row[x];
    if (char === "#") {
      galaxies.push({
        x,
        y,
      });
    }
  }
}

const galaxyPairs = galaxies.flatMap((galaxy, index) => {
  return galaxies.slice(index + 1).map((otherGalaxy) => {
    return [galaxy, otherGalaxy];
  });
});

const distance = (a, b) => {
  const matchingEmptyRows = emptyRows.filter((row) => {
    return row > Math.min(a.y, b.y) && row < Math.max(a.y, b.y);
  });
  const matchingEmptyColumns = emptyColumns.filter((column) => {
    return column > Math.min(a.x, b.x) && column < Math.max(a.x, b.x);
  });
  return (
    Math.abs(a.x - b.x) +
    Math.abs(a.y - b.y) +
    (matchingEmptyColumns.length + matchingEmptyRows.length) *
      (emptyLineValue - 1)
  );
};

console.log(
  galaxyPairs.map(([a, b]) => distance(a, b)).reduce((a, b) => a + b),
);
