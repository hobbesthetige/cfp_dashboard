import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

let defaultData = {
  P: { equipmentName: "", title: "Primary" },
  A: { equipmentName: "", title: "Primary" },
  C: { equipmentName: "", title: "Primary" },
  E: { equipmentName: "", title: "Primary" },
  activePlans: [""],
  lastUpdated: new Date().toISOString(),
};

// Use ES module approach
const file = join(__dirname, "pacePlan.json");
const placePlanDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await placePlanDB.write();

export default placePlanDB;
