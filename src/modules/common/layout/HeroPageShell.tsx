import React from "react";

import { Menu } from "lucide-react";

import { Button } from "@/modules/common/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { dashboardRoot } from "../routes";

export const HeroPageShell = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className=" flex-col md:flex">
      <div className="flex h-16 items-center px-4 border-b">
        <Sheet>
          <SheetTrigger>
            <Button variant={"ghost"} asChild>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Are you sure absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <div className="ml-auto">
          <HeroPageUser />
        </div>
        {/* <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */}
        {/* <HeroPageUser /> */}
      </div>
      {children}
    </div>
  );
};

const HeroPageUser = () => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <Link href="/login">
        <Button variant="ghost" className="relative  rounded">
          Iniciar sesión
        </Button>
      </Link>
    );
  }

  return (
    <Link href={dashboardRoot}>
      <Button variant="ghost" className="relative rounded">
        Ir al panel
      </Button>
    </Link>
  );
};
