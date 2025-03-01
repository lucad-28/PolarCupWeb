export interface Device {
  id: string;
  createdAt: Date;
  temperature?: number;
  volume?: number;
  cooling?: number;
}

export interface DeviceUser extends Device {
  usersEmails: string[];
}
