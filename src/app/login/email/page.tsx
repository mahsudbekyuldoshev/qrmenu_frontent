import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginFooter, LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Kirish — RestoFlow",
  description: "RestoFlow hisobingizga kiring",
};

export default function LoginEmailPage() {
  return (
    <AuthShell
      title="Xush kelibsiz"
      subtitle="Restoran paneliga kirish uchun email va parolingizni kiriting."
      footer={<LoginFooter />}
    >
      <LoginForm />
    </AuthShell>
  );
}
