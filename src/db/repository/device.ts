import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Device } from "@/types/device";

export class DeviceRepository {
  private deviceColl = collection(db, "devices");

  dataToUserDevice(data: DocumentData): Device {
    return {
      id: data.id,
      createdAt: data.createdAt.toDate(),
    };
  }

  async getDeviceById(id: string) {
    const q = query(this.deviceColl, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const _deviceDoc = querySnapshot.docs[0];
    if (!_deviceDoc) return null;
    const device = this.dataToUserDevice(_deviceDoc.data());
    return device;
  }

  async getDevicesByIds(ids: string[]): Promise<Device[]> {
    const q = query(this.deviceColl, where("id", "in", ids));
    const querySnapshot = await getDocs(q);
    const devices = querySnapshot.docs.map((doc) =>
      this.dataToUserDevice(doc.data())
    );
    return devices;
  }
}

export default new DeviceRepository();
