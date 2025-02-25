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
import devRep from "./device";
import { Session } from "next-auth";

export class UserRepository {
  private usersDeviceColl = collection(db, "users-devices");
  private devRepo = devRep;

  async dataToUserDevice(data: DocumentData): Promise<string[]> {
    return data.devices as string[];
  }

  async getUserDevicesByEmail(email: string) {
    const q = query(this.usersDeviceColl, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const _userDoc = querySnapshot.docs[0];
    if (!_userDoc) return [];
    const devices = await this.dataToUserDevice(_userDoc.data());
    return devices;
  }

  async addDeviceById(email: string, deviceId: string) {
    const _newD = await this.devRepo.getDeviceById(deviceId);
    if (!_newD) throw new Error("Device not found");

    const q = query(this.usersDeviceColl, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const _userDoc = querySnapshot.docs[0];
    if (!_userDoc) {
      const _newUserDev = doc(this.usersDeviceColl);
      await setDoc(_newUserDev, {
        email,
        devices: [deviceId],
      });

      return;
    }

    const _useData = _userDoc.data() as Session["user"];

    if (_useData.devices?.includes(deviceId)) {
      throw new Error("Device already added");
    }

    const _newDevices = [
      ...(_useData.devices ? _useData.devices : []),
      deviceId,
    ];
    await setDoc(
      _userDoc.ref,
      {
        devices: _newDevices,
      },
      { merge: true }
    );
  }
}

export default new UserRepository();
