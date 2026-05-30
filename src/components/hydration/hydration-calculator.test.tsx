import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { calculatePlan, defaultHydrationInput } from "@/lib/hydration/calculate";
import { FuelingResults } from "./fueling-results";
import { HydrationCalculator } from "./hydration-calculator";
import { HydrationForm } from "./hydration-form";

afterEach(() => {
  cleanup();
});

function getTargetsSection() {
  const heading = screen.getByRole("heading", { name: "Your targets" });
  return heading.parentElement as HTMLElement;
}

function getSummaryCard(label: string) {
  const section = getTargetsSection();
  return within(section).getByText(label).closest("div") as HTMLElement;
}

describe("HydrationCalculator (integration)", () => {
  it("renders default targets from the calculation engine", () => {
    const plan = calculatePlan(defaultHydrationInput);

    render(<HydrationCalculator />);

    expect(
      screen.getByRole("heading", { name: "Hydration Calculator" }),
    ).toBeInTheDocument();

    const carbsCard = getSummaryCard("Carbs");
    expect(carbsCard).toHaveTextContent(`${plan.perHour.carbsG} g/hr`);
    expect(carbsCard).toHaveTextContent(`${plan.total.carbsG} g total`);

    const fluidCard = getSummaryCard("Fluid");
    expect(fluidCard).toHaveTextContent(`${plan.perHour.fluidMl} ml/hr`);
    expect(fluidCard).toHaveTextContent(`${plan.total.fluidMl} ml total`);

    const sodiumCard = getSummaryCard("Sodium");
    expect(sodiumCard).toHaveTextContent(`${plan.perHour.sodiumMg} mg/hr`);
    expect(sodiumCard).toHaveTextContent(`${plan.total.sodiumMg} mg total`);
  });

  it("updates carb targets when duration changes", async () => {
    render(<HydrationCalculator />);

    fireEvent.change(screen.getByLabelText("Duration"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getAllByRole("spinbutton")[1], {
      target: { value: "0" },
    });

    const carbsCard = getSummaryCard("Carbs");
    expect(carbsCard).toHaveTextContent("30 g/hr");
    expect(carbsCard).toHaveTextContent("30 g total");
  });

  it("shows a short-event note for events under 60 minutes", () => {
    render(<HydrationCalculator />);

    fireEvent.change(screen.getByLabelText("Duration"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getAllByRole("spinbutton")[1], {
      target: { value: "45" },
    });

    expect(
      screen.getByText(/Events under 60 minutes rarely need carb fueling/),
    ).toBeInTheDocument();

    const carbsCard = getSummaryCard("Carbs");
    expect(carbsCard).toHaveTextContent("0 g/hr");
  });
});

describe("HydrationForm (integration)", () => {
  it("calls onChange when gut training is updated", async () => {
    const user = userEvent.setup();
    const changes: Array<typeof defaultHydrationInput> = [];
    const onChange = (input: typeof defaultHydrationInput) => {
      changes.push(input);
    };

    render(<HydrationForm input={defaultHydrationInput} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText("Gut training"), "advanced");

    expect(changes.at(-1)?.gutTraining).toBe("advanced");
  });
});

describe("FuelingResults (integration)", () => {
  it("shows gel plan by default and switches to homemade drink tab", async () => {
    const user = userEvent.setup();
    const plan = calculatePlan(defaultHydrationInput);

    render(<FuelingResults plan={plan} />);

    expect(screen.getByText("Energy gels")).toBeInTheDocument();
    expect(screen.getByText("Water to carry")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Homemade drink" }));

    expect(screen.getByText(/Per 500 ml bottle/)).toBeInTheDocument();
    expect(screen.getByText("Bottles to mix")).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(
          `Mix ${plan.homemadeDrink.recipe.sugarG} g table sugar and ${plan.homemadeDrink.recipe.saltG} g table salt per 500 ml bottle`,
        ),
      ),
    ).toBeInTheDocument();
  });

  it("shows premade drink volume when that tab is selected", async () => {
    const user = userEvent.setup();
    const plan = calculatePlan(defaultHydrationInput);

    render(<FuelingResults plan={plan} />);

    await user.click(screen.getByRole("button", { name: "Premade drink" }));

    expect(
      screen.getByText(`${plan.premadeDrink.bottleCount} × 500 ml`),
    ).toBeInTheDocument();
  });
});
