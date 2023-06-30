import "@/styles/globals.css";
import type { AppType } from "next/app";
import { api } from "../utils/trpc";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/modules/common/components/ui/toaster";
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NextThemesProvider attribute="class">
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
        <Toaster />
      </ClerkProvider>
    </NextThemesProvider>
  );
};
export default api.withTRPC(MyApp);
