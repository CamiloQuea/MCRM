import "@/styles/globals.css";
import type { AppType } from "next/app";
import { api } from "../utils/trpc";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/modules/common/components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NextThemesProvider attribute="class">
      <ClerkProvider {...pageProps}>
        <div className={`${inter.variable} font-inter`}>
          <Component {...pageProps} />
          <Toaster />
        </div>
      </ClerkProvider>
    </NextThemesProvider>
  );
};
export default api.withTRPC(MyApp);
