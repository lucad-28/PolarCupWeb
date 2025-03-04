"use client";
import { toastVariables } from "@/components/ToastVariables";
import { Button } from "@/components/ui/button";
import { Snowflake } from "lucide-react";
import { signOut, useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const onLogin = async () => {
    try {
      await signIn("google", {
        redirect: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onBegin = () => {
    router.replace("/dashboard");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen bg-background">
      <div className="w-full flex flex-row items-center justify-between pt-20 px-8">
        <div className="flex flex-row items-center gap-2">
          <Snowflake size={32} />
          <h1 className="text-2xl font-bold text-survey font-robotoCondensed">
            PolarCup
          </h1>
        </div>

        {session ? (
          <Button
            variant={"outline"}
            className="font-bold text-red-900 outline outline-offset-2 outline-survey border-red-700 hover:border-red-900 hover:bg-red-50 hover:text-red-900 hover:scale-105 transition-transform ease-in-out duration-200"
            onClick={() => {
              signOut({ redirect: true });
            }}
          >
            Log Out
          </Button>
        ) : (
          <Button className="font-semibold text-sm" onClick={onLogin}>
            Log In
          </Button>
        )}
      </div>

      <div className="w-full fixed h-1/2 flex flex-col items-center justify-center gap-2 bg-survey px-10">
        <h2 className="text-3xl font-bold">Welcome</h2>
        <span className="w-full text-center text-lg text-wrap">
          Let's keep it cold with PolarCup
        </span>
        <Button
          variant={"secondary"}
          className="font-semibold text-sm"
          onClick={onBegin}
        >
          Begin
        </Button>
      </div>
    </div>
  );
}
