import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "noir",
    template: "%s · noir",
  },
  description:
    "Rendez l'écran noir. Dix énigmes, chacune avec sa propre logique, aucune expliquée.",
};

export const viewport: Viewport = {
  themeColor: "#070910",
  colorScheme: "dark",
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
          Tout se joue hors ligne, dans votre navigateur.
        </footer>
      </body>
    </html>
  );
}
