import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos una consulta sobre nuestros productos artesanales.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Contacto</h1>
      <p className="mt-1 text-muted-foreground">
        ¿Tienes una consulta general? Escríbenos.
      </p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </div>
  );
}
