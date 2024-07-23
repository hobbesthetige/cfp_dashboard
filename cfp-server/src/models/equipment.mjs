// interface EquipmentHistoryEntry {
//   id: string;
//   equipmentId: string;
//   created: string;
//   assignedTo: string;
//   location: string;
//   notes: string;
//   checkedOutDate: string;
//   returnedDate?: string; // Optional, as the equipment might still be checked out
// }

// interface Equipment {
//   id: string;
//   name: string;
//   category: string;
//   department: string;
//   quantity: number;
//   notes: string;
//   serialNumber: string;
//   lastUpdated: string;
// }

// interface JobControlNumber {
//   number: string;
//   type: string;
//   timestamp: string;
// }

// interface EquipmentGroup {
//   id: string;
//   name: string;
//   utc: string;
//   equipment: Equipment[];
//   jobControlNumbers: JobControlNumber[];
//   created: string;
// }

import { join } from "path";
import { JSONFilePreset } from "lowdb/node";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "../../db/");

let defaultData = {
  equipmentHistory: [],
  equipmentGroups: [],
};

// Use ES module approach
const file = join(__dirname, "equipment.json");
const equipmentDB = await JSONFilePreset(file, defaultData);

// Write data to JSON file
await equipmentDB.write();

async function resetData() {
  equipmentDB.data = defaultData;
  await equipmentDB.write();
}

export { resetData, equipmentDB };
export default equipmentDB;
