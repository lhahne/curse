export type Intensity = "low" | "moderate" | "high";
export type Temperature = "cool" | "moderate" | "hot";
export type GutTraining = "beginner" | "trained" | "advanced";
export type SweatRate = "light" | "average" | "heavy";
export type FuelingStrategy = "gels" | "premade" | "homemade";

export type HydrationInput = {
  durationMinutes: number;
  weightKg: number;
  intensity: Intensity;
  temperature: Temperature;
  gutTraining: GutTraining;
  sweatRate?: SweatRate;
};

export type NutrientTargets = {
  carbsG: number;
  fluidMl: number;
  sodiumMg: number;
};

export type ScheduleEntry = {
  timeMinutes: number;
  label: string;
  action: string;
};

export type GelPlan = {
  gelCount: number;
  totalCarbsG: number;
  totalSodiumMg: number;
  waterMl: number;
  extraSodiumMg: number;
  notes: string[];
  schedule: ScheduleEntry[];
};

export type DrinkPlan = {
  totalVolumeMl: number;
  bottleCount: number;
  bottleSizeMl: number;
  totalCarbsG: number;
  totalSodiumMg: number;
  extraWaterMl: number;
  notes: string[];
  schedule: ScheduleEntry[];
};

export type HomemadeBottleRecipe = {
  bottleSizeMl: number;
  sugarG: number;
  saltG: number;
  carbsG: number;
  sodiumMg: number;
};

export type HomemadePlan = {
  bottleCount: number;
  bottleSizeMl: number;
  recipe: HomemadeBottleRecipe;
  totalCarbsG: number;
  totalSodiumMg: number;
  totalVolumeMl: number;
  supplementalGels: number;
  supplementalCarbsG: number;
  notes: string[];
  schedule: ScheduleEntry[];
};

export type HydrationPlan = {
  durationHours: number;
  perHour: NutrientTargets;
  total: NutrientTargets;
  shortEventNote?: string;
  gels: GelPlan;
  premadeDrink: DrinkPlan;
  homemadeDrink: HomemadePlan;
};
