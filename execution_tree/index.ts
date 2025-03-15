import * as fs from "fs";
import * as path from "path";

function readData(filename: string): string {
  const filepath = path.resolve(filename);
  try {
    return fs.readFileSync(filepath, "utf-8");
  } catch (err) {
    console.error(`Error reading file: ${(err as Error).message}`);
    process.exit(1);
  }
}

function processData(data: string) {
  return 1;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: ts-node index.ts <filename>");
    process.exit(1);
  }

  const filename = args[0];
  const data = readData(filename);
  if (data) {
    const res = processData(data);
    console.log("Result: ", res);
  }
}

main();