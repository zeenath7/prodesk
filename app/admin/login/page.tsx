import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminLoginForm from "@/components/AdminLoginForm";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";

export const metadata = {
  title: "Admin Sign In | ProDesk",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? "";
  if (await verifyAdminSession(token)) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">ProDesk</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-600">
          Sessions are stored in Neon Postgres and expire after 12 hours.
        </p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
