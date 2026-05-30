import Image from "next/image";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-center text-sm/6 sm:text-left">
          <li className="mb-2 tracking-[-0.01em]">
            Get started by editing{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-[family-name:var(--font-geist-mono)] font-semibold dark:bg-white/[.06]">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-0.01em]">
            Deploy to Cloudflare Workers with{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-[family-name:var(--font-geist-mono)] font-semibold dark:bg-white/[.06]">
              npm run deploy
            </code>
            .
          </li>
        </ol>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:w-auto sm:px-5 sm:text-base"
            href="https://opennext.js.org/cloudflare/get-started"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenNext on Cloudflare
          </a>
          <a
            className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:w-auto sm:px-5 sm:text-base"
            href="https://developers.cloudflare.com/workers/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare Workers docs
          </a>
        </div>
      </main>
    </div>
  );
}
