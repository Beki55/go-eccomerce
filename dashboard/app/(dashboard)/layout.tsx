"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { LoadingPage } from "@/components/ui/loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingPage message="Loading dashboard..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background">
      <div className="mx-auto  px-2 py-3 sm:px-4 sm:py-6">
        <div className="rounded-3xl bg-card shadow-sm ring-1 ring-border overflow-hidden">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex h-[95vh]">
            <div
              className={`
              fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <main className="flex-1 w-full lg:w-auto rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none bg-muted p-3 sm:p-5 md:px-7 md:py-7 xl:pb-7 xl:pt-0 overflow-auto">
              <Topbar onMenuClick={() => setSidebarOpen(true)} />
              {children}
              <p className="mt-2 bottom-0">
                © All rights reserved by BkShop.
              </p>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
