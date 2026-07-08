import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { getLocales, GTProvider } from "gt-next";
import { getGT } from "gt-next/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return getLocales().map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();
  return {
    title: gt("TaskFlow"),
    description: gt("Manage your tasks efficiently"),
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={cn(
        "h-full",
        "dark",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <GTProvider>
          {children} <Toaster richColors />
        </GTProvider>
      </body>
    </html>
  );
}
