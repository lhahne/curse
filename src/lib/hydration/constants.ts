import type { GutTraining, Intensity, SweatRate, Temperature } from "./types";

export const GEL_CARBS_G = 22;
export const GEL_SODIUM_MG = 40;
export const GEL_VOLUME_ML = 35;

export const PREMADE_CARBS_G_PER_240ML = 14;
export const PREMADE_SODIUM_MG_PER_240ML = 110;

export const SODIUM_MG_PER_G_SALT = 390;
export const HOMEMADE_CARB_PERCENT = 0.06; // 6% solution
export const DEFAULT_BOTTLE_SIZE_ML = 500;

export const FLUID_ML_PER_KG_HR = 5;
export const FLUID_MIN_ML_HR = 400;
export const FLUID_MAX_ML_HR = 900;

export const SODIUM_BASE_MG_HR = 400;
export const SODIUM_MIN_MG_HR = 200;
export const SODIUM_MAX_MG_HR = 800;

export const GUT_TRAINING_CAPS: Record<GutTraining, number> = {
  beginner: 30,
  trained: 60,
  advanced: 90,
};

export const INTENSITY_MULTIPLIERS: Record<
  Intensity,
  { carbs: number; fluid: number }
> = {
  low: { carbs: 0.9, fluid: 0.85 },
  moderate: { carbs: 1.0, fluid: 1.0 },
  high: { carbs: 1.05, fluid: 1.15 },
};

export const TEMPERATURE_MULTIPLIERS: Record<
  Temperature,
  { fluid: number; sodium: number }
> = {
  cool: { fluid: 0.9, sodium: 0.9 },
  moderate: { fluid: 1.0, sodium: 1.0 },
  hot: { fluid: 1.2, sodium: 1.2 },
};

export const SWEAT_RATE_MULTIPLIERS: Record<
  SweatRate,
  { fluid: number; sodium: number }
> = {
  light: { fluid: 0.85, sodium: 0.8 },
  average: { fluid: 1.0, sodium: 1.0 },
  heavy: { fluid: 1.2, sodium: 1.3 },
};

export const MIN_GEL_INTERVAL_MINUTES = 20;
