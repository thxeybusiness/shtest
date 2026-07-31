import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "Jeux de logique",
    template: "%s · Jeux de logique",
  },
  description:
    "Sudoku, démineur, mastermind, taquin et casse-têtes de logique à jouer directement dans le navigateur.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border px-5 py-6 text-center text-sm text-muted">
          Jeux de logique — tout se joue hors ligne, dans votre navigateur.
        </footer>
      </body>
    </html>
  );
}
