import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

let defaultData = [];

// Use ES module approach
const file = join(__dirname, "issues.json");
const issuesDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await issuesDB.write();

export default issuesDB;
