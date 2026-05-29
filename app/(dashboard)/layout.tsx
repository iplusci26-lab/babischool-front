"use client";

import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { useAuth } from "@/lib/hooks/useAuth";

export default function DashboardLayout({
  children,
}:   {
  children: React.ReactNode;
}) {

  const { loading, user } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6214BE] border-t-transparent" />
      </div>
    );
  }


  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 bg-background flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}