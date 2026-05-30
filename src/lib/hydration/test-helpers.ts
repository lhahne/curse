import type { HydrationInput } from "./types";

export function createHydrationInput(
  overrides: Partial<HydrationInput> = {},
): HydrationInput {
  return {
    durationMinutes: 180,
    weightKg: 70,
    intensity: "moderate",
    temperature: "moderate",
    gutTraining: "trained",
    sweatRate: "average",
    ...overrides,
  };
}
