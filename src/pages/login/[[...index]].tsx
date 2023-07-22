import { Button } from "@/modules/common/components/ui/button";
import { Input } from "@/modules/common/components/ui/input";
import { ThemeToggle } from "@/modules/common/components/ui/theme-toggle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/modules/common/components/ui/form";
import { useToast } from "@/modules/common/components/ui/use-toast";
import { useZodForm } from "@/modules/common/hooks/useZodForm";
import { useSignIn } from "@clerk/nextjs";
import { ChevronLeft, Command } from "lucide-react";
import { z } from "zod";

export default function Page() {
  const { toast } = useToast();
  const form = useZodForm({
    schema: z.object({
      username: z.string(),
      password: z.string(),
    }),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { signIn, setActive } = useSignIn();

  const onSubmit = form.handleSubmit(async ({ password, username }) => {
   
    await signIn
      ?.create({
        identifier: username,
        password,
      })
      .then((result) => {
        if (result.status === "complete") {
          toast({
            title: "Sesión iniciada",
          });
          setActive({ session: result.createdSessionId });
        } else {
          // console.log(result);
        }
      })
      .catch((err) => {
        console.log(err.errors[0].code);
        if (
          err.errors[0].code === "form_password_incorrect" ||
          err.errors[0].code === "form_identifier_not_found"
        )
          toast({
            title: "Usuario o contraseña incorrectos",
          });
        // err.errors[0].message === "Invalid password"
      });
  });

  return (
    <div className=" relative h-screen flex-col items-center  md:grid lg:max-w-none lg:grid-cols-[35rem_1fr] lg:px-0">
      <div className=" h-full dark:bg-neutral-900 bg-white flex flex-col  justify-center">
        <div className="mx-auto  w-[350px] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Button variant={"ghost"} size={"icon"}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <ThemeToggle />
          </div>
          <h1 className=" text-3xl font-medium">Iniciar sesi&oacute;n</h1>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Administrador"
                        {...field}
                        type="text"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 w-full">
                Ingresar
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-blue-600" />
        <div className="relative ml-auto z-20 flex items-center text-lg font-medium">
          MCRM <Command className="mr-2 ml-3 h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
