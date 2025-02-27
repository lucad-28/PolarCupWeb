"use client";
import { Tab, TabButtons } from "@/components/TabButtons";
import { historyS } from "@/db/service/history";
import { History } from "@/types/history";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { GalleryHorizontalEnd, GalleryVertical } from "lucide-react";
import { SingleSelect } from "@/components/SingleSelect";

const _TABS: Tab[] = [
  {
    id: "all",
    label: "Todos",
    description:
      "Todos los datos recolectados por los dispositivos con intervalos de 15 minutos.",
    icon: <GalleryHorizontalEnd />,
  },
  {
    id: "one",
    label: "Por Dispositivo",
    description: "Los datos reales recolectados por un dispositivo.",
    icon: <GalleryVertical />,
  },
];

export default function Page() {
  const [history, setHistory] = useState<History[]>([]);
  const [resampled, setResampled] = useState<History[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>(_TABS[0]);
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const _h = await historyS.getAll();
        const _hResampled = await historyS.getResampled();
        const _devices = _h.map((h) => h.deviceId);

        setResampled(_hResampled);
        setHistory(_h);
        setDevices(_devices);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const formatDate = (timestamp: Date): string => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <div className="w-full h-full max-w-screen-lg grid grid-rows-[auto,1fr] mx-auto items-center">
      <div className="w-full h-full flex items-center justify-center">
        <TabButtons
          tabs={_TABS}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
          }}
        />
      </div>

      <div className="w-full flex flex-col space-y-2 mx-4 mt-8 border border-gray-200 bg-primary/60 rounded-lg shadow-lg p-6">
        {activeTab.id === "one" && (
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <span className="font-light">Selecciona un dispositivo</span>
            <SingleSelect
              options={devices.map((d) => ({
                label: d,
                value: d,
              }))}
              onChange={(value) => {
                setSelectedDevice(value);
              }}
            />
          </div>
        )}

        <div className="w-full h-full flex items-center justify-center">
          <span className="font-light text-sm">
            Datos de temperatura recolectados
          </span>
          <LineChart
            width={600}
            height={300}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" tickFormatter={formatDate} />
            <YAxis interval={"preserveStart"} dataKey={"temperature"} />
            <Tooltip
              labelFormatter={(value: ValueType) =>
                formatDate(new Date(value as number))
              }
            />
            {activeTab.id === "all" ? (
              resampled.map((h) => (
                <>
                  <Line
                    key={h.deviceId}
                    name={h.deviceId}
                    type="monotone"
                    dataKey="temperature"
                    stroke="#59150E"
                    data={h.data}
                  />
                </>
              ))
            ) : (
              <Line
                key={selectedDevice}
                name={selectedDevice}
                type="monotone"
                dataKey="temperature"
                stroke="#59150E"
                data={
                  history.find((h) => h.deviceId === selectedDevice)?.data ?? []
                }
              />
            )}
          </LineChart>
          <span className="font-light text-sm">
            Datos de volumen recolectados
          </span>
          <LineChart
            width={600}
            height={300}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" tickFormatter={formatDate} />
            <YAxis interval={"preserveStart"} dataKey={"volume"} />
            <Tooltip
              labelFormatter={(value: ValueType) =>
                formatDate(new Date(value as number))
              }
            />
            {activeTab.id === "all" ? (
              resampled.map((h) => (
                <>
                  <Line
                    key={h.deviceId}
                    name={h.deviceId}
                    type="monotone"
                    dataKey="volume"
                    stroke="#3E606F"
                    data={h.data}
                  />
                </>
              ))
            ) : (
              <Line
                key={selectedDevice}
                name={selectedDevice}
                type="monotone"
                dataKey="volume"
                stroke="#3E606F"
                data={
                  history.find((h) => h.deviceId === selectedDevice)?.data ?? []
                }
              />
            )}
          </LineChart>
          <span className="font-light text-sm">
            Datos de enfriamiento recolectados
          </span>
          <LineChart
            width={600}
            height={300}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" tickFormatter={formatDate} />
            <YAxis interval={"preserveStart"} dataKey={"cooling"} />
            <Tooltip
              labelFormatter={(value: ValueType) =>
                formatDate(new Date(value as number))
              }
            />
            {activeTab.id === "all" ? (
              resampled.map((h) => (
                <>
                  <Line
                    key={h.deviceId}
                    name={h.deviceId}
                    type="monotone"
                    dataKey="cooling"
                    stroke="#10403B"
                    data={h.data}
                  />
                </>
              ))
            ) : (
              <Line
                key={selectedDevice}
                name={selectedDevice}
                type="monotone"
                dataKey="cooling"
                stroke="#10403B"
                data={
                  history.find((h) => h.deviceId === selectedDevice)?.data ?? []
                }
              />
            )}
          </LineChart>
        </div>
      </div>
    </div>
  );
}
