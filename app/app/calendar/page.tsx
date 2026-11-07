"use client";

import Link from "next/link";
import { useWorkspace } from "@/lib/demo/store";
import { accountOfOpp } from "@/lib/workspace/selectors";
import { Notice, PageHeader, Panel, Empty, fmtSlot } from "@/components/app/ui";

export default function CalendarPage() {
  const { ws } = useWorkspace();
  const appts = [...ws.appointments].sort((a, b) => a.start.localeCompare(b.start));
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" lede="Walkthroughs and open times. Book a time from a customer record so it stays linked to the opportunity." />
      <Notice tone="attention">No calendar is connected. Times below come from a sample calendar, and bookings are marked as sample bookings. Nothing is sent to anyone.</Notice>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Booked walkthroughs">
          {appts.length === 0 ? <Empty title="None yet" body="Book one from a customer record." /> : (
            <ul className="divide-y divide-rule">{appts.map((a) => { const acc = accountOfOpp(ws, a.opportunityId); return (
              <li key={a.id} className="flex items-baseline justify-between gap-3 px-4 py-3 text-[0.875rem]"><Link href={`/app/customers/${acc?.id}`} className="font-medium hover:underline">{acc?.name}</Link><span className="text-right text-muted">{fmtSlot(a.start)}<span className="block text-[0.75rem]">{a.status === "sample-booked" ? "Sample booking" : a.status}</span></span></li>
            ); })}</ul>
          )}
        </Panel>
        <Panel title="Open times (sample)">
          <ul className="grid grid-cols-2 gap-px bg-rule">{ws.sampleSlots.map((s) => <li key={s.start} className="bg-surface px-4 py-3 text-[0.875rem]">{fmtSlot(s.start)}</li>)}</ul>
        </Panel>
      </div>
    </div>
  );
}
