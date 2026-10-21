import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <AdminPanel />
    </div>
  );
}
