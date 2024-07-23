import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

let defaultData = {};

// Use ES module approach
const file = join(__dirname, "pingStatus.json");
const pingStatusDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await pingStatusDB.write();

export function clearDB() {
  pingStatusDB.data = {};
  pingStatusDB.write();
}

async function resetData() {
  pingStatusDB.data = defaultData;
  await pingStatusDB.write();
}

export { resetData };
export { pingStatusDB };
