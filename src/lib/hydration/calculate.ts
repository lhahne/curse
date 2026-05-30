import {
  DEFAULT_BOTTLE_SIZE_ML,
  FLUID_MAX_ML_HR,
  FLUID_MIN_ML_HR,
  FLUID_ML_PER_KG_HR,
  GEL_CARBS_G,
  GEL_SODIUM_MG,
  GUT_TRAINING_CAPS,
  HOMEMADE_CARB_PERCENT,
  INTENSITY_MULTIPLIERS,
  MIN_GEL_INTERVAL_MINUTES,
  PREMADE_CARBS_G_PER_240ML,
  PREMADE_SODIUM_MG_PER_240ML,
  SODIUM_BASE_MG_HR,
  SODIUM_MAX_MG_HR,
  SODIUM_MG_PER_G_SALT,
  SODIUM_MIN_MG_HR,
  SWEAT_RATE_MULTIPLIERS,
  TEMPERATURE_MULTIPLIERS,
} from "./constants";
import type {
  DrinkPlan,
  GelPlan,
  HomemadePlan,
  HydrationInput,
  HydrationPlan,
  NutrientTargets,
  ScheduleEntry,
  SweatRate,
} from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getBaseCarbsPerHour(durationMinutes: number): number {
  if (durationMinutes < 60) return 0;
  if (durationMinutes < 150) return 30;
  if (durationMinutes <= 180) return 45;
  return 60;
}

function getSweatMultipliers(sweatRate?: SweatRate) {
  if (!sweatRate) {
    return { fluid: 1, sodium: 1 };
  }
  return SWEAT_RATE_MULTIPLIERS[sweatRate];
}

function calculateTargets(input: HydrationInput): {
  durationHours: number;
  perHour: NutrientTargets;
  total: NutrientTargets;
  shortEventNote?: string;
} {
  const durationHours = input.durationMinutes / 60;
  const intensity = INTENSITY_MULTIPLIERS[input.intensity];
  const temperature = TEMPERATURE_MULTIPLIERS[input.temperature];
  const sweat = getSweatMultipliers(input.sweatRate);
  const gutCap = GUT_TRAINING_CAPS[input.gutTraining];

  const baseCarbsPerHour = getBaseCarbsPerHour(input.durationMinutes);
  const carbsPerHour = round(
    Math.min(baseCarbsPerHour * intensity.carbs, gutCap),
  );

  const fluidPerHour = round(
    clamp(
      input.weightKg *
        FLUID_ML_PER_KG_HR *
        intensity.fluid *
        temperature.fluid *
        sweat.fluid,
      FLUID_MIN_ML_HR,
      FLUID_MAX_ML_HR,
    ),
  );

  const sodiumPerHour = round(
    clamp(
      SODIUM_BASE_MG_HR * temperature.sodium * sweat.sodium,
      SODIUM_MIN_MG_HR,
      SODIUM_MAX_MG_HR,
    ),
  );

  const perHour: NutrientTargets = {
    carbsG: carbsPerHour,
    fluidMl: fluidPerHour,
    sodiumMg: sodiumPerHour,
  };

  const total: NutrientTargets = {
    carbsG: round(carbsPerHour * durationHours),
    fluidMl: round(fluidPerHour * durationHours),
    sodiumMg: round(sodiumPerHour * durationHours),
  };

  let shortEventNote: string | undefined;
  if (input.durationMinutes < 60) {
    shortEventNote =
      "Events under 60 minutes rarely need carb fueling. Focus on pre-event nutrition and hydration.";
  } else if (input.durationMinutes < 90 && input.gutTraining === "beginner") {
    shortEventNote =
      "For shorter events, start conservatively and practice this fueling plan in training.";
  }

  return { durationHours, perHour, total, shortEventNote };
}

