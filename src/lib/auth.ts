import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { userS } from "@/db/service/users";
import { cert } from "firebase-admin/app";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  }),
  callbacks: {
    async jwt({ token }) {
      if (token) {
        if (token.email && typeof token.email === "string") {
          try {
            const devices = await userS.getUserDevicesByEmail(token.email);
            token.devices = devices;
          } catch {
            const { devices, ..._token } = token;
            token = _token;
          }

          try {
            const user = await userS.getUserByEmail(token.email as string);
            if (user?.role) token.role = user.role;
          } catch {
            const { role, ..._token } = token;
            token = _token;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log(token, session);
      if (token.sub) {
        session.user.id = token.sub;

        if (token.role) session.user.role = token.role;

        if (token.devices) {
          session.user.devices = token.devices;
        }
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
};
