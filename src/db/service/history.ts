import { History } from "@/types/history";
import { _API_URL } from "@/lib/utils";

export class HistoryService {
  async getAll(): Promise<History[]> {
    const res = await fetch(`${_API_URL}/history/`);
    const data = await res.json();
    return data as History[];
  }

  async getResampled(): Promise<History[]> {
    try {
      const res = await fetch(`${_API_URL}/history/resampled`);
      const data = await res.json();
      return data as History[];
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching resampled history");
    }
  }

  async getAllByDeviceIds(deviceIds: string[]): Promise<History[]> {
    const res = await fetch(`${_API_URL}/history/by_devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceIds }),
    });
    const data = await res.json();
    const _h = data as History[];

    return _h.map((h) => {
      return {
        ...h,
        data: h.data.map((d) => {
          return {
            ...d,
            timestamp: new Date(d.timestamp),
          };
        }),
      };
    });
  }

  async getResampledByDeviceIds(deviceIds: string[]): Promise<History[]> {
    const res = await fetch(`${_API_URL}/history/resampled/by_devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceIds }),
    });
    const data = await res.json();
    const _h = data as History[];

    return _h.map((h) => {
      return {
        ...h,
        data: h.data.map((d) => {
          return {
            ...d,
            timestamp: new Date(d.timestamp),
          };
        }),
      };
    });
  }
}

export const historyS = new HistoryService();
