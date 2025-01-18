import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import Header from "../components/Header";
import QueryProvider from "../provider/QueryProvider";
import "../globals.css";
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
      <body>
        <div
          className={
            "mx-auto w-full  bg-background border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x flex justify-center items-center overflow-hidden relative "
          }
        >
          <SidebarProvider>
            <AppSidebar />

            <main
              className="
          md:px-6 lg:px-10
          px-4
          py-4
          h-screen overflow-y-auto scrollbar-hidden relative flex min-h-svh flex-1 flex-col peer-data-[variant=floating]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=floating]:mb-4 md:peer-data-[state=collapsed]:peer-data-[variant=floating]:ml-2 md:peer-data-[variant=floating]:ml-0  md:peer-data-[variant=floating]:rounded-xl 
          md:peer-data-[variant=floating]:shadow 
          border
          
          group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border
          "
            >
              <Header />

              <SidebarTrigger />
              <QueryProvider>
              {children}
              </QueryProvider>
            </main>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
