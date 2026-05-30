import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-4xl flex-col items-center justify-center gap-8 px-6 py-16 text-center sm:px-8">
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Fuel smarter for the long haul
        </h1>
        <p className="text-lg text-foreground/70">
          Plan carbs, fluid, and sodium for your next endurance workout or
          competition. Get concrete fueling options with gels, premade sports
          drink, or a homemade sugar-and-salt mix.
        </p>
      </div>

      <Link
        href="/hydration"
        className="flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Open Hydration Calculator
      </Link>

      <ul className="mt-4 grid max-w-lg gap-3 text-left text-sm text-foreground/70">
        <li className="flex gap-2">
          <span className="text-foreground/40">•</span>
          Carb targets adjusted for duration, intensity, and gut training
        </li>
        <li className="flex gap-2">
          <span className="text-foreground/40">•</span>
          Fluid and sodium scaled to weight, temperature, and sweat rate
        </li>
        <li className="flex gap-2">
          <span className="text-foreground/40">•</span>
          Three fueling strategies with intake schedules
        </li>
      </ul>
    </div>
  );
}
