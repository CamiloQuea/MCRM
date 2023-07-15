import React from "react";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Menu,
  Microscope,
  Moon,
  Package,
  Sun,
  User,
} from "lucide-react";

import { Button, buttonVariants } from "@/modules/common/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/modules/common/components/ui/navigation-menu";
import { SignedIn, useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Switch } from "../components/ui/switch";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { useTheme } from "../hooks/useTheme";
import { adminRoutes, adminRoutesArray, dashboardRoot } from "../routes";
import Head from "next/head";
import { useRouter } from "next/router";
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Dashboard - MCRM</title>
      </Head>
      <SignedIn>
        <div className={" flex-col flex h-screen"}>
          <header className="border-b py-4 shrink-0 items-center px-4 md:px-10 ">
            <div className="flex items-center pb-0 md:pb-3 ">
              <div className=" md:ml-0  mr-auto">
                <button className="flex gap-2 items-center ">
                  <Package
                    size={28}
                    className="stroke-[1.5px] cursor-pointer inline-block "
                  />
                  <span className="font-medium  tracking-tight ">
                    Inventario
                  </span>
                </button>
              </div>
              <div className="hidden  md:block">
                <UserMenu />
              </div>

              <Sidebar />
            </div>
            <div className="block ">
              <Navigation />
            </div>
          </header>
          {children}
        </div>
      </SignedIn>
    </>
  );
};

const Sidebar = () => {
  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"left"}
          className="p-4   sm:max-w-xs w-full flex flex-col transition-none"
        >
          <SheetHeader className="">
            <div className="flex justify-between">
              <ThemeToggle />
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetClose
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                {/* <Button variant="ghost" size={"icon"}> */}
                <ChevronLeft className="h-[1.2rem] w-[1.2rem] " />
                {/* </Button> */}
              </SheetClose>
            </div>
            <Separator />
          </SheetHeader>

          <ScrollArea className=" flex-1 p-2 ">
            <ul className="flex flex-col gap-3 justify-start">
              {adminRoutesArray.map((route, i) => (
                <li className="block " key={`sidebarItem-${i}`}>
                  {route.type === "link" ? (
                    <Link
                      href={route.to}
                      className="mb-1 rounded-md px-2 py-1 font-semibold hover:underline "
                    >
                      {route.title}
                    </Link>
                  ) : (
                    <div>
                      <h4 className="mb-1 rounded-md px-2 py-1  font-semibold">
                        {route.title}
                      </h4>

                      <ul className="flex flex-col gap-2">
                        {route.children?.map((child, i) => (
                          <li key={`sidebarItemChild-${i}`}>
                            <Link
                              href={child.to}
                              className="group  text-sm inline-block  rounded-md border border-transparent px-2  hover:underline text-muted-foreground"
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
          <Separator />
          <UserSection />
        </SheetContent>
      </Sheet>
    </div>
  );
};

const UserSection = () => {
  const { user } = useUser();

  if (!user) return null;

  const fullname = `${user.firstName} ${user.lastName}`;
  const initials = fullname
    .split(" ")
    .map((n) => n[0])
    .join("");
  const email = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  return (
    <div>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.profileImageUrl} alt={user.username ?? ""} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </div>
  );
};

const Navigation = () => {
  return (
    <NavigationMenu className="hidden md:flex ">
      <NavigationMenuList className="gap-5">
        {adminRoutesArray.map((route) => (
          <NavigationMenuItem key={route.id}>
            {route.type === "link" ? (
              <>
                <Link href={route.to} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {route.title}
                  </NavigationMenuLink>
                </Link>
              </>
            ) : (
              <>
                <NavigationMenuTrigger>{route.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[400px] ">
                    {route.children?.map((child, i) => {
                      return (
                        <Link href={child.to} legacyBehavior passHref key={i}>
                          <NavigationMenuLink
                            className={cn(
                              // navigationMenuTriggerStyle(),
                              "block w-full text-sm font-[400] dark:hover:bg-neutral-800 px-3 py-2 rounded-md  text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100  hover:text-neutral-900 dark:hover:text-neutral-100"
                            )}
                          >
                            {child.title}
                          </NavigationMenuLink>
                        </Link>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const UserMenu = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const { theme, toggle } = useTheme();
  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" className="relative h-8 w-8 rounded">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Loader2 className="h-6 w-6 animate-spin" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </Link>
    );
  }

  const fullname = `${user.firstName} ${user.lastName}`;
  const initials = fullname
    .split(" ")
    .map((n) => n[0])
    .join("");
  const email = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"} className=" rounded-full">
          <Avatar className="w-9 h-9 ">
            <AvatarImage src={user.profileImageUrl} alt={user.username ?? ""} />
            {/* <AvatarFallback>
          
              <Loader2 className="h-6 w-6 animate-spin duration-1000 dark:text-neutral-600" />
            </AvatarFallback> */}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 hidden md:block"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none capitalize">
              {user.firstName
                ? `${user.firstName.toLowerCase()} ${user.lastName?.toLowerCase()}`
                : `${user.username?.toLowerCase()}`}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem asChild>
            <Link href={`/${user.id}/settings`}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
               <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> 
            </Link>
          </DropdownMenuItem> */}

          <DropdownMenuLabel
            onClick={() => toggle()}
            className="flex items-center font-normal"
          >
            {theme === "dark" ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            <span>Tema oscuro</span>

            <Switch checked={theme === "dark"} className="ml-auto" />
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesi&oacute;n</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
