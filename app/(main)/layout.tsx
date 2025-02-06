import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import Header from "../components/Header";
import QueryProvider from "../provider/QueryProvider";
import "../globals.css";
import { DocumentTitleProvider } from "@/hooks/DocumentTitleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechDoc",
  description: "tech doc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/fonts.css"
        />
        <link
          rel="preload"
          href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/SF-Pro.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <div
          className={
            "mx-auto w-full bg-background border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x flex justify-center items-center overflow-hidden relative"
          }
        >
          <QueryProvider>
            <SidebarProvider>
              <AppSidebar />

              <main
                className="
          h-screen overflow-y-auto scrollbar-hidden relative flex min-h-svh flex-1 flex-col peer-data-[variant=floating]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=floating]:mb-4 md:peer-data-[state=collapsed]:peer-data-[variant=floating]:ml-2 md:peer-data-[variant=floating]:ml-0  md:peer-data-[variant=floating]:rounded-xl 
          md:peer-data-[variant=floating]:shadow 
          border
          
          group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border
          "
              >
                <DocumentTitleProvider>
                  <Header />
                  {children}
                </DocumentTitleProvider>
              </main>
            </SidebarProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
