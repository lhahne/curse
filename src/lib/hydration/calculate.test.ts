import { describe, expect, it } from "vitest";
import { calculatePlan, defaultHydrationInput } from "./calculate";
import { GEL_CARBS_G, GUT_TRAINING_CAPS } from "./constants";
import { createHydrationInput } from "./test-helpers";

describe("calculatePlan (unit)", () => {
  describe("nutrient targets by duration", () => {
    it("returns zero carbs for events under 60 minutes", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 45 }));

      expect(plan.perHour.carbsG).toBe(0);
      expect(plan.total.carbsG).toBe(0);
      expect(plan.shortEventNote).toContain("under 60 minutes");
    });

    it("uses 30 g/hr carbs for 60–149 minute events", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 120 }));

      expect(plan.perHour.carbsG).toBe(30);
      expect(plan.total.carbsG).toBe(60);
    });

    it("uses 45 g/hr carbs for 150–180 minute events", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 165 }));

      expect(plan.perHour.carbsG).toBe(45);
    });

    it("uses 60 g/hr carbs for events over 180 minutes", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 240 }));

      expect(plan.perHour.carbsG).toBe(60);
      expect(plan.total.carbsG).toBe(240);
    });
  });

  describe("adjustment multipliers", () => {
    it("caps carbs by gut training level", () => {
      const beginner = calculatePlan(
        createHydrationInput({
          durationMinutes: 300,
          gutTraining: "beginner",
          intensity: "high",
        }),
      );
      const advanced = calculatePlan(
        createHydrationInput({
          durationMinutes: 300,
          gutTraining: "advanced",
          intensity: "high",
        }),
      );

      expect(beginner.perHour.carbsG).toBeLessThanOrEqual(
        GUT_TRAINING_CAPS.beginner,
      );
      expect(advanced.perHour.carbsG).toBeLessThanOrEqual(
        GUT_TRAINING_CAPS.advanced,
      );
      expect(advanced.perHour.carbsG).toBeGreaterThan(beginner.perHour.carbsG);
    });

    it("increases fluid intake in hot weather", () => {
      const moderate = calculatePlan(
        createHydrationInput({ temperature: "moderate" }),
      );
      const hot = calculatePlan(createHydrationInput({ temperature: "hot" }));

      expect(hot.perHour.fluidMl).toBeGreaterThan(moderate.perHour.fluidMl);
    });

    it("increases sodium for heavy sweaters", () => {
      const light = calculatePlan(
        createHydrationInput({ sweatRate: "light" }),
      );
      const heavy = calculatePlan(
        createHydrationInput({ sweatRate: "heavy" }),
      );

      expect(heavy.perHour.sodiumMg).toBeGreaterThan(light.perHour.sodiumMg);
    });

    it("raises carbs slightly at high intensity", () => {
      const low = calculatePlan(
        createHydrationInput({ intensity: "low", durationMinutes: 240 }),
      );
      const high = calculatePlan(
        createHydrationInput({ intensity: "high", durationMinutes: 240 }),
      );

      expect(high.perHour.carbsG).toBeGreaterThan(low.perHour.carbsG);
    });

    it("clamps fluid per hour between 400 and 900 ml", () => {
      const lowFluid = calculatePlan(
        createHydrationInput({ weightKg: 40, intensity: "low", temperature: "cool" }),
      );
      const highFluid = calculatePlan(
        createHydrationInput({
          weightKg: 120,
          intensity: "high",
          temperature: "hot",
          sweatRate: "heavy",
        }),
      );

      expect(lowFluid.perHour.fluidMl).toBeGreaterThanOrEqual(400);
      expect(highFluid.perHour.fluidMl).toBeLessThanOrEqual(900);
    });

    it("clamps sodium per hour between 200 and 800 mg", () => {
      const cool = calculatePlan(
        createHydrationInput({ temperature: "cool", sweatRate: "light" }),
      );
      const hotHeavy = calculatePlan(
        createHydrationInput({ temperature: "hot", sweatRate: "heavy" }),
      );

      expect(cool.perHour.sodiumMg).toBeGreaterThanOrEqual(200);
      expect(hotHeavy.perHour.sodiumMg).toBeLessThanOrEqual(800);
    });
  });

  describe("short event guidance", () => {
    it("warns beginners on events under 90 minutes", () => {
      const plan = calculatePlan(
        createHydrationInput({
          durationMinutes: 75,
          gutTraining: "beginner",
        }),
      );

      expect(plan.shortEventNote).toContain("start conservatively");
    });

    it("does not warn trained athletes on 75 minute events", () => {
      const plan = calculatePlan(
        createHydrationInput({
          durationMinutes: 75,
          gutTraining: "trained",
        }),
      );

      expect(plan.shortEventNote).toBeUndefined();
    });
  });

  describe("gel fueling plan", () => {
    it("computes gel count from total carb target", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(plan.gels.gelCount).toBe(
        Math.ceil(plan.total.carbsG / GEL_CARBS_G),
      );
      expect(plan.gels.totalCarbsG).toBe(plan.gels.gelCount * GEL_CARBS_G);
    });

    it("requires extra sodium beyond what gels provide", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(plan.gels.extraSodiumMg).toBeGreaterThan(0);
      expect(plan.gels.notes.some((note) => note.includes("salt"))).toBe(true);
    });

    it("includes an intake schedule with at least one entry", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(plan.gels.schedule.length).toBeGreaterThan(0);
      expect(plan.gels.schedule[0].action).toBeTruthy();
    });

    it("returns water-only schedule when no carbs are needed", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 30 }));

      expect(plan.gels.gelCount).toBe(0);
      expect(plan.gels.schedule[0].action).toContain("water");
    });
  });

  describe("premade drink plan", () => {
    it("produces positive drink volume for fueling events", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(plan.premadeDrink.totalVolumeMl).toBeGreaterThan(0);
      expect(plan.premadeDrink.bottleCount).toBeGreaterThan(0);
    });

    it("meets or exceeds fluid needs when carbs drive volume lower", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(plan.premadeDrink.totalVolumeMl).toBeGreaterThanOrEqual(
        plan.total.fluidMl,
      );
    });

    it("includes a standard sports drink reference note", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(
        plan.premadeDrink.notes.some((note) => note.includes("6%")),
      ).toBe(true);
    });
  });

  describe("homemade drink plan", () => {
    it("provides a per-bottle sugar and salt recipe", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));
      const { recipe } = plan.homemadeDrink;

      expect(recipe.sugarG).toBeGreaterThan(0);
      expect(recipe.saltG).toBeGreaterThan(0);
      expect(recipe.bottleSizeMl).toBe(500);
    });

    it("matches total sodium target across bottles", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(plan.homemadeDrink.totalSodiumMg).toBe(plan.total.sodiumMg);
    });

    it("uses at least enough bottles to cover fluid needs", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(plan.homemadeDrink.totalVolumeMl).toBeGreaterThanOrEqual(
        plan.total.fluidMl,
      );
    });

    it("includes mix instructions in notes", () => {
      const plan = calculatePlan(createHydrationInput({ durationMinutes: 180 }));

      expect(
        plan.homemadeDrink.notes.some((note) => note.includes("table sugar")),
      ).toBe(true);
    });
  });

  describe("plan shape", () => {
    it("returns consistent default input plan", () => {
      const plan = calculatePlan(defaultHydrationInput);

      expect(plan.durationHours).toBe(3);
      expect(plan.perHour).toMatchObject({
        carbsG: expect.any(Number),
        fluidMl: expect.any(Number),
        sodiumMg: expect.any(Number),
      });
      expect(plan.gels).toBeDefined();
      expect(plan.premadeDrink).toBeDefined();
      expect(plan.homemadeDrink).toBeDefined();
    });

    it("scales totals linearly with duration at fixed per-hour rates", () => {
      const twoHour = calculatePlan(
        createHydrationInput({ durationMinutes: 120 }),
      );
      const fourHour = calculatePlan(
        createHydrationInput({ durationMinutes: 240 }),
      );

      expect(fourHour.total.fluidMl).toBe(twoHour.total.fluidMl * 2);
      expect(fourHour.total.sodiumMg).toBe(twoHour.total.sodiumMg * 2);
    });
  });
});
