"use client";

import { LogOutIcon } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-crudo/80 hover:bg-crudo/10 hover:text-crudo md:h-9 md:w-full md:justify-start md:gap-2 md:px-3 md:text-sm"
      onClick={() => logout()}
    >
      <LogOutIcon aria-hidden />
      Cerrar sesión
    </Button>
  );
}
