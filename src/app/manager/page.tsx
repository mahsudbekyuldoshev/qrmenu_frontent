import { Metadata } from "next";
import { ManagerDashboard } from "@/components/manager/ManagerDashboard";

export const metadata: Metadata = {
  title: "Manager Paneli — RestoFlow",
};

export default function ManagerPage() {
  return <ManagerDashboard />;
}
