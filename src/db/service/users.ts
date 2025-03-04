import userRepo from "@/db/repository/users";
import { Device } from "@/types/device";

export class UserService {
  private repo = userRepo;

  async getUserByEmail(email: string) {
    return await this.repo.getUserByEmail(email);
  }

  async getUserDevicesByEmail(email: string) {
    return await this.repo.getUserDevicesByEmail(email);
  }

  async addDeviceById(email: string, data: Pick<Device, "id"> & { name: string }) {
    return await this.repo.addDeviceById(email, data);
  }

  async getAllDeviceUsers() {
    return await this.repo.getAllDeviceUsers();
  }

  async getAllUsers() {
    return await this.repo.getAllUsers();
  }
}

export const userS = new UserService();
