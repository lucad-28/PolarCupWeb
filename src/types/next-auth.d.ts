import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      devices?: {
        id: string;
        name?: string | null;
      }[];
      role?: "admin";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    devices?: {
      id: string;
      name?: string | null;
    }[];
    role?: "admin";
  }
}
