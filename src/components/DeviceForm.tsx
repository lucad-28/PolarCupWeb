"use client";
import React from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { userS } from "@/db/service/users";
import { useSession } from "next-auth/react";

const deviceSchema = z.object({
  id: z.string({ message: "El id es requerido" }).min(1, {
    message: "El id es requerido",
  }),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

export const DeviceForm = () => {
  const { data: session } = useSession();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      id: "",
    },
  });

  const onSubmit = async (data: DeviceFormValues) => {
    try {
      try {
        console.log(data);
        if (!session?.user.email) throw new Error("User not found");
        await userS.addDeviceById(session?.user.email, data.id);
        session.user.devices = [...(session.user.devices || []), data.id];
        window.location.reload();
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Device not found") {
            setError("root", {
              type: "manual",
              message: "El dispositivo no existe",
            });
            return;
          } else if (error.message === "Device already added") {
            setError("id", {
              type: "manual",
              message: "El dispositivo ya fue agregado",
            });
            return;
          }
        }

        throw error;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col space-y-3 m-4">
      <h1>Device form</h1>
      <div>
        <Controller
          control={control}
          name="id"
          render={({ field }) => (
            <input {...field} type="text" placeholder="Id" className="input" />
          )}
        />
        {errors.id && <p className="text-red-900">{errors.id.message}</p>}
      </div>
      {errors.root && <p className="text-red-900">{errors.root.message}</p>}
      <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
    </div>
  );
};
