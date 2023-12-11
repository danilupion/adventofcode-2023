import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const Directions = {
  north: "north",
  south: "south",
  east: "east",
  west: "west",
};

const directions = Object.values(Directions);

const map = (await readLines(join(__dirname, "./input.txt"))).map((line, y) =>
  line.split("").map((char, x) => {
    return {
      x,
      y,
      char,
      sinks: {
        [Directions.north]: ["S", "|", "L", "J"].includes(char),
        [Directions.south]: ["S", "|", "7", "F"].includes(char),
        [Directions.east]: ["S", "-", "L", "F"].includes(char),
        [Directions.west]: ["S", "-", "7", "J"].includes(char),
      },
    };
  }),
);

const path = [
  map
    .map((row) => row.find((cell) => cell.char === "S"))
    .find((cell) => cell !== undefined),
];

const step = (cell, direction) => {
  switch (direction) {
    case Directions.north:
      return [map[cell.y - 1][cell.x], Directions.south];
    case Directions.south:
      return [map[cell.y + 1][cell.x], Directions.north];
    case Directions.east:
      return [map[cell.y][cell.x + 1], Directions.west];
    case Directions.west:
      return [map[cell.y][cell.x - 1], Directions.east];
  }
};

const nextCell = (cell, excluded) => {
  let directionIndex = 0;
  let possibleDirections = directions.filter(
    (direction) => !excluded.includes(direction) && cell.sinks[direction],
  );

  if (cell.y === 0) {
    possibleDirections = possibleDirections.filter(
      (direction) => direction !== Directions.north,
    );
  } else if (cell.y === map.length - 1) {
    possibleDirections = possibleDirections.filter(
      (direction) => direction !== Directions.south,
    );
  } else if (cell.x === 0) {
    possibleDirections = possibleDirections.filter(
      (direction) => direction !== Directions.west,
    );
  } else if (cell.x === map[0].length - 1) {
    possibleDirections = possibleDirections.filter(
      (direction) => direction !== Directions.east,
    );
  }

  while (directionIndex < possibleDirections.length) {
    const [newCell, from] = step(cell, possibleDirections[directionIndex]);
    if (
      newCell !== undefined &&
      directions
        .filter((direction) => direction !== from)
        .some((direction) => newCell.sinks[direction])
    ) {
      return [newCell, from];
    }
    directionIndex++;
  }
};

let [nextPosition, from] = nextCell(path[path.length - 1], []);
while (nextPosition.char !== "S") {
  path.push(nextPosition);
  [nextPosition, from] = nextCell(path[path.length - 1], [from]);
}

const verticalLines = [...path, path[0]].reduce((acc, point, index) => {
  const previous = path[index - 1];
  const last = acc[acc.length - 1];
  if (previous !== undefined && point.x === previous.x) {
    if (last !== undefined && point.x === last[0].x) {
      last[1].y = point.y;
      return acc;
    } else {
      return [
        ...acc,
        [
          { x: previous.x, y: previous.y },
          { x: point.x, y: point.y },
        ],
      ];
    }
  }
  return acc;
}, []);

// Custom version of ray casting algorithm
const inPolygon = (point) => {
  if (path.some((cell) => cell.x === point.x && cell.y === point.y)) {
    return false;
  }
  const intersections = verticalLines.filter(
    (line) =>
      line[0].x > point.x &&
      ((line[1].y > point.y && line[0].y <= point.y) ||
        (line[1].y <= point.y && line[0].y > point.y)),
  );

  return intersections.length % 2 === 1;
};

let pointsInPolygon = 0;

map.forEach((row) =>
  row.forEach((cell) => {
    pointsInPolygon += inPolygon(cell) ? 1 : 0;
  }),
);

console.log(pointsInPolygon);
