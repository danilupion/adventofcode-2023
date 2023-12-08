import { readLines } from "../../../common/files.js";
import { join } from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const lines = await readLines(join(__dirname, "./input.txt"));

const instructions = lines[0];

const map = new Map();

const isPrime = (num) => {
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

function primeFactors(num) {
  const result = [];

  for (let i = 2; i <= num; i++) {
    while (isPrime(i) && num % i === 0) {
      if (!result.includes(i)) {
        result.push(i);
      }
      num /= i;
    }
  }

  return result;
}

lines.slice(2, lines.length).forEach((line) => {
  const [[position], [left], [right]] = Array.from(line.matchAll(/([\w\d]+)/g));
  map.set(position, { left, right });
});

const positions = Array.from(map.keys()).filter((key) => key.endsWith("A"));

const steps = positions.map((origin) => {
  let step = 0;
  let position = origin;
  while (!position.endsWith("Z")) {
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
  return step;
});

const factors = Array.from(
  new Set(steps.map((step) => primeFactors(step)).flat()).values(),
);

console.log(factors.reduce((acc, factor) => acc * factor, 1));
