import { Device } from "./device";

export interface History {
  deviceId: string;
  data: Pick<Device, "cooling" | "createdAt" | "temperature" | "volume">[];
}
