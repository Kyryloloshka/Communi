import "@/app/globals.css";
import StoreProvider from "@/components/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { store } from "@/state";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["100", "200", "300", "400", "600", "700"],
  subsets: ["latin", "cyrillic"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={
          "min-h-screen bg-light-2 text-dark-3 antialiased dark:bg-dark-1 dark:text-white " +
          inter.className
        }
      >
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
