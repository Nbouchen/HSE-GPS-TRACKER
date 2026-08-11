export type PlantCode = 'OGGAZ' | 'M\'SILA' | 'CILAS';

export type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface PpeStatus {
  helmet: boolean;
  vest: boolean;
  boots: boolean;
  goggles: boolean;
}

export interface MovementRecord {
  id: string;
  plant: PlantCode;
  agentId: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
  timeIn: string;
  timeOut: string | null;
  lat: number;
  lon: number;
  zone: string;
  observation: string;
  riskLevel: RiskLevel;
  ppeStatus: PpeStatus;
  createdAt: string;
}

export type ViewMode = 'table' | 'map' | 'analytics';

export interface FilterState {
  plant: string;
  searchQuery: string;
  presence: 'ALL' | 'IN' | 'OUT';
  risk: 'ALL' | 'RISK_ONLY' | 'RAS_ONLY';
  zone: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'risk' | 'info' | 'success';
  timestamp: string;
}

export interface PlantInfo {
  code: PlantCode;
  name: string;
  location: string;
  centerLat: number;
  centerLon: number;
  zones: string[];
}
