const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Catálogo Artesanal";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {siteName}. Productos artesanales
        hechos a mano.
      </div>
    </footer>
  );
}
