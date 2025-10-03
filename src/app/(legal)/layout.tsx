
import { SharedHeader } from "@/components/shared/header";
import { SharedFooter } from "@/components/shared/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SharedHeader />
      <main className="flex-1">{children}</main>
      <SharedFooter />
    </div>
  );
}
