import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const _API_URL = process.env.NEXT_PUBLIC_API_URL;

export const allowedRoutesByRole: Record<"admin" | "user", string[]> = {
  admin: ["/dashboard", "/add-device", "/stats", "/admin"],
  user: ["/dashboard", "/add-device"],
};

export const getRoutesByRole = (role: "admin" | "user") => {
  if (role === "admin") return allowedRoutesByRole.admin;
  return allowedRoutesByRole.user;
};
