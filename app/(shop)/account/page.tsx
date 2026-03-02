import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { formatFcfa } from "@/lib/currency";
import { authOptions } from "@/lib/auth";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/connexion?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      addresses: true,
      designs: { orderBy: { updatedAt: "desc" }, take: 6 },
      orders: { orderBy: { createdAt: "desc" }, take: 6 },
    },
  });

  if (!user) {
    return <main style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>Aucun utilisateur trouve.</main>;
  }

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 42px" }}>
      <h1 style={{ margin: 0, fontSize: 36 }}>Mon compte</h1>
      <p style={{ margin: "6px 0 16px", color: "#475569" }}>
        {user.name} • {user.email}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
        <section style={{ display: "grid", gap: 12 }}>
          <article style={card}>
            <h2 style={{ margin: "0 0 8px" }}>Commandes</h2>
            {user.orders.length === 0 ? <p style={{ margin: 0, color: "#475569" }}>Aucune commande.</p> : null}
            {user.orders.map((order) => (
              <div key={order.id} style={{ padding: "8px 0", borderTop: "1px dashed #dbe4f0" }}>
                <p style={{ margin: 0, fontWeight: 700 }}>#{order.id.slice(0, 10)} • {order.status}</p>
                <p style={{ margin: "4px 0 0", color: "#475569" }}>{formatFcfa(order.total)}</p>
                <Link href={`/orders/${order.id}`} style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: 700, fontSize: 13 }}>
                  Suivre la commande
                </Link>
              </div>
            ))}
          </article>

          <article style={card}>
            <h2 style={{ margin: "0 0 8px" }}>Designs sauvegardes</h2>
            {user.designs.length === 0 ? <p style={{ margin: 0, color: "#475569" }}>Aucun design sauvegarde.</p> : null}
            {user.designs.map((design) => (
              <div key={design.id} style={{ padding: "8px 0", borderTop: "1px dashed #dbe4f0" }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{design.name}</p>
                <p style={{ margin: "4px 0 0", color: "#475569" }}>{new Date(design.updatedAt).toLocaleDateString("fr-FR")}</p>
              </div>
            ))}
          </article>
        </section>

        <aside style={{ display: "grid", gap: 12 }}>
          <article style={card}>
            <h2 style={{ margin: "0 0 8px" }}>Adresses</h2>
            {user.addresses.map((address) => (
              <div key={address.id} style={{ padding: "8px 0", borderTop: "1px dashed #dbe4f0" }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{address.label}</p>
                <p style={{ margin: "4px 0 0", color: "#475569" }}>
                  {address.line1}, {address.postalCode} {address.city}
                </p>
              </div>
            ))}
          </article>

          <article style={card}>
            <h2 style={{ margin: "0 0 8px" }}>Support</h2>
            <p style={{ margin: "0 0 8px", color: "#334155" }}>Besoin d'aide sur une commande ou un fichier ?</p>
            <Link href="/help" style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: 700 }}>
              Ouvrir FAQ & support
            </Link>
          </article>
        </aside>
      </div>
    </main>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #dbe4f0",
  borderRadius: 14,
  padding: 14,
};
