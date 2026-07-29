import { Metadata } from "next";
import { SuperAdminDashboard } from "@/components/super-admin/SuperAdminDashboard";

export const metadata: Metadata = {
  title: "Super Admin — RestoFlow",
};

export default function SuperAdminPage() {
  return <SuperAdminDashboard />;
}
