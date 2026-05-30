"use client";

import { useState } from "react";
import type { FuelingStrategy, HydrationPlan } from "@/lib/hydration/types";
import { IntakeSchedule } from "./intake-schedule";

type FuelingResultsProps = {
  plan: HydrationPlan;
};

const tabs: { id: FuelingStrategy; label: string }[] = [
  { id: "gels", label: "Gels + water" },
  { id: "premade", label: "Premade drink" },
  { id: "homemade", label: "Homemade drink" },
];

const cardClass =
  "rounded-2xl border border-black/[.08] p-5 dark:border-white/[.145]";
const statClass =
  "font-[family-name:var(--font-geist-mono)] text-lg font-semibold";

function NotesList({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2 text-sm text-foreground/80">
      {notes.map((note) => (
        <li key={note} className="flex gap-2">
          <span className="text-foreground/40">•</span>
          <span>{note}</span>
        </li>
      ))}
    </ul>
  );
}

function GelsPanel({ plan }: { plan: HydrationPlan }) {
  const { gels } = plan;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-foreground/70">Energy gels</p>
          <p className={statClass}>{gels.gelCount}</p>
        </div>
        <div>
          <p className="text-sm text-foreground/70">Total carbs</p>
          <p className={statClass}>{gels.totalCarbsG} g</p>
        </div>
        <div>
          <p className="text-sm text-foreground/70">Water to carry</p>
          <p className={statClass}>{(gels.waterMl / 1000).toFixed(1)} L</p>
        </div>
      </div>
      {gels.extraSodiumMg > 0 && (
        <p className="mt-4 text-sm">
          Sodium gap from gels:{" "}
          <span className="font-[family-name:var(--font-geist-mono)] font-medium">
            {gels.extraSodiumMg} mg
          </span>{" "}
          — add salt or electrolyte tabs to your water.
        </p>
      )}
      <NotesList notes={gels.notes} />
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">
          Intake schedule
        </h3>
        <IntakeSchedule schedule={gels.schedule} />
      </div>
    </div>
  );
}

function PremadePanel({ plan }: { plan: HydrationPlan }) {
  const { premadeDrink } = plan;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-foreground/70">Total drink volume</p>
          <p className={statClass}>
            {(premadeDrink.totalVolumeMl / 1000).toFixed(1)} L
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/70">Bottles</p>
          <p className={statClass}>
            {premadeDrink.bottleCount} × {premadeDrink.bottleSizeMl} ml
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/70">Total carbs</p>
          <p className={statClass}>{premadeDrink.totalCarbsG} g</p>
        </div>
      </div>
      {premadeDrink.extraWaterMl > 0 && (
        <p className="mt-4 text-sm">
          Additional plain water:{" "}
          <span className="font-[family-name:var(--font-geist-mono)] font-medium">
            {premadeDrink.extraWaterMl} ml
          </span>
        </p>
      )}
      <NotesList notes={premadeDrink.notes} />
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">
          Intake schedule
        </h3>
        <IntakeSchedule schedule={premadeDrink.schedule} />
      </div>
    </div>
  );
}

function HomemadePanel({ plan }: { plan: HydrationPlan }) {
  const { homemadeDrink } = plan;
  const { recipe } = homemadeDrink;

  return (
    <div>
      <div className="mb-4 rounded-xl bg-black/[.03] p-4 dark:bg-white/[.04]">
        <p className="mb-2 text-sm font-medium">Per {recipe.bottleSizeMl} ml bottle</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <p className="text-sm">
            Table sugar:{" "}
            <span className="font-[family-name:var(--font-geist-mono)] font-semibold">
              {recipe.sugarG} g
            </span>
          </p>
          <p className="text-sm">
            Table salt:{" "}
            <span className="font-[family-name:var(--font-geist-mono)] font-semibold">
              {recipe.saltG} g
            </span>
          </p>
          <p className="text-sm">
            Carbs per bottle:{" "}
            <span className="font-[family-name:var(--font-geist-mono)] font-semibold">
              {recipe.carbsG} g
            </span>
          </p>
          <p className="text-sm">
            Sodium per bottle:{" "}
            <span className="font-[family-name:var(--font-geist-mono)] font-semibold">
              {recipe.sodiumMg} mg
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-foreground/70">Bottles to mix</p>
          <p className={statClass}>{homemadeDrink.bottleCount}</p>
        </div>
        <div>
          <p className="text-sm text-foreground/70">Total volume</p>
          <p className={statClass}>
            {(homemadeDrink.totalVolumeMl / 1000).toFixed(1)} L
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/70">Extra gels</p>
          <p className={statClass}>{homemadeDrink.supplementalGels}</p>
        </div>
      </div>

      <NotesList notes={homemadeDrink.notes} />
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">
          Intake schedule
        </h3>
        <IntakeSchedule schedule={homemadeDrink.schedule} />
      </div>
    </div>
  );
}

export function FuelingResults({ plan }: FuelingResultsProps) {
  const [activeTab, setActiveTab] = useState<FuelingStrategy>("gels");

  return (
    <section className={cardClass}>
      <h2 className="mb-4 text-lg font-semibold">How to take it in</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-foreground text-background"
                : "border border-black/[.08] hover:bg-black/[.03] dark:border-white/[.145] dark:hover:bg-white/[.06]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "gels" && <GelsPanel plan={plan} />}
      {activeTab === "premade" && <PremadePanel plan={plan} />}
      {activeTab === "homemade" && <HomemadePanel plan={plan} />}
    </section>
  );
}
