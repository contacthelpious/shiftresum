import { BuilderHeader } from "@/components/builder/header";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <BuilderHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
