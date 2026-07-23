import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="text-xl font-semibold tracking-tight">
        Panel de administración
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ingresa con tu cuenta para gestionar el catálogo.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
