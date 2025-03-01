import userRepo from "@/db/repository/users";

export class UserService {
  private repo = userRepo;

  async getUserByEmail(email: string) {
    return await this.repo.getUserByEmail(email);
  }

  async getUserDevicesByEmail(email: string) {
    return await this.repo.getUserDevicesByEmail(email);
  }

  async addDeviceById(email: string, deviceId: string) {
    return await this.repo.addDeviceById(email, deviceId);
  }

  async getAllDeviceUsers() {
    return await this.repo.getAllDeviceUsers();
  }

  async getAllUsers() {
    return await this.repo.getAllUsers();
  }
}

export const userS = new UserService();
