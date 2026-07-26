import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterFooter, RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Ro‘yxatdan o‘tish — RestoFlow",
  description: "RestoFlow da restoran hisobini yarating",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Hisob ochish"
      subtitle="Restoraningizni ulang — QR-menyu, KDS va direktor paneli bir joyda."
      footer={<RegisterFooter />}
    >
      <RegisterForm />
    </AuthShell>
  );
}
