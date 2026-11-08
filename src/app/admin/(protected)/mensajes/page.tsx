import Link from "next/link";
import { getContactMessages } from "@/lib/queries/messages";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ContactLink({ value }: { value: string }) {
  const isEmail = value.includes("@");
  const isPhone = /^\+?[\d\s()-]{7,}$/.test(value);
  if (!isEmail && !isPhone) return <>{value}</>;

  const href = isEmail
    ? `mailto:${value}`
    : `tel:${value.replace(/[^\d+]/g, "")}`;

  return (
    <a href={href} className="text-ocre-texto underline-offset-2 hover:underline">
      {value}
    </a>
  );
}

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <h1 className="font-heading text-2xl font-medium text-nogal">Mensajes</h1>

      {messages.length === 0 ? (
        <p className="mt-8 text-muted-foreground">
          Todavía no hay mensajes de contacto.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="rounded-lg border border-linea bg-white/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-x-3 text-sm text-nogal-suave">
                <span>{formatDate(msg.created_at)}</span>
                {msg.product && (
                  <Link
                    href={`/productos/${msg.product.slug}`}
                    className="hover:underline"
                  >
                    {msg.product.name}
                  </Link>
                )}
              </div>
              <p className="mt-2 font-medium">
                {msg.name} · <ContactLink value={msg.contact_info} />
              </p>
              <p className="mt-1 break-words whitespace-pre-line">{msg.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
