import type { ScheduleEntry } from "@/lib/hydration/types";

type IntakeScheduleProps = {
  schedule: ScheduleEntry[];
};

export function IntakeSchedule({ schedule }: IntakeScheduleProps) {
  if (schedule.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead>
          <tr className="border-b border-black/[.08] dark:border-white/[.145]">
            <th className="pb-2 pr-4 font-medium">When</th>
            <th className="pb-2 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((entry, index) => (
            <tr
              key={`${entry.timeMinutes}-${index}`}
              className="border-b border-black/[.04] dark:border-white/[.08]"
            >
              <td className="py-2.5 pr-4 align-top font-[family-name:var(--font-geist-mono)] text-foreground/80">
                {entry.label}
              </td>
              <td className="py-2.5 align-top">{entry.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
