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
  created: string;
  lastUpdated: string;
  status: string;
  priority: string;
  resolution?: string;
  resolutionTimestamp?: string;
}