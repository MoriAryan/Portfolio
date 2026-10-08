import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Control Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal min-h-screen bg-[#08080a] text-slate-200">
      {children}
    </div>
  );
}
