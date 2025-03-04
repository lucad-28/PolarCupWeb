"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  const onLogin = async () => {
    try {
      await signIn("google", {
        redirect: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="mb-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <span className="text-sm">Log in with Google below</span>
      </div>
      <Button onClick={async () => await onLogin()} className="w-full sm:w-1/2">
        Log In
      </Button>
    </div>
  );
}
