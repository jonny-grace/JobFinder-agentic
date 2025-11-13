// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alpixn — Articles",
  description:
    "Explore articles, categories, and resources with a polished dark UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-bg text-text-base">
        {children}
      </body>
    </html>
  );
}