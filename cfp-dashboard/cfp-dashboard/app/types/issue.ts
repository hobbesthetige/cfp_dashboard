export interface IssueNote {
  note: string;
  timestamp: string;
}

export interface Issue {
  id: string;
  category: string;
  ticketNumber?: string;
  personnelResponsible?: string;
  title: string;
  description: string;
  department: string;
  notes: IssueNote[];
  createdAt: string;
  lastUpdated: string;
  status: string;
  priority: number;
  resolution?: string;
  resolutionTimestamp?: string;
}