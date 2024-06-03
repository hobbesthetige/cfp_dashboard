// interface EventLog {
// id: string;
// category: string;
// message: string;
// isUserGenerated: boolean;
// timestamp: string;
// author: string;
// level: string;
// lastUpdated: string;
// }

import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

let defaultData = [
  {
    id: "1",
    category: "CFP",
    message: "System started",
    isUserGenerated: false,
    author: "System",
    level: "Info",
    timestamp: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

// Use ES module approach
const file = join(__dirname, "eventLog.json");
const eventLogDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await eventLogDB.write();

export default eventLogDB;
