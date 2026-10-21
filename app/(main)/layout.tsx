import { SiteShell } from "@/components/layout/site-shell";
import { getCurrentUser, getSiteSettings } from "@/lib/data";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, settings] = await Promise.all([getCurrentUser(), getSiteSettings()]);
  const a = settings.announcement as { text?: string } | undefined;

  return (
    <SiteShell user={user} announcement={a?.text}>
      {children}
    </SiteShell>
  );
}
