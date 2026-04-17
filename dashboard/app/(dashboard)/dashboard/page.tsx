import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { Suspense } from "react";
import { LoadingCard } from "@/components/ui/loading";

export default function Page() {
  return (
    <Suspense fallback={<LoadingCard message="Loading dashboard..." />}>
      <MainDashboard />
    </Suspense>
  );
}
