import { generatePDF } from "./mslService.mjs";

function parseArguments() {
  const args = process.argv.slice(2);
  const functionName = args[0];
  const docId = args[1];
  const settings = args[2] ? JSON.parse(args[2]) : {};
  return { functionName, docId, settings };
}

async function main() {
  const { functionName, docId, settings } = parseArguments();

  if (functionName === "generatePDF") {
    await generatePDF(docId, settings);
    process.exit();
  } else {
    console.log('Invalid function name. Use "generatePDF".');
  }
}

main();
