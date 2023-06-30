import React from "react";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Menu,
  Microscope,
  Moon,
  Sun,
  User
} from "lucide-react";

import { Button } from "@/modules/common/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
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
  DropdownMenuTrigger
} from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../components/ui/sheet";
import { Switch } from "../components/ui/switch";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { useTheme } from "../hooks/useTheme";
import { adminRoutesArray, dashboardRoot } from "../routes";

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <SignedIn>
      <div className={" flex-col flex h-screen"}>
        <div className="flex h-16 shrink-0 items-center px-4 border-b ">
          <Sidebar />
          <Navigation />

          <div className="ml-auto md:flex items-center space-x-4 hidden ">
            <UserMenu />
          </div>
        </div>
        {children}
      </div>
    </SignedIn>
  );
};

const Sidebar = () => {
  return (
    <div className="bloc md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="flex flex-col p-4 w-[300px] transition-none">
          <SheetHeader className="">
            <div className="flex justify-between">
              <ThemeToggle />
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetClose>
                <Button variant="ghost" size={"icon"}>
                  <ChevronLeft />
                </Button>
              </SheetClose>
            </div>
            <Separator />
          </SheetHeader>
          <div className="p-2  grow ">
            <ul className="justify-center flex flex-wrap ">
              {adminRoutesArray.map((route) => (
                <Button key={route.id} variant="ghost" className=" text-left ">
                  <Link href={route.to}>{route.title}</Link>
                </Button>
              ))}
            </ul>
          </div>
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
      <NavigationMenuList>
        <NavigationMenuItem className="mr-3">
          <Link href={dashboardRoot} legacyBehavior passHref>
            <NavigationMenuLink className={'flex  font-bold gap-2 text-neutral-700 dark:text-white'}>
              <Microscope/>
              <span>
                MCRM
              </span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {adminRoutesArray.map((route) => (
          <NavigationMenuItem key={route.id}>
            <Link href={route.to} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {route.title}
              </NavigationMenuLink>
            </Link>
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
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImageUrl} alt={user.username ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
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
          <DropdownMenuItem asChild>
            <Link href={`/${user.id}/settings`}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </Link>
          </DropdownMenuItem>

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
