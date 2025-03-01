import devRepo from "@/db/repository/device";
import { Device } from "@/types/device";

export class DeviceService {
  private repo = devRepo;

  async createDevice(device: Omit<Device, "id">) {
    return await this.repo.createDevice(device);
  }

  async getDeviceById(id: string) {
    return await this.repo.getDeviceById(id);
  }

  async getDevicesByIds(ids: string[]) {
    return await this.repo.getDevicesByIds(ids);
  }
}

export const devS = new DeviceService();
