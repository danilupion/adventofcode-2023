import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const lines = await readLines(join(__dirname, "./input.txt"));

const instructions = lines[0];

const map = new Map();

lines.slice(2, lines.length).forEach((line) => {
  const [[position], [left], [right]] = Array.from(line.matchAll(/(\w+)/g));
  map.set(position, { left, right });
});

let step = 0;
let position = "AAA";
while (position !== "ZZZ") {
  const { left, right } = map.get(position);
  const instruction = instructions[step % instructions.length];
  switch (instruction) {
    case "L":
      position = left;
      break;
    case "R":
      position = right;
      break;
    default:
      throw new Error(`Unknown instruction ${instruction}`);
  }
  step++;
}

console.log(step);
