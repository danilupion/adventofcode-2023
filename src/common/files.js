import { open } from "fs/promises";

export const readLines = async (file) => {
  const handler = await open(file, "r");

  const content = await handler.readFile();

  return content.toString().split("\n");
};

export const readFile = async (file) => {
  const handler = await open(file, "r");

  const content = await handler.readFile();

  return content.toString();
};
