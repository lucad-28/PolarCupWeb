export interface Device {
  id: string;
  createdAt: Date;
  name?: string | null;
  temperature?: number | null;
  volume?: number | null;
  cooling?: number | null;
}

export interface DeviceUser extends Device {
  usersEmails: string[];
}
