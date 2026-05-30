"use client";

import { useMemo, useState } from "react";
import {
  calculatePlan,
  defaultHydrationInput,
} from "@/lib/hydration/calculate";
import type { HydrationInput } from "@/lib/hydration/types";
import { FuelingResults } from "./fueling-results";
import { HydrationForm } from "./hydration-form";

const summaryCardClass =
  "rounded-xl border border-black/[.08] p-4 text-center dark:border-white/[.145]";

function SummaryStat({
  label,
  perHour,
  total,
  unit,
}: {
  label: string;
  perHour: number;
  total: number;
  unit: string;
}) {
  return (
    <div className={summaryCardClass}>
      <p className="text-sm text-foreground/70">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-2xl font-semibold">
        {perHour}
        <span className="text-base font-normal text-foreground/60">
          {" "}
          {unit}/hr
        </span>
      </p>
      <p className="mt-1 text-sm text-foreground/60">
        {total} {unit} total
      </p>
    </div>
  );
}

export function HydrationCalculator() {
  const [input, setInput] = useState<HydrationInput>(defaultHydrationInput);
  const plan = useMemo(() => calculatePlan(input), [input]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Hydration Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Estimate carbs, fluid, and sodium for your endurance workout or
          competition — then see how to fuel with gels, premade sports drink, or
          a homemade sugar-and-salt mix.
        </p>
      </header>

      <HydrationForm input={input} onChange={setInput} />

      {plan.shortEventNote && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          {plan.shortEventNote}
        </div>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Your targets</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryStat
            label="Carbs"
            perHour={plan.perHour.carbsG}
            total={plan.total.carbsG}
            unit="g"
          />
          <SummaryStat
            label="Fluid"
            perHour={plan.perHour.fluidMl}
            total={plan.total.fluidMl}
            unit="ml"
          />
          <SummaryStat
            label="Sodium"
            perHour={plan.perHour.sodiumMg}
            total={plan.total.sodiumMg}
            unit="mg"
          />
        </div>
      </section>

      <FuelingResults plan={plan} />

      <footer className="rounded-xl border border-black/[.08] px-4 py-3 text-sm text-foreground/60 dark:border-white/[.145]">
        These are educational estimates based on common endurance sports
        nutrition guidelines. Individual needs vary — test any fueling plan in
        training before race day. Not medical advice.
      </footer>
    </div>
  );
}
