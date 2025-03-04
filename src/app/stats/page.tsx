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
  ResponsiveContainer,
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { GalleryHorizontalEnd, GalleryVertical } from "lucide-react";
import { SingleSelect } from "@/components/SingleSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { NoiseType } from "@/types/noise";
import { Noise } from "@/components/Noise";
import { Device } from "@/types/device";
import { predictS } from "@/db/service/predict";
import { Predict } from "@/types/predict";

const _TABS: Tab[] = [
  {
    id: "all",
    label: "All Devices",
    description: "All data collected by the devices at 15-minute intervals.",
    icon: <GalleryHorizontalEnd />,
  },
  {
    id: "one",
    label: "By Device",
    description: "The actual data collected by a device.",
    icon: <GalleryVertical />,
  },
];

export default function Page() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<History[]>([]);
  const [resampled, setResampled] = useState<History[]>([]);
  const [displayResampled, setDisplayResampled] = useState<History[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>(_TABS[0]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>();
  const [predicts, setPredicts] = useState<Predict[]>([]);
  const [noise, setNoise] = useState<NoiseType | null>({
    message: "Exploring your devices....",
    type: "loading",
    styleType: "page",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let _h: History[] = [];
        let _hResampled: History[] = [];
        let _devices: Device[] = [];
        const now = new Date();
        if (session?.user.devices && session?.user.devices.length > 0) {
          if (session?.user.role !== "admin") {
            _h = await historyS.getAllByDeviceIds(
              session?.user.devices.map((d) => d.id)
            );

            _hResampled = await historyS.getResampledByDeviceIds(
              session?.user.devices.map((d) => d.id)
            );

            _devices = session.user.devices.map((d) => ({
              id: d.id,
              name: d.name || `Device ${d.id.slice(0, 4)}`,
              createdAt: new Date(),
            }));
          } else {
            _h = await historyS.getAll();

            _hResampled = await historyS.getResampled();
            _devices = _h.map((h) => ({
              id: h.deviceId,
              name: `Dispositivo ${h.deviceId.slice(0, 4)}`,
              createdAt: new Date(),
            }));
          }
        }

        _h = _h.map((h) => {
          return {
            ...h,
            data: h.data
              .filter((d) => new Date(d.timestamp) < now)
              .map((d) => {
                return {
                  ...d,
                  cooling: Number(d.cooling) > 0 ? 1 : 0,
                };
              }),
          };
        });

        _hResampled = _hResampled.map((h) => {
          return {
            ...h,
            data: h.data
              .filter((d) => new Date(d.timestamp) < now)
              .map((d) => {
                return {
                  ...d,
                  cooling: Number(d.cooling) > 0 ? 1 : 0,
                };
              }),
          };
        });

        console.log("Iniciando predict -");
        const _predicts = await predictS.getPredictByDevicesIds({
          deviceIds: _devices.map((d) => d.id),
          time: new Date(),
        });
        console.log(_predicts);
        setPredicts(_predicts);
        setResampled(_hResampled);
        setDisplayResampled(
          _hResampled.map((h) => {
            return {
              ...h,
              data: h.data.filter(
                (d) =>
                  d.temperature !== null ||
                  d.volume !== null ||
                  d.cooling !== null
              ),
            };
          })
        );
        setHistory(_h);
        setDevices(_devices);
        setNoise(null);
      } catch (err) {
        console.error(err);
        setNoise({
          message: "Error al obtener la información",
          type: "error",
          styleType: "page",
        });
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

  if (noise && noise.styleType === "page") return <Noise noise={noise} />;

  return (
    <div className="w-full h-full max-w-screen-lg grid grid-rows-[auto,1fr] mx-auto items-center py-5">
      {noise && <Noise noise={noise} />}
      <div className="w-full h-full flex items-center justify-center">
        <TabButtons
          tabs={_TABS}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
          }}
        />
      </div>

      <div className="w-full flex flex-col space-y-2 mx-auto mt-8 border border-gray-200 bg-primary/60 rounded-lg shadow-lg p-2">
        <div className="w-full flex flex-col space-y-2 pl-4 pt-4">
          {activeTab.id === "one" && (
            <div className="w-[80%] sm:w-1/2 md:w-1/3">
              <span className="font-light">Select a Device</span>
              <SingleSelect
                options={devices.map((d) => ({
                  label: d.name || `Dispositivo ${d.id.slice(0, 4)}`,
                  value: d.id,
                }))}
                onChange={(value) => {
                  setSelectedDevice(value);
                }}
              />
            </div>
          )}
          {selectedDevice && (
            <div className="flex flex-col space-y-1 ml-8">
              <span className="font-bold">
                {devices.find((d) => d.id === selectedDevice)?.name ||
                  `Device ${selectedDevice.slice(0, 4)}`}
              </span>
              <span className="font-light">
                Device Id: <span className="font-medium">{selectedDevice}</span>
              </span>
            </div>
          )}
          {activeTab.id === "all" && (
            <div className="w-full sm:w-1/2 lg:w-1/3">
              <div className="w-full flex flex-row space-x-2">
                <Checkbox
                  defaultChecked={false}
                  onCheckedChange={(checked) => {
                    if (!checked)
                      setDisplayResampled((prev) => {
                        return prev.map((h) => {
                          return {
                            ...h,
                            data: h.data.filter(
                              (d) =>
                                d.temperature !== null ||
                                d.volume !== null ||
                                d.cooling !== null
                            ),
                          };
                        });
                      });
                    else {
                      setDisplayResampled(resampled);
                    }
                  }}
                />
                <span className="font-light text-sm">
                  Show empty data points
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-full flex flex-col pr-4 items-center justify-center">
          <div className="w-full flex flex-col md:flex-row items-center justify-center space-x-4">
            <div className="w-full flex flex-col items-center justify-center space-y-1">
              <span className="font-light text-sm">
                Temperature data collected
              </span>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="timestamp" tickFormatter={formatDate} />
                  <YAxis interval={"preserveStart"} dataKey={"temperature"} />
                  {activeTab.id === "all" ? (
                    displayResampled.map((h) => (
                      <Line
                        key={h.deviceId}
                        name={h.deviceId}
                        type="monotone"
                        dataKey="temperature"
                        stroke="#59150E"
                        data={h.data}
                      />
                    ))
                  ) : (
                    <>
                      <Tooltip
                        formatter={(value: ValueType) =>
                          value !== null
                            ? `${Number(value).toFixed(2)} ºC`
                            : null
                        }
                        labelFormatter={(value: ValueType) =>
                          formatDate(new Date(value as number))
                        }
                        filterNull={false}
                      />
                      <Line
                        key={selectedDevice}
                        name={"Temperature"}
                        type="monotone"
                        dataKey="temperature"
                        stroke="#59150E"
                        data={
                          history.find((h) => h.deviceId === selectedDevice)
                            ?.data ?? []
                        }
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            {selectedDevice &&
              predicts.find((p) => p.deviceId === selectedDevice) && (
                <div className="w-full flex flex-col my-3 md:my-0 md:w-[50%] items-center justify-center space-y-1 ml-8 bg-primary rounded-lg p-2 shadow-lg">
                  <span className="font-light">Temperature</span>
                  <span className="font-bold text-4xl">
                    {`${Number(
                      predicts.find((p) => p.deviceId === selectedDevice)
                        ?.meanTemperature
                    ).toFixed(2)} ºC`}
                  </span>
                  <span className="font-light">
                    Estimated for the next 2 hours
                  </span>
                </div>
              )}
          </div>

          <span className="font-light text-sm">Volume data collected</span>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={600}
              height={300}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="timestamp" tickFormatter={formatDate} />
              <YAxis interval={"preserveStart"} dataKey={"volume"} />
              {activeTab.id === "all" ? (
                displayResampled.map((h) => (
                  <Line
                    key={h.deviceId}
                    name={h.deviceId}
                    type="monotone"
                    dataKey="volume"
                    stroke="#3E606F"
                    data={h.data}
                  />
                ))
              ) : (
                <>
                  <Tooltip
                    formatter={(value: ValueType) =>
                      value !== null ? `${Number(value).toFixed(2)} ml` : null
                    }
                    labelFormatter={(value: ValueType) =>
                      formatDate(new Date(value as number))
                    }
                    filterNull={false}
                  />
                  <Line
                    key={selectedDevice}
                    name={"Volume"}
                    type="monotone"
                    dataKey="volume"
                    stroke="#3E606F"
                    data={
                      history.find((h) => h.deviceId === selectedDevice)
                        ?.data ?? []
                    }
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>

          <span className="font-light text-sm">Cooling data collected</span>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={600}
              height={300}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="timestamp" tickFormatter={formatDate} />
              <YAxis interval={"preserveStart"} dataKey={"cooling"} />
              {activeTab.id === "all" ? (
                displayResampled.map((h) => (
                  <Line
                    key={h.deviceId}
                    name={h.deviceId}
                    type="monotone"
                    dataKey="cooling"
                    stroke="#10403B"
                    data={h.data}
                  />
                ))
              ) : (
                <>
                  <Tooltip
                    formatter={(value: ValueType) =>
                      value !== null
                        ? `${Number(value) === 0 ? "No" : "Si"}`
                        : null
                    }
                    labelFormatter={(value: ValueType) =>
                      formatDate(new Date(value as number))
                    }
                    filterNull={false}
                  />
                  <Line
                    key={selectedDevice}
                    name={"Cooling"}
                    type="monotone"
                    dataKey="cooling"
                    stroke="#10403B"
                    data={
                      history.find((h) => h.deviceId === selectedDevice)
                        ?.data ?? []
                    }
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
