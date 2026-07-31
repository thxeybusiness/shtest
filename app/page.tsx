const steps = [
  {
    title: "Dépôt GitHub",
    detail: "thxeybusiness/shtest — branche main",
  },
  {
    title: "Projet Vercel",
    detail: "shtest — équipe Thomas",
  },
  {
    title: "Déploiement",
    detail: "Chaque push sur main part en production",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-6 py-20">
      <header className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center rounded-full border border-current/15 px-3 py-1 text-xs font-medium tracking-wide uppercase opacity-70">
          En ligne
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          shtest
        </h1>
        <p className="text-base opacity-70">
          Le squelette est déployé. Le contenu réel reste à construire.
        </p>
      </header>

      <ul className="flex flex-col gap-px overflow-hidden rounded-xl border border-current/10 bg-current/5">
        {steps.map((step) => (
          <li
            key={step.title}
            className="flex flex-col gap-1 bg-[var(--background)] px-5 py-4"
          >
            <span className="text-sm font-medium">{step.title}</span>
            <span className="text-sm opacity-60">{step.detail}</span>
          </li>
        ))}
      </ul>

      <footer className="text-sm opacity-50">
        Next.js 16 · React 19 · Tailwind CSS 4
      </footer>
    </main>
  );
}
