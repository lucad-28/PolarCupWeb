import { Device } from "./device";

export interface History {
  deviceId: string;
  data: (Pick<Device, "cooling" | "temperature" | "volume"> & {
    timestamp: Date;
  })[];
}
