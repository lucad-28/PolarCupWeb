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
import { DeviceUser } from "@/types/device";

export class UserRepository {
  private usersColl = collection(db, "users");
  private usersDeviceColl = collection(db, "users-devices");
  private devRepo = devRep;

  async dataToUserDevice(data: DocumentData): Promise<string[]> {
    return data.devices as string[];
  }

  async getUserByEmail(email: string): Promise<Session["user"] | null> {
    const q = query(this.usersColl, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const _userDoc = querySnapshot.docs[0];
    if (!_userDoc) return null;
    const user = _userDoc.data() as Session["user"];
    return user;
  }

  async getAllUsers(): Promise<Session["user"][]> {
    const querySnapshot = await getDocs(this.usersColl);
    const users = querySnapshot.docs.map(
      (doc) => doc.data() as Session["user"]
    );
    return users;
  }

  getAllDeviceUsers = async (): Promise<DeviceUser[]> => {
    const usersSnapshot = await getDocs(this.usersDeviceColl);
    const usersData = usersSnapshot.docs.map((doc) => {
      const data = doc.data() as { devices: string[]; email: string };
      return {
        ...data,
        id: doc.id,
      };
    });

    const deviceUserMap = new Map<string, string[]>();

    usersData.forEach((user) => {
      if (!user.devices) return;
      user.devices.forEach((deviceId) => {
        if (!deviceUserMap.has(deviceId)) {
          deviceUserMap.set(deviceId, []);
        }
        deviceUserMap.get(deviceId)?.push(user.email);
      });
    });

    const devices = await this.devRepo.getAllDevices();

    const deviceUsers: DeviceUser[] = devices.map((device) => ({
      ...device,
      usersEmails: deviceUserMap.get(device.id) || [],
    }));

    return deviceUsers;
  };

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
