export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type TransformerStatus =
  | 'Normal'
  | 'Monitor'
  | 'Inspection Needed'
  | 'Immediate Action';

export interface Transformer {
  id: string;
  location: string;
  temperature: number;
  voltage: number;
  current: number;
  load: number;
  humidity: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: TransformerStatus;
  lastUpdated: string;
  healthScore: number;
  capacityKVA: number;
  installedYear: number;
}

export interface SensorReading {
  time: string;
  temperature: number;
  load: number;
  voltage: number;
}

export interface Alert {
  id: string;
  transformerId: string;
  location: string;
  riskLevel: RiskLevel;
  reason: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  priority: number;
  status: 'Available' | 'Unavailable' | 'On Leave';
  availability: string;
  timeoutSeconds: number;
}

export interface Maintenance {
  id: string;
  transformerId: string;
  location: string;
  issue: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo: string;
  status: 'Inspection Pending' | 'Inspection Started' | 'Resolved' | 'Unassigned';
  createdAt: string;
  resolvedAt?: string;
}

export interface EscalationStep {
  contact: Contact;
  status: 'Waiting' | 'Calling' | 'No Answer' | 'Acknowledged';
}

export type ScenarioKey = 'normal' | 'increasing' | 'overheating' | 'critical';

export interface Scenario {
  key: ScenarioKey;
  label: string;
  temperature: number;
  load: number;
  voltage: number;
  current: number;
  humidity: number;
  riskLevel: RiskLevel;
}

export type PageKey =
  | 'dashboard'
  | 'transformers'
  | 'risk'
  | 'alerts'
  | 'voice'
  | 'maintenance'
  | 'contacts'
  | 'analytics';
