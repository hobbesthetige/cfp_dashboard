import equipmentDB from "../models/equipment.mjs";
import eventLogDB from "../models/eventLog.mjs";
import personnelDB from "../models/personnel.mjs";
import fpconDB from "../models/fpcon.mjs";
import issuesDB from "../models/issues.mjs";
import { scratchpadDB } from "../models/scratchpad.mjs";
import phonebookDB from "../models/phonebook.mjs";
import placePlanDB from "../models/pacePlan.mjs";
import zlib from "zlib";

function getAllData({
  equipment = false,
  events = false,
  personnel = false,
  fpcon = false,
  issues = false,
  scratchpad = false,
  phonebook = false,
  pacePlan = false,
} = {}) {
  console.log("Exporting data...", {
    equipment,
    events,
    personnel,
    fpcon,
    issues,
    scratchpad,
    phonebook,
    pacePlan,
  });
  let data = {
    dataExportDate: new Date().toISOString(),
  };
  if (equipment) {
    data.equipment = equipmentDB.data;
  }
  if (events) {
    data.events = eventLogDB.data;
  }
  if (personnel) {
    data.personnel = personnelDB.data;
  }
  if (fpcon) {
    data.fpcon = fpconDB.data;
  }
  if (issues) {
    data.issues = issuesDB.data;
  }
  if (scratchpad) {
    data.scratchpad = scratchpadDB.data;
  }
  if (phonebook) {
    data.phonebook = phonebookDB.data;
  }
  if (pacePlan) {
    data.pacePlan = placePlanDB.data;
  }
  return data;
}

export function exportDB(query) {
  const data = getAllData(query);
  const json = JSON.stringify(data);
  const compressed = zlib.gzipSync(json);
  return compressed;
}
