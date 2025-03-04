"use client";
import React, { useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { userS } from "@/db/service/users";
import { useSession } from "next-auth/react";
import { Noise } from "@/components/Noise";
import { NoiseType } from "@/types/noise";
import { toastVariables } from "@/components/ToastVariables";

const deviceSchema = z.object({
  id: z.string({ message: "Device's id is required" }).min(1, {
    message: "Device's id is required",
  }),
  name: z.string({ message: "Name is required" }).min(1, {
    message: "Name is required",
  }),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

export const DeviceForm = () => {
  const { data: session } = useSession();
  const [noise, setNoise] = useState<NoiseType | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      id: "",
      name: "",
    },
  });

  const onSubmit = async (data: DeviceFormValues) => {
    try {
      setNoise({
        message: "Adding device...",
        type: "loading",
        styleType: "modal",
      });

      console.log(data);
      if (!session?.user.email) throw new Error("User not found");
      await userS.addDeviceById(session?.user.email, data);
      session.user.devices = [
        ...(session.user.devices || []),
        { id: data.id, name: data.name },
      ];

      setNoise(null);
      reset();

      toastVariables.success("Device added successfully.");
    } catch (error) {
      setNoise(null);
      reset();
      if (error instanceof Error) {
        if (error.message === "Device not found") {
            setError("root", {
            type: "manual",
            message: "This device does not exist.",
            });
          return;
        } else if (error.message === "Device already added") {
          setError("id", {
            type: "manual",
            message: "This device is already added.",
          });
          return;
        }
      }

      toastVariables.error("Error adding device.");
      console.error(error);
    }
  };

  if (noise && noise.styleType === "page") return <Noise noise={noise} />;

  return (
    <div className="flex flex-col space-y-3 m-4">
      {noise && <Noise noise={noise} />}
      <h1>Device Form</h1>
      <div className="w-full flex flex-col mx-auto space-y-3 sm:w-1/2 lg:w-1/3">
        <label>Device Id</label>
        <Controller
          control={control}
          name="id"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="ASLKNJAG..."
              className="input"
            />
          )}
        />
        {errors.id && <p className="text-red-900">{errors.id.message}</p>}

        <label>Device Name</label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Primero..."
              className="input"
            />
          )}
        />
        {errors.name && <p className="text-red-900">{errors.name.message}</p>}

        {errors.root && <p className="text-red-900">{errors.root.message}</p>}
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </div>
    </div>
  );
};
