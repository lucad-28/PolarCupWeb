"use client";
import { Button } from "./ui/button";
import clsx from "clsx";
import { NoiseType } from "@/types/noise";

interface NoiseProps {
  noise: NoiseType;
}

export function Noise({ noise }: NoiseProps) {
  if (noise.type === "loading") {
    return (
      <div
        className={clsx(
          "fixed z-[30000] inset-0 flex items-center justify-center bg-white",
          noise.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div
          role="status"
          className={clsx(
            "flex flex-col justify-center items-center gap-4",
            noise.styleType === "modal" && "z-50 bg-white p-5 lg:p-7 rounded-lg"
          )}
        >
          <div className="flex space-x-1 text-lg font-bold text-black">
            Cargando....
          </div>
          <span className="ml-2 font-light text-gray-700 dark:text-gray-200">
            {noise.message || ""}
          </span>
        </div>
      </div>
    );
  }

  if (noise.type === "error") {
    return (
      <div
        className={clsx(
          "fixed  z-[30000] right-0 top-0 w-lvw h-lvh flex items-center justify-center bg-white",
          noise.styleType === "modal" && "bg-black bg-opacity-50"
        )}
      >
        <div className="flex flex-col items-center rounded-lg gap-y-4 py-4 px-10 bg-white shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] overflow-y-auto min-w-min">
          <h1 className="flex items-center text-2xl font-extrabold dark:text-white">
            Error
          </h1>
          <p className="flex flex-col items-center text-sm font-medium text-[#BC1C21] gap-y-4">
            {noise.message || "Algo ha salido mal, vuelve a intentarlo luego."}
          </p>
          <div className="w-2/3 flex flex-col items-center gap-y-2">
            <Button
              onClick={() => {
                window.location.reload();
              }}
              variant={"outline"}
              className="text-black px-4 py-2 rounded-lg w-full min-w-min hover:scale-105 transition-transform"
            >
              Volver a intentar
            </Button>
            <a className="w-full" href="/">
              <Button className="text-white bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg w-full hover:scale-105 transition-transform">
                Ir al inicio
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (noise.type === "success") {
    return (
      <div
        className={clsx(
          "fixed  z-[30000] right-0 top-0 w-lvw h-lvh flex items-center justify-center",
          noise.styleType === "modal" ? "bg-black bg-opacity-50" : "bg-white"
        )}
      >
        <div className="flex flex-col items-center rounded-lg  gap-y-4 px-[18px] py-4 bg-white shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] aspect-square">
          <h1 className="flex items-start text-xl font-extrabold dark:text-white mr-10">
            Exito
          </h1>
          <p className="flex flex-col items-center justify-center text-sm font-bold text-[#2e7d32] mt-3">
            {noise.message || "Todo salio bien."}
          </p>
        </div>
      </div>
    );
  }
}
