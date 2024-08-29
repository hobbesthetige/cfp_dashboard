import { resetData as resetEquipmentData } from "../models/equipment.mjs";
import { resetData as resetEventLogData } from "../models/eventLog.mjs";
import { resetData as resetPersonnelData } from "../models/personnel.mjs";
import { resetData as resetFpconData } from "../models/fpcon.mjs";
import { resetData as resetIssuesData } from "../models/issues.mjs";
import { resetData as resetScratchpadData } from "../models/scratchpad.mjs";
import { resetData as resetPhonebookData } from "../models/phonebook.mjs";
import { resetData as resetPaceplanData } from "../models/pacePlan.mjs";

function resetAllData({
  equipment = false,
  events = false,
  personnel = false,
  fpcon = false,
  issues = false,
  scratchpad = false,
  phonebook = false,
  pacePlan = false,
} = {}) {
  console.log("Resetting data...", {
    equipment,
    events,
    personnel,
    fpcon,
    issues,
    scratchpad,
    phonebook,
    pacePlan,
  });
  if (equipment) {
    resetEquipmentData();
  }
  if (events) {
    resetEventLogData();
  }
  if (personnel) {
    resetPersonnelData();
  }
  if (fpcon) {
    resetFpconData();
  }
  if (issues) {
    resetIssuesData();
  }
  if (scratchpad) {
    resetScratchpadData();
  }
  if (phonebook) {
    resetPhonebookData();
  }
  if (pacePlan) {
    resetPaceplanData();
  }
}

export function resetDB(query) {
  resetAllData(query);
}
