import devRepo from "@/db/repository/device";

export class DeviceService {
  private repo = devRepo;

  async getDeviceById(id: string) {
    return await this.repo.getDeviceById(id);
  }

  async getDevicesByIds(ids: string[]) {
    return await this.repo.getDevicesByIds(ids);
  }
}

export const devS = new DeviceService();
