import userRepo from "@/db/repository/users";

export class UserService {
  private repo = userRepo;

  async getUserDevicesByEmail(email: string) {
    return await this.repo.getUserDevicesByEmail(email);
  }

  async addDeviceById(email: string, deviceId: string) {
    return await this.repo.addDeviceById(email, deviceId);
  }
}

export const userS = new UserService();
