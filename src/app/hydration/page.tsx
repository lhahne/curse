import type { Metadata } from "next";
import { HydrationCalculator } from "@/components/hydration/hydration-calculator";

export const metadata: Metadata = {
  title: "Hydration Calculator | Endurance Fuel",
  description:
    "Calculate carbs, fluid, and sodium for endurance workouts and races. Get fueling plans with gels, premade sports drink, or homemade sugar and salt mix.",
};

export default function HydrationPage() {
  return (
    <div className="px-6 py-10 sm:px-8 sm:py-14">
      <HydrationCalculator />
    </div>
  );
}
