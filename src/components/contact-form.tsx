"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { submitContactMessage, type ContactFormState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm({ productId }: { productId?: string }) {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  return (
    <form
      action={formAction}
      key={state.status === "success" ? "sent" : "form"}
      className="space-y-4"
    >
      {productId && <input type="hidden" name="product_id" value={productId} />}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact_info">Email o teléfono</Label>
        <Input id="contact_info" name="contact_info" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea id="message" name="message" rows={4} required />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
