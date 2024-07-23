import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

let defaultData = {
  entries: [],
  instructions: [],
};

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

// Use ES module approach
const file = join(__dirname, "phonebook.json");
const phonebookDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await phonebookDB.write();

async function resetData() {
  phonebookDB.data = defaultData;
  await phonebookDB.write();
}

export { resetData };
export default phonebookDB;
