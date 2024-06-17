import exp from "constants";

export interface FPCONHistory {
  fpcon: FPCON;
  date: string;
}

export interface FPCON {
  id: string;
  name: string;
  color: "success" | "error" | "warning" | "info" | "liteWarning" | "custom";
  description: string;
}

export interface FPCONState {
  currentState: FPCON;
  lastUpdated: string;
  history: FPCONHistory[];
}

export enum FPCONName {
  Normal = "Normal",
  Alpha = "Alpha",
  Bravo = "Bravo",
  Charlie = "Charlie",
  Delta = "Delta",
}

export const fpcons: FPCON[] = [
  { id: "1", name: FPCONName.Normal, color: "success", description: "Applies when a general global threat of possible terrorist threat activity exists and warrants a routine security posture." },
  { id: "2", name: FPCONName.Alpha, color: "liteWarning", description: "Occurs when there is an increased general threat of possible terrorist activity against personnel or facilities, the nature and extent of the threat are unpredictable." },
  { id: "3", name: FPCONName.Bravo, color: "info", description: "Applies when an increased or more predictable threat of terrorist activity exists." },
  { id: "4", name: FPCONName.Charlie, color: "warning", description: "Applies when an incident occurs or intelligence is received indicating some form of terrorist action or targeting against personnel or facilities is likely." },
  { id: "5", name: FPCONName.Delta, color: "error", description: "Applies in the immediate area where a terrorist attack has occurred or when intelligence has been received that terrorist action against a specific location or person is imminent." },
];

export function searchFPCONByName(name: FPCONName): FPCON | undefined {
  return fpcons.find(fpcon => fpcon.name === name);
}
