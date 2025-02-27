import { History } from "@/types/history";

export class HistoryService {
  async getAll(): Promise<History[]> {
    const res = await fetch("http://localhost:5000/api/history/");
    const data = await res.json();
    return data as History[];
  }

  async getResampled(): Promise<History[]> {
    const res = await fetch("http://localhost:5000/api/history/resampled");
    const data = await res.json();
    return data as History[];
  }
}

export const historyS = new HistoryService();
