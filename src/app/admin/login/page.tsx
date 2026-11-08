import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <div className="rounded-lg border border-linea bg-crudo p-6">
        <Image
          src="/branding/logo-256.png"
          alt=""
          width={48}
          height={48}
          quality={95}
        />
        <h1 className="mt-3 font-heading text-xl font-medium text-nogal">
          Panel de administración
        </h1>
        <p className="mt-1 text-sm text-nogal-suave">
          Ingresa con tu cuenta para gestionar el catálogo.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
      <Link
        href="/"
        className="mt-4 text-center text-sm font-semibold text-nogal-suave hover:text-nogal"
      >
        Volver al sitio
      </Link>
    </main>
  );
}
