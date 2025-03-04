import { Predict } from "@/types/predict";
import { _API_URL } from "@/lib/utils";

export class PredictService {
  async getPredictByDevicesIds(sendData: {
    deviceIds: string[];
    time: Date;
  }): Promise<Predict[]> {
    const res = await fetch(`${_API_URL}/predict/by_devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceIds: sendData.deviceIds,
        time: sendData.time,
      }),
    });
    const data = await res.json();
    return data as Predict[];
  }
}

export const predictS = new PredictService();
