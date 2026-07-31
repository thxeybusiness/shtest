import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
        <Link
          href="/"
          className="text-neon-ember glow-text font-semibold tracking-tight"
        >
          Jeux de logique
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href="/" className="text-muted transition hover:text-text">
            Campagne
          </Link>
          <Link href="/libre" className="text-muted transition hover:text-text">
            Partie libre
          </Link>
        </nav>
      </div>
    </header>
  );
}
