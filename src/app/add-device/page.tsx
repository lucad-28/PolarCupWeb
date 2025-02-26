import { DeviceForm } from "@/components/DeviceForm";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center space-y-4 p-4 h-full">
      <div className="max-w-screen-lg w-full flex flex-col space-y-4 mt-4 p-4 border border-gray-200 bg-primary/60 rounded-lg shadow-lg">
        <DeviceForm />
      </div>
    </div>
  );
}
