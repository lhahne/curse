import Link from "next/link";

const navLinkClass =
  "text-sm font-medium text-foreground/70 transition-colors hover:text-foreground";

export function SiteHeader() {
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Endurance Fuel
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className={navLinkClass}>
            Home
          </Link>
          <Link
            href="/hydration"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Calculator
          </Link>
        </nav>
      </div>
    </header>
  );
}
