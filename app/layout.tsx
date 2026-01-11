import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./navbar";

export const metadata: Metadata = {
  title: 'MangaGuesser - Guess every time',
  description: `Showcase your manga skills!`,
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grid grid-rows-[auto_1fr_auto] h-svh">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
