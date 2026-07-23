import Link from "next/link";
import { getContactMessages } from "@/lib/queries/messages";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Mensajes</h1>

      {messages.length === 0 ? (
        <p className="mt-8 text-muted-foreground">
          Todavía no hay mensajes de contacto.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                {msg.name} · {msg.contact_info}
              </p>
              <p className="mt-1 whitespace-pre-line">{msg.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
