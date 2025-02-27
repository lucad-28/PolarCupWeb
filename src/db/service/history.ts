import { History } from "@/types/history";
import { _API_URL } from "@/lib/utils";

export class HistoryService {
  async getAll(): Promise<History[]> {
    const res = await fetch(`${_API_URL}/history/`);
    const data = await res.json();
    return data as History[];
  }

  async getResampled(): Promise<History[]> {
    const res = await fetch(`${_API_URL}/history/resampled`);
    const data = await res.json();
    return data as History[];
  }
}

export const historyS = new HistoryService();
