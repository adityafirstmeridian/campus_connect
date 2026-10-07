export type LeadPotential = 
  | '50-100'
  | '100-250'
  | '250-500'
  | '500-1000'
  | '1000+'
  | 'High'
  | 'Medium'
  | 'Low'
  | string;

export type LeadStatus = 
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Unqualified'
  | 'In Discussion'
  | 'Proposal Sent'
  | 'MOU Signed'
  | 'Follow-up'
  | string;

export interface Lead {
  id: string;
  collegeName: string;
  collegeLocation: string;
  leadName: string;
  leadDesignation: string;
  leadNumber: string;
  leadMail: string;
  leadPotential: LeadPotential;
  leadStatus: LeadStatus;
  createdAt: string;
  notes?: string;
}

export interface FilterState {
  collegeName: string;
  leadName: string;
  location: string;
  potential?: string;
  status?: string;
  potentials?: string[];
  statuses?: string[];
}
