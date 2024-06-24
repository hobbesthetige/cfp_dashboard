import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

let defaultData = {
  personnel: [],
  locations: [],
};

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

// Use ES module approach
const file = join(__dirname, "personnel.json");
const personnelDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await personnelDB.write();

export default personnelDB;
