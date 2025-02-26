export interface Device {
  id: string;
  createdAt: Date;
  temperature?: number;
  volume?: number;
  cooling?: number;
}
