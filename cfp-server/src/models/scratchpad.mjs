import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

let defaultData = {
  dashboardDefault: "",
};

// Use ES module approach
const file = join(__dirname, "scratchpad.json");
const scratchpadDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await scratchpadDB.write();

export function clearDB() {
  scratchpadDB.data = {};
  scratchpadDB.write();
}

export { scratchpadDB };
