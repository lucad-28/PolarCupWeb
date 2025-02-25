"use client";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-foreground">
      <div className="w-full md:w-1/2 rounded-lg outline outline-4 outline-offset-8 p-6 mx-6 outline-primary bg-background">
        {children}
      </div>
    </main>
  );
}
