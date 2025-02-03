import { v4 as uuidv4 } from 'uuid';

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
  groupID: string;
  name: string;
  category: string;
  department: string;
  quantity: number;
  notes: string;
  serialNumber: string;
  jobControlNumbers: JobControlNumber[];
  lastUpdated: string;
}

export function makeEquipment(groupID: string): Equipment {
  return {
    id: uuidv4(),
    groupID: groupID,
    name: "",
    category: "",
    department: "",
    quantity: 1,
    notes: "",
    serialNumber: "",
    jobControlNumbers: [],
    lastUpdated: new Date().toISOString(),
  };
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

export function makeEquipmentService(): EquipmentService {
  return {
    id: uuidv4(),
    serviceName: "",
    enclave: "",
    notes: "",
    isVisible: true,
    status: "Offline",
    statusColor: "default",
    autoUpdatePingAddress: "",
    lastUpdated: new Date().toISOString(),
    history: [],
  };
};

export function makeEquipmentServiceWithName(service: string, enclave: string): EquipmentService {
  return {
    id: uuidv4(),
    serviceName: service,
    enclave: enclave,
    notes: "",
    isVisible: true,
    status: "Offline",
    statusColor: "default",
    autoUpdatePingAddress: "",
    lastUpdated: new Date().toISOString(),
    history: [],
  };
};

export interface JobControlNumber {
  id: string;
  number: string;
  type: string;
  timestamp: string;
}

export interface EquipmentGroup {
  id: string;
  name: string;
  utc: string;
  services: EquipmentService[];
  created: string;
}

export interface EquipmentGroupWithItems {
  id: string;
  name: string;
  utc: string;
  services: EquipmentService[];
  equipment: [Equipment]
  created: string;
}

export function makeEquipmentGroup(): EquipmentGroup {
  return {
    id: uuidv4(),
    name: "",
    utc: "",
    services: [],
    created: new Date().toISOString(),
  };
};