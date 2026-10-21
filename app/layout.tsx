import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'First in, first out',
  description: 'transfer comes out before stake. A sixth name is refused. Nothing is broadcast.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
