import * as fs from "fs";
import * as path from "path";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: ts-node index.ts <filename>");
  process.exit(1);
}

const filename = args[0];
const filepath = path.resolve(filename);

fs.readFile(filepath, "utf-8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  console.log("File content:");
  console.log(data);
});
