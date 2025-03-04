"use client";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { userS } from "@/db/service/users";
import { DeviceUser } from "@/types/device";
import { NoiseType } from "@/types/noise";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Image from "next/image";
import { Noise } from "@/components/Noise";
import { devS } from "@/db/service/device";
import { toastVariables } from "@/components/ToastVariables";

export default function Page() {
  const [devices, setDevices] = useState<DeviceUser[]>([]);
  const [users, setUsers] = useState<Session["user"][]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [noise, setNoise] = useState<NoiseType | null>({
    type: "loading",
    styleType: "modal",
    message: "Getting devices...",
  });

  useEffect(() => {
    const fetchDevices = async () => {
      const _devs = await userS.getAllDeviceUsers();
      const _users = await userS.getAllUsers();
      setDevices(_devs);
      setUsers(_users);
      setNoise(null);
    };
    fetchDevices();
  }, []);

  const handleAddDevice = async () => {
    try {
      setNoise({
        type: "loading",
        styleType: "modal",
        message: "Creating device...",
      });
      const _tmp = new Date();
      const _devId = await devS.createDevice({
        createdAt: _tmp,
      });
      setDevices((prev) => [
        ...prev,
        {
          id: _devId,
          createdAt: _tmp,
          usersEmails: [],
        },
      ]);
      setNoise(null);
      toastVariables.success("Device created successfully");
    } catch (error) {
      console.error(error);
      setNoise(null);
      toastVariables.error("Error creating device");
    }
  };

  const handleOpen = (users: string[]) => {
    setSelectedUsers(users);
    setOpen(true);
  };

  const columns: TableColumn<DeviceUser>[] = [
    {
      name: "ID",
      selector: (row: DeviceUser) => row.id,
      sortable: true,
    },
    {
      name: "Creation Date",
      selector: (row: DeviceUser) =>
        new Date(row.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      sortable: true,
    },
    {
      name: "Users",
      cell: (row: DeviceUser) => (
        <Button
          variant={"secondary"}
          onClick={() => handleOpen(row.usersEmails)}
        >
          View Users
        </Button>
      ),
    },
  ];

  if (noise && noise.styleType === "page") return <Noise noise={noise} />;

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-screen-lg w-full px-4">
        {noise && <Noise noise={noise} />}
        <div className="p-2 mt-4">
            <h1>Device Management</h1>
        </div>

        <div className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full mt-4 p-4 border border-gray-200 bg-primary/60 rounded-lg shadow-lg">
          <span className="font-bold text-xl">
            Register a new device
          </span>
          <div className="max-w-52 w-full">
            <Button
              variant={"secondary"}
              onClick={() => {
                handleAddDevice();
              }}
              className="w-full"
            >
              Create
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 w-full  mt-4 p-4 border border-gray-200 bg-primary/60 rounded-lg shadow-lg">
          <h2>Dispositivos existentes</h2>
          <div className="w-full">
            <DataTable
              columns={columns}
              data={devices}
              pagination
              className="bg-primary/80 rounded-md"
            />
          </div>
        </div>
        {open && (
          <Modal onClose={() => setOpen(false)}>
            <div className="flex flex-col max-h-[80vh] overflow-y-auto space-y-5">
              <h2>Users</h2>
              <div className="flex flex-col justify-end space-y-2">
                {selectedUsers.length > 0 ? (
                  selectedUsers.map((user) => {
                    const u = users.find((u) => u.email === user);
                    if (!u) return null;
                    return (
                      <div
                        key={user}
                        className={
                          "w-full p-2 bg-background flex rounded-lg space-x-3"
                        }
                      >
                        <div className="flex-1 flex flex-col max-w-[80%]">
                          <span className="font-bold flex-wrap">{u.name}</span>
                          <span className="font-light flex-wrap text-ellipsis">
                            {u.email}
                          </span>
                        </div>
                        <div className="max-w-[20%] h-full my-auto flex items-center justify-center">
                          <Image
                            src={u.image || ""}
                            alt={u.name || ""}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className="font-light flex-wrap text-ellipsis">
                    No users found for this device
                  </span>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
