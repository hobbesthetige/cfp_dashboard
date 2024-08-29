
export type PhoneNumberTypeAny = PhoneNumberType | "Any";
export enum PhoneNumberType { DSN = "DSN", Commercial = "Commercial", XcommNIPR = "XComm NIPR", XcommSIPR = "XComm SIPR", Callsign = "Callsign", MUOS = "MUOS", Other = "Other" }

export interface PhoneBookInstruction {
  id: string;
  fromNumberType: PhoneNumberType | "Any";
  toNumberType: PhoneNumberType | "Any";
  instruction: string;
}

export interface PhoneBook {
  entries: PhoneBookEntry[];
  instructions: PhoneBookInstruction[];
}

export interface PhoneNumber {
  type: PhoneNumberType;
  number: string;
}

export interface PhoneBookEntry {
  id: string;
  name: string;
  phoneNumbers: PhoneNumber[];
  email: string;
  location: string;
}