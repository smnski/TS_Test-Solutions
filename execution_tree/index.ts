import * as fs from "fs";
import * as path from "path";

function readData(filename: string): string[] {
  const filepath = path.resolve(filename);
  try {
    return fs.readFileSync(filepath, "utf-8").split("\n").map(line => line.trim()).filter(line => line.length > 0);
  } catch (err) {
    console.error(`Error reading file: ${(err as Error).message}`);
    process.exit(1);
  }
}

function processData(lines: string[]) {

  function doMath(action, leftVal, rightVal) {
    let result = 0;
    switch (action) {
      case "+":
        result = leftVal + rightVal;
        break;
      case "-":
        result = leftVal - rightVal;
        break;
      case "*":
        result = leftVal * rightVal;
        break;
      case "/":
        result = leftVal / rightVal;
        break;
      case "^":
        result = Math.pow(leftVal, rightVal);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    return result;
  }

  const jsonString = lines.join("");
  const expression = JSON.parse(jsonString);

  const stack: any[] = [];
  const evals: Map<object, number> = new Map();

  stack.push(expression)

  while (stack.length > 0) {
    const node = stack.pop();

    // Node has a pure value to save, no need for evaluation code below.
    if ("value" in node) {
      evals.set(node, node.value);
      continue;
    }

    const { action, left, right } = node;
    if (!evals.has(left)) {
      stack.push(node);
      // If left expression wasn't evaluated yet, add it on top of the stack to process in immediate iteration.
      // Then return to main node, as it's just below on the stack.
      stack.push(left);
      continue;
    }

    if(!evals.has(right)) {
      stack.push(node);
      // If right expression wasn't evaluated yet, add it on top of the stack to process in immediate iteration.
      // Then return to main node, as it's just below on the stack.
      stack.push(right);
      continue;
    }

    const result = doMath(action, evals.get(left), evals.get(right));
    evals.set(node, result);
  }
  // Main expression now has a pure value set, with nothing left to evaluate.
  return evals.get(expression);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: ts-node index.ts <filename>");
    process.exit(1);
  }

  const filename = args[0];
  const lines = readData(filename);
  const result = processData(lines);
  console.log("Result:", result);
}

main();
