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

export interface EquipmentServiceStatusHistory {
  status: string;
  notes: string;
  timestamp: string;
}

export interface EquipmentService {
  id: string;
  enclave: string;
  serviceName: string;
  isVisible: boolean;
  status: string;
  statusColor: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined;
  notes: string;
  autoUpdatePingAddress: string;
  lastUpdated: string;
  history: EquipmentServiceStatusHistory[];
  pingPong?: {
    isActive: boolean;
    hostname: string;
    interval: number;
    timeout: number;
    isAutomaticStatusChange: boolean;
  };
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
  services: EquipmentService[];
  created: string;
}
