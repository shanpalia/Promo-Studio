import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promo Studio — Create videos that promote",
  description: "A professional promotional video editor for creators and businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
