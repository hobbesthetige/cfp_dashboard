export interface Settings {
  equipment: boolean;
  events: boolean;
  personnel: boolean;
  fpcon: boolean;
  issues: boolean;
  scratchpad: boolean;
  phonebook: boolean;
  pacePlan: boolean;
}

export const defaultSettings: Settings = {
  equipment: true,
  events: true,
  personnel: true,
  fpcon: true,
  issues: true,
  scratchpad: true,
  phonebook: true,
  pacePlan: true,
};