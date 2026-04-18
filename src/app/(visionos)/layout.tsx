import Navigation from "@/components/Navigation";

export default function VisionOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div className="fixed inset-0 gradient-radial-hero pointer-events-none" />
      <div className="fixed inset-0 noise-overlay pointer-events-none" />

      <Navigation />

      <main>{children}</main>
    </div>
  );
}
