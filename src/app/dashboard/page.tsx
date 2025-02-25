"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Device } from "@/types/device";
import { rdb } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { devS } from "@/db/service/device";
import { DeviceForm } from "../../components/DeviceForm";
import { NoiseType } from "@/types/noise";
import { Noise } from "@/components/Noise";
import { SingleSelect } from "@/components/SingleSelect";
import { StatCard } from "@/components/StatCard";
import { Thermometer, GlassWater, Wind, Waves } from "lucide-react";

export default function Page() {
  const { data: session } = useSession();
  const [devices, setDevices] = useState<Device[]>([]);
  const [noise, setNoise] = useState<NoiseType | null>({
    message: "Obteniendo su información....",
    type: "loading",
    styleType: "page",
  });

  const [selectedId, setSelectedId] = useState<string>();
  const [selectedDevice, setSelectedDevice] = useState<Device>();

  useEffect(() => {
    if (!session) return;

    const fethInit = async () => {
      const devices = session?.user?.devices;

      if (!devices) return;

      const _devices = await devS.getDevicesByIds(devices);
      setDevices(_devices);
      setNoise(null);
    };

    fethInit();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const deviceRef = ref(rdb, "devices/" + selectedId);
    console.log(`devices/${selectedId}`);

    onValue(
      deviceRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          console.log("No existe el dispositivo");
          return;
        }
        console.log(snapshot.val());
        const data = snapshot.val() as Pick<
          Device,
          "temperature" | "volume" | "cooling"
        >;
        setDevices((prev) =>
          prev.map((d) =>
            d.id === selectedId
              ? {
                  ...d,
                  temperature: data.temperature,
                  volume: data.volume,
                  cooling: data.cooling,
                }
              : d
          )
        );

        setSelectedDevice({
          id: selectedId,
          createdAt:
            devices.find((d) => d.id === selectedId)?.createdAt || new Date(),
          temperature: data.temperature,
          volume: data.volume,
          cooling: data.cooling,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, [selectedId]);

  if (noise && noise.styleType === "page") return <Noise noise={noise} />;

  return (
    <div className="flex flex-1 flex-col items-center space-y-4 p-4 h-full">
      {noise && <Noise noise={noise} />}
      {devices.length > 0 ? (
        <div className="max-w-screen-lg w-full h-full grid grid-rows-[auto,1fr]">
          <div className="w-full flex flex-col">
            <div className="flex flex-col space-y-1 my-3">
              <h2>Dispositivos</h2>
              <span className="font-light text-sm">
                Seleccione un dispositivo para ver su información actualizada
              </span>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
              <SingleSelect
                options={devices.map((d) => ({ label: d.id, value: d.id }))}
                value={selectedId}
                onChange={(value) => {
                  setSelectedId(value);
                }}
              />
            </div>
          </div>
          {selectedDevice && (
            <div className="w-full flex flex-1 flex-col space-y-4 mt-4 p-4 border border-gray-200 bg-primary/60 rounded-lg shadow-lg">
              <div className="flex flex-col -space-y-1.5">
                <span className="text-sm font-light text-foreground">
                  Device Selected
                </span>
                <h1>{selectedDevice.id}</h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  title="Temperatura"
                  value={
                    selectedDevice.temperature + "ºC" || "No registra valores"
                  }
                  icon={Thermometer}
                />
                <StatCard
                  title="Volumen"
                  value={selectedDevice.volume + "ml" || "No registra valores"}
                  icon={GlassWater}
                />
                <StatCard
                  title="Enfriando"
                  value={selectedDevice.cooling ? "Si" : "No"}
                  icon={selectedDevice.cooling ? Wind : Waves}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <span>No tiene dispositivos registrados, agregue uno</span>
          <DeviceForm />
        </div>
      )}
    </div>
  );
}
