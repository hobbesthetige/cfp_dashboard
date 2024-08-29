import { getEquipmentGroups } from "../models/equipment.mjs";
import { getEventLogs } from "../models/eventLog.mjs";
import { getPersonnelData } from "../models/personnel.mjs";
import { getFpconData } from "../models/fpcon.mjs";
import { getIssues } from "../models/issues.mjs";
import { getScratchpadData } from "../models/scratchpad.mjs";
import { getPhonebookData } from "../models/phonebook.mjs";
import { getPacePlanData } from "../models/pacePlan.mjs";
import zlib from "zlib";
import { get } from "http";

async function getAllData({
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
    data.equipment = await getEquipmentGroups();
  }
  if (events) {
    data.events = await getEventLogs();
  }
  if (personnel) {
    data.personnel = await getPersonnelData();
  }
  if (fpcon) {
    data.fpcon = await getFpconData();
  }
  if (issues) {
    data.issues = await getIssues();
  }
  if (scratchpad) {
    data.scratchpad = await getScratchpadData();
  }
  if (phonebook) {
    data.phonebook = await getPhonebookData();
  }
  if (pacePlan) {
    data.pacePlan = await getPacePlanData();
  }
  return data;
}

export async function exportDB(query) {
  const data = await getAllData(query);
  const json = JSON.stringify(data);
  const compressed = zlib.gzipSync(json);
  return compressed;
}
