export interface EquipmentHistoryEntry {
  id: string;
  equipmentId: string;
  created: string;
  assignedTo: string;
  location: string;
  notes: string;
  checkedOutDate: string;
  returnedDate?: string; // Optional, as the equipment might still be checked out
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  department: string;
  quantity: number;
  notes: string;
  serialNumber: string;
  lastUpdated: string;
}

export interface JobControlNumber {
  number: string;
  type: string;
  timestamp: string;
}

export interface EquipmentGroup {
  id: string;
  name: string;
  utc: string;
  equipment: Equipment[];
  jobControlNumbers: JobControlNumber[];
  created: string;
}
