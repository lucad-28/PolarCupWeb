"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Session } from "next-auth";
import {
  LogOut,
  NotebookPen,
  SquareDashedKanban,
  ChartLine,
  ShieldPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Option {
  onClick?: () => void;
  onRedirect?: (router: ReturnType<typeof useRouter>) => void;
  icon?: React.ReactNode;
  label: string;
  className?: string;
}

interface SideBarProps {
  session: Session;
  options?: Option[];
}

export const SideBar = ({ session, options }: SideBarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="h-10 rounded-full border-0 p-0 pl-3 mr-3 bg-white hover:bg-slate-100 hover:scale-105 ease-in-out transform transition">
          {session?.user?.name && (
            <span className="sm:block ml-2 text-secondary-foreground hover:text-slate-800 font-semibold mr-2">
              {session.user.name}
            </span>
          )}
          <Avatar className="hover:scale-90 ease-in-out transform transition">
            {session?.user?.image && session.user.name ? (
              <AvatarImage src={session.user.image} alt={session.user.name} />
            ) : (
              <AvatarImage src={"images/avatar-default.svg"} alt={"user"} />
            )}
          </Avatar>
        </Button>
      </SheetTrigger>
      <VisuallyHidden>
        <SheetTitle>User Menu</SheetTitle>
      </VisuallyHidden>
      <SheetContent
        aria-describedby={undefined}
        side="right"
        className="w-[300px] sm:w-[400px]"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">User Menu</h2>
            <div className="space-y-4">
              <MenuOptions
                options={
                  options || getElementRouteByRole(session.user.role || "user")
                }
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            className="justify-start mt-auto text-red-800 hover:bg-red-900 hover:text-primary"
            onClick={async () => {
              await signOut();
              setOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const MenuOptions = ({
  options,
  onClose,
}: {
  options: Option[];
  onClose: () => void;
}) => {
  const router = useRouter();

  return options.map((option, index) => (
    <Button
      key={index}
      variant="ghost"
      className={cn("w-full justify-start", option.className)}
      onClick={() => {
        option.onClick?.();
        option.onRedirect?.(router);
        onClose();
      }}
    >
      {option.icon}
      {option.label}
    </Button>
  ));
};

const AddDeviceRoute: Option = {
  label: "Add Device",
  icon: <NotebookPen className="mr-2 h-4 w-4" />,
  onRedirect: (router) => router.replace("/add-device"),
};

const DashboardRoute: Option = {
  label: "Dashboard",
  icon: <SquareDashedKanban className="mr-2 h-4 w-4" />,
  onRedirect: (router) => router.replace("/dashboard"),
};

const StatsRoute: Option = {
  label: "Stats",
  icon: <ChartLine className="mr-2 h-4 w-4" />,
  onRedirect: (router) => router.replace("/stats"),
};

const AdminRoute: Option = {
  label: "Admin",
  icon: <ShieldPlus className="mr-2 h-4 w-4" />,
  onRedirect: (router) => router.replace("/admin"),
};

const RouteByRole: Record<"admin" | "user", Option[]> = {
  admin: [DashboardRoute, AddDeviceRoute, StatsRoute, AdminRoute],
  user: [DashboardRoute, AddDeviceRoute, StatsRoute],
};

const getElementRouteByRole = (role: "admin" | "user") => {
  if (role === "admin") return RouteByRole.admin;
  return RouteByRole.user;
};
