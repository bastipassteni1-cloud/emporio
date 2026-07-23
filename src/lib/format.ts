const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return clpFormatter.format(price);
}

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  available: "Disponible",
  sold: "Vendido",
  made_to_order: "Hecho a pedido",
};

export function formatProductStatus(status: string): string {
  return PRODUCT_STATUS_LABELS[status] ?? status;
}
