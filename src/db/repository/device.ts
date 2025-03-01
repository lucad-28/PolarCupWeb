import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  setDoc,
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

  async createDevice(device: Omit<Device, "id">) {
    const docRef = doc(this.deviceColl);
    await setDoc(docRef, { ...device, id: docRef.id });
    return docRef.id;
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

  async getAllDevices(): Promise<Device[]> {
    const querySnapshot = await getDocs(this.deviceColl);
    const devices = querySnapshot.docs.map((doc) =>
      this.dataToUserDevice(doc.data())
    );
    return devices;
  }
}

export default new DeviceRepository();
