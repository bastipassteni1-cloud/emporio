import { createClient } from "@/lib/supabase/server";

export type ContactMessageWithProduct = {
  id: string;
  name: string;
  contact_info: string;
  message: string;
  created_at: string;
  product: { name: string; slug: string } | null;
};

export async function getContactMessages(): Promise<ContactMessageWithProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, contact_info, message, created_at, product:products(name, slug)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as ContactMessageWithProduct[];
}
