import { OrderStatus } from "@prisma/client";
import { orderTimelineLabels } from "@/lib/mocks";

type EventItem = {
  status: OrderStatus;
  label: string;
  createdAt: string | Date;
};

export default function OrderTimeline({ events }: { events: EventItem[] }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {events.map((event, index) => (
        <div key={`${event.status}-${index}`} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 12, height: 12, marginTop: 4, borderRadius: 999, background: "#2563eb" }} />
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>{orderTimelineLabels[event.status] ?? event.label}</p>
            <p style={{ margin: "2px 0 0", color: "#475569", fontSize: 13 }}>{new Date(event.createdAt).toLocaleString("fr-FR")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
