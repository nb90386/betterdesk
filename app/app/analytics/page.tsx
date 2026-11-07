"use client";

import { useWorkspace } from "@/lib/demo/store";
import { metrics } from "@/lib/workspace/selectors";
import { PageHeader, Panel } from "@/components/app/ui";

export default function AnalyticsPage() {
  const { ws } = useWorkspace();
  const m = metrics(ws);
  const rows: [string, number | null, string][] = [
    ["Qualified opportunities", m.qualified, "Strong or worth-checking fits from Scout runs."],
    ["Introductions approved", m.draftsApproved, "Approved by a person."],
    ["Emails actually sent", m.sent, "Always 0 here: sending is off in the demo."],
    ["Deliveries simulated", m.simulatedDeliveries, "Demo only. Not real email."],
    ["Replies received", m.replies, "In this demo, replies are simulated."],
    ["Walkthroughs booked", m.walkthroughs, "Includes sample-calendar bookings."],
    ["Proposals", m.proposals, "Opportunities that reached the proposal stage or beyond."],
    ["Won", m.won, "Marked won by a person."],
    ["Revenue attributed", null, "Unknown. BetterDesk doesn't have your invoices, so it doesn't guess."],
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" lede="A few counts you can defend, taken straight from the records. Unknown values stay unknown." />
      <Panel>
        <table className="w-full text-left text-[0.875rem]">
          <caption className="sr-only">Workspace metrics</caption>
          <tbody className="divide-y divide-rule">
            {rows.map(([k, v, note]) => (
              <tr key={k}>
                <th scope="row" className="px-4 py-3 font-medium">{k}</th>
                <td className="px-4 py-3 text-right font-display text-[1.25rem] font-semibold tabular-nums">{v === null ? <span className="text-[0.875rem] font-normal text-muted">Unknown</span> : v}</td>
                <td className="hidden px-4 py-3 text-muted md:table-cell">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
