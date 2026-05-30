import type { HydrationInput } from "@/lib/hydration/types";

type HydrationFormProps = {
  input: HydrationInput;
  onChange: (input: HydrationInput) => void;
};

const fieldClass =
  "w-full rounded-lg border border-black/[.08] bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/40 dark:border-white/[.145]";
const labelClass = "mb-1.5 block text-sm font-medium";
const sectionClass =
  "rounded-2xl border border-black/[.08] p-5 dark:border-white/[.145]";

function parseDurationHoursMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

export function HydrationForm({ input, onChange }: HydrationFormProps) {
  const { hours, minutes } = parseDurationHoursMinutes(input.durationMinutes);

  function updateDuration(h: number, m: number) {
    const total = Math.max(15, h * 60 + m);
    onChange({ ...input, durationMinutes: total });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className={sectionClass}>
        <h2 className="mb-4 text-lg font-semibold">Your event</h2>
        <div className="grid gap-4">
          <div>
            <label className={labelClass} htmlFor="duration-hours">
              Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                id="duration-hours"
                type="number"
                min={0}
                max={24}
                value={hours}
                onChange={(e) =>
                  updateDuration(Number(e.target.value) || 0, minutes)
                }
                className={`${fieldClass} max-w-24`}
              />
              <span className="text-sm text-foreground/70">hr</span>
              <input
                id="duration-minutes"
                type="number"
                min={0}
                max={59}
                step={5}
                value={minutes}
                onChange={(e) =>
                  updateDuration(hours, Number(e.target.value) || 0)
                }
                className={`${fieldClass} max-w-24`}
              />
              <span className="text-sm text-foreground/70">min</span>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="weight">
              Body weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              min={40}
              max={150}
              value={input.weightKg}
              onChange={(e) =>
                onChange({
                  ...input,
                  weightKg: Number(e.target.value) || 70,
                })
              }
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="mb-4 text-lg font-semibold">Adjustments</h2>
        <div className="grid gap-4">
          <div>
            <label className={labelClass} htmlFor="intensity">
              Intensity
            </label>
            <select
              id="intensity"
              value={input.intensity}
              onChange={(e) =>
                onChange({
                  ...input,
                  intensity: e.target.value as HydrationInput["intensity"],
                })
              }
              className={fieldClass}
            >
              <option value="low">Low (easy pace)</option>
              <option value="moderate">Moderate (steady effort)</option>
              <option value="high">High (race pace / intervals)</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="temperature">
              Temperature
            </label>
            <select
              id="temperature"
              value={input.temperature}
              onChange={(e) =>
                onChange({
                  ...input,
                  temperature: e.target.value as HydrationInput["temperature"],
                })
              }
              className={fieldClass}
            >
              <option value="cool">Cool (under 15°C)</option>
              <option value="moderate">Moderate (15–25°C)</option>
              <option value="hot">Hot (over 25°C)</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="gut-training">
              Gut training
            </label>
            <select
              id="gut-training"
              value={input.gutTraining}
              onChange={(e) =>
                onChange({
                  ...input,
                  gutTraining: e.target.value as HydrationInput["gutTraining"],
                })
              }
              className={fieldClass}
            >
              <option value="beginner">Beginner (max 30 g/hr carbs)</option>
              <option value="trained">Trained (max 60 g/hr carbs)</option>
              <option value="advanced">Advanced (max 90 g/hr carbs)</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="sweat-rate">
              Sweat rate
            </label>
            <select
              id="sweat-rate"
              value={input.sweatRate ?? "average"}
              onChange={(e) =>
                onChange({
                  ...input,
                  sweatRate: e.target.value as HydrationInput["sweatRate"],
                })
              }
              className={fieldClass}
            >
              <option value="light">Light sweater</option>
              <option value="average">Average sweater</option>
              <option value="heavy">Heavy sweater</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
