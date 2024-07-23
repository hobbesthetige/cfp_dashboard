import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

let defaultData = {
  currentState: {
    id: "1",
    name: "Normal",
    color: "success",
    description:
      "Applies when a general global threat of possible terrorist threat activity exists and warrants a routine security posture.",
  },
  lastUpdated: new Date().toISOString(),
  history: [],
};

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

// Use ES module approach
const file = join(__dirname, "fpcon.json");
const fpconDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await fpconDB.write();

async function resetData() {
  fpconDB.data = defaultData;
  await fpconDB.write();
}

export { resetData };
export default fpconDB;
