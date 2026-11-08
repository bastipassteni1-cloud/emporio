"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ContactFormState = { status: "idle" };

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function ContactForm({ productId }: { productId?: string }) {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {productId && <input type="hidden" name="product_id" value={productId} />}

      {/* Trampa para bots: las personas no ven ni completan este campo. */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="website">No completar</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          maxLength={100}
          required
          defaultValue={state.values?.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact_info">Email o teléfono</Label>
        <Input
          id="contact_info"
          name="contact_info"
          maxLength={150}
          required
          defaultValue={state.values?.contact_info}
          aria-invalid={Boolean(errors.contact_info)}
          aria-describedby={errors.contact_info ? "contact-error" : undefined}
        />
        <FieldError id="contact-error" message={errors.contact_info} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          required
          defaultValue={state.values?.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <div aria-live="polite">
        {state.status === "success" && (
          <p className="rounded-md bg-salvia-suave/60 px-3 py-2 text-sm font-medium text-nogal">
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p className="text-sm font-medium text-destructive">{state.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="rounded-full px-5"
        disabled={pending}
      >
        {pending ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
