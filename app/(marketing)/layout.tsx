import { LandingShell } from "@/components/layout/landing-shell";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandingShell>{children}</LandingShell>;
}
