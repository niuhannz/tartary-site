import Navigation from "@/components/Navigation";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
