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
  id: z.string({ message: "El id es requerido" }).min(1, {
    message: "El id es requerido",
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
    },
  });

  const onSubmit = async (data: DeviceFormValues) => {
    try {
      setNoise({
        message: "Agregando dispositivo...",
        type: "loading",
        styleType: "modal",
      });

      console.log(data);
      if (!session?.user.email) throw new Error("User not found");
      await userS.addDeviceById(session?.user.email, data.id);
      session.user.devices = [...(session.user.devices || []), data.id];

      setNoise(null);
      reset();

      toastVariables.success("Se agrego el dispositivo correctamente.");
    } catch (error) {
      setNoise(null);
      reset();
      if (error instanceof Error) {
        if (error.message === "Device not found") {
          setError("root", {
            type: "manual",
            message: "Este dispositivo no existe.",
          });
          return;
        } else if (error.message === "Device already added") {
          setError("id", {
            type: "manual",
            message: "Este dispositivo ya ha sido agregado por usted.",
          });
          return;
        }
      }

      toastVariables.error("Ocurrio un error al agregar el dispositivo.");
      console.error(error);
    }
  };

  if (noise && noise.styleType === "page") return <Noise noise={noise} />;

  return (
    <div className="flex flex-col space-y-3 m-4">
      {noise && <Noise noise={noise} />}
      <h1>Formulario de Dispositivo</h1>
      <div className="w-full flex flex-col mx-auto space-y-3 sm:w-1/2 lg:w-1/3">
        <label>Identificador del Dispositivo</label>
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
        {errors.root && <p className="text-red-900">{errors.root.message}</p>}
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </div>
    </div>
  );
};