function formatTimeLabel(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

function buildEvenSchedule(
  durationMinutes: number,
  itemCount: number,
  itemLabel: string,
  intervalCapMinutes?: number,
): ScheduleEntry[] {
  if (itemCount <= 0) {
    return [
      {
        timeMinutes: 0,
        label: "Start",
        action: "Begin drinking water as needed",
      },
    ];
  }

  const schedule: ScheduleEntry[] = [];
  let interval = durationMinutes / itemCount;

  if (intervalCapMinutes && interval < intervalCapMinutes) {
    interval = intervalCapMinutes;
  }

  for (let i = 0; i < itemCount; i++) {
    const timeMinutes = Math.min(
      Math.round(i * interval),
      durationMinutes,
    );
    schedule.push({
      timeMinutes,
      label: i === 0 ? "Start" : formatTimeLabel(timeMinutes),
      action: `Take ${itemLabel}${i === itemCount - 1 ? " (final)" : ""}`,
    });
  }

  if (
    schedule.length === 0 ||
    schedule[schedule.length - 1].timeMinutes < durationMinutes
  ) {
    schedule.push({
      timeMinutes: durationMinutes,
      label: "Finish",
      action: "Continue sipping fluids if needed",
    });
  }

  return schedule;
}

function buildDrinkSchedule(
  durationMinutes: number,
  bottleCount: number,
  bottleSizeMl: number,
  drinkLabel: string,
): ScheduleEntry[] {
  if (bottleCount <= 0) {
    return buildEvenSchedule(durationMinutes, 0, drinkLabel);
  }

  const schedule: ScheduleEntry[] = [];
  const interval = durationMinutes / bottleCount;
  const mlPerInterval = Math.round(bottleSizeMl / Math.max(1, interval / 15));

  for (let i = 0; i < bottleCount; i++) {
    const timeMinutes = Math.min(
      Math.round(i * interval),
      durationMinutes,
    );
    const bottleNum = i + 1;
    schedule.push({
      timeMinutes,
      label: i === 0 ? "Start" : formatTimeLabel(timeMinutes),
      action: `Start bottle ${bottleNum}: ${drinkLabel} (~${bottleSizeMl} ml)`,
    });
  }

  if (bottleCount > 1) {
    schedule.push({
      timeMinutes: durationMinutes,
      label: "Finish",
      action: `Finish remaining drink; aim for ~${mlPerInterval} ml every 15 min`,
    });
  }

  return schedule;
}

function calculateGelPlan(
  input: HydrationInput,
  total: NutrientTargets,
): GelPlan {
  const notes: string[] = [];
  const gelCount =
    total.carbsG > 0 ? Math.ceil(total.carbsG / GEL_CARBS_G) : 0;
  const totalCarbsG = gelCount * GEL_CARBS_G;
  const totalSodiumMg = gelCount * GEL_SODIUM_MG;
  const extraSodiumMg = Math.max(0, total.sodiumMg - totalSodiumMg);
  const waterMl = total.fluidMl;

  if (gelCount > 0) {
    const interval = input.durationMinutes / gelCount;
    if (interval < MIN_GEL_INTERVAL_MINUTES) {
      notes.push(
        `Spacing is tight (${Math.round(interval)} min between gels). Consider a sports drink strategy or extend intervals by accepting slightly lower carbs.`,
      );
    }
  }

  if (extraSodiumMg > 0) {
    const extraSaltG = round(extraSodiumMg / SODIUM_MG_PER_G_SALT, 1);
    notes.push(
      `Add ~${extraSaltG} g table salt total across your water bottles, or use electrolyte tablets to cover ${extraSodiumMg} mg sodium.`,
    );
  }

  notes.push(
    `Carry ${round(waterMl / 1000, 1)} L of plain water alongside your gels.`,
  );

  const schedule = buildEvenSchedule(
    input.durationMinutes,
    gelCount,
    "1 energy gel",
    MIN_GEL_INTERVAL_MINUTES,
  );

  if (waterMl > 0 && gelCount > 0) {
    schedule.unshift({
      timeMinutes: 0,
      label: "Pre-start",
      action: `Sip water regularly (~${total.fluidMl} ml total over the event)`,
    });
  }

  return {
    gelCount,
    totalCarbsG,
    totalSodiumMg,
    waterMl,
    extraSodiumMg,
    notes,
    schedule,
  };
}

function calculatePremadeDrinkPlan(
  input: HydrationInput,
  total: NutrientTargets,
  bottleSizeMl = DEFAULT_BOTTLE_SIZE_ML,
): DrinkPlan {
  const notes: string[] = [];
  const carbsPerMl = PREMADE_CARBS_G_PER_240ML / 240;
  const sodiumPerMl = PREMADE_SODIUM_MG_PER_240ML / 240;

  let totalVolumeMl =
    total.carbsG > 0 ? Math.ceil(total.carbsG / carbsPerMl) : 0;

  if (totalVolumeMl < total.fluidMl) {
    totalVolumeMl = total.fluidMl;
    notes.push(
      "Drink volume is driven by hydration needs; you'll get slightly more carbs than the minimum target.",
    );
  } else if (totalVolumeMl > total.fluidMl) {
    notes.push(
      `Carb target requires ${round(totalVolumeMl / 1000, 1)} L of drink. Extra plain water (${totalVolumeMl - total.fluidMl} ml) may be needed for full hydration.`,
    );
  }

  const bottleCount = Math.ceil(totalVolumeMl / bottleSizeMl);
  const totalCarbsG = round(totalVolumeMl * carbsPerMl);
  const totalSodiumMg = round(totalVolumeMl * sodiumPerMl);
  const extraWaterMl = Math.max(0, total.fluidMl - totalVolumeMl);

  if (total.sodiumMg > totalSodiumMg) {
    const sodiumGap = total.sodiumMg - totalSodiumMg;
    notes.push(
      `Premade drink covers ${totalSodiumMg} mg sodium. Add ~${round(sodiumGap / SODIUM_MG_PER_G_SALT, 1)} g salt or electrolyte tabs for the remaining ${sodiumGap} mg.`,
    );
  }

  notes.push(
    `Based on a standard 6% sports drink (~${PREMADE_CARBS_G_PER_240ML} g carbs per 240 ml).`,
  );

  const schedule = buildDrinkSchedule(
    input.durationMinutes,
    bottleCount,
    bottleSizeMl,
    "premade sports drink",
  );

  return {
    totalVolumeMl,
    bottleCount,
    bottleSizeMl,
    totalCarbsG,
    totalSodiumMg,
    extraWaterMl,
    notes,
    schedule,
  };
}

function calculateHomemadeDrinkPlan(
  input: HydrationInput,
  total: NutrientTargets,
  bottleSizeMl = DEFAULT_BOTTLE_SIZE_ML,
): HomemadePlan {
  const notes: string[] = [];

  const maxCarbsFromDrink = round(bottleSizeMl * HOMEMADE_CARB_PERCENT);
  const sugarPerBottleG = maxCarbsFromDrink;
  const carbsPerBottleG = sugarPerBottleG;

  let bottleCount =
    total.carbsG > 0 ? Math.ceil(total.carbsG / carbsPerBottleG) : 0;

  const minBottlesForFluid = Math.ceil(total.fluidMl / bottleSizeMl);
  if (bottleCount < minBottlesForFluid) {
    bottleCount = minBottlesForFluid;
    notes.push(
      "Bottle count increased to meet fluid needs. You'll exceed minimum carb targets slightly.",
    );
  }

  const totalVolumeMl = bottleCount * bottleSizeMl;
  const totalCarbsFromDrink = bottleCount * carbsPerBottleG;
  const supplementalCarbsG = Math.max(0, total.carbsG - totalCarbsFromDrink);
  const supplementalGels =
    supplementalCarbsG > 0
      ? Math.ceil(supplementalCarbsG / GEL_CARBS_G)
      : 0;

  const sodiumPerBottleMg = total.sodiumMg / bottleCount;
  const saltPerBottleG = round(
    sodiumPerBottleMg / SODIUM_MG_PER_G_SALT,
    2,
  );

  if (saltPerBottleG > 1.5) {
    notes.push(
      "Salt per bottle is high. Consider adding some sodium via gels or electrolyte tabs and reducing drink salt.",
    );
  }

  if (supplementalGels > 0) {
    notes.push(
      `Add ${supplementalGels} gel(s) to reach your carb target (${supplementalGels * GEL_CARBS_G} g carbs).`,
    );
  }

  notes.push(
    `Mix ${sugarPerBottleG} g table sugar and ${saltPerBottleG} g table salt per ${bottleSizeMl} ml bottle (6% carb solution).`,
  );

  const schedule = buildDrinkSchedule(
    input.durationMinutes,
    bottleCount,
    bottleSizeMl,
    "homemade sports drink",
  );

  if (supplementalGels > 0) {
    const gelSchedule = buildEvenSchedule(
      input.durationMinutes,
      supplementalGels,
      "1 energy gel",
      MIN_GEL_INTERVAL_MINUTES,
    );
    for (const entry of gelSchedule) {
      if (entry.label !== "Finish") {
        schedule.push({
          ...entry,
          action: entry.action.replace("Take", "Also take"),
        });
      }
    }
  }

  schedule.sort((a, b) => a.timeMinutes - b.timeMinutes);

  return {
    bottleCount,
    bottleSizeMl,
    recipe: {
      bottleSizeMl,
      sugarG: sugarPerBottleG,
      saltG: saltPerBottleG,
      carbsG: carbsPerBottleG,
      sodiumMg: round(sodiumPerBottleMg),
    },
    totalCarbsG: totalCarbsFromDrink + supplementalGels * GEL_CARBS_G,
    totalSodiumMg: total.sodiumMg,
    totalVolumeMl,
    supplementalGels,
    supplementalCarbsG: supplementalGels * GEL_CARBS_G,
    notes,
    schedule,
  };
}

export function calculatePlan(input: HydrationInput): HydrationPlan {
  const { durationHours, perHour, total, shortEventNote } =
    calculateTargets(input);

  return {
    durationHours,
    perHour,
    total,
    shortEventNote,
    gels: calculateGelPlan(input, total),
    premadeDrink: calculatePremadeDrinkPlan(input, total),
    homemadeDrink: calculateHomemadeDrinkPlan(input, total),
  };
}

export const defaultHydrationInput: HydrationInput = {
  durationMinutes: 180,
  weightKg: 70,
  intensity: "moderate",
  temperature: "moderate",
  gutTraining: "trained",
  sweatRate: "average",
};
