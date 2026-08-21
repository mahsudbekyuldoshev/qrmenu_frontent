"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePreferences } from "@/providers/PreferencesProvider";

function ContactFormContent() {
  const { t } = usePreferences();
  const m = t.marketing;
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [message, setMessage] = useState(
    selectedPlan ? `${selectedPlan.toUpperCase()} tarifi bo'yicha demo so'rovi` : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    let res = "";
    if (digits.length > 0) res += digits.slice(0, 2);
    if (digits.length > 2) res += " " + digits.slice(2, 5);
    if (digits.length > 5) res += " " + digits.slice(5, 7);
    if (digits.length > 7) res += " " + digits.slice(7, 9);
    return res;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(m.contactNameLabel + " kiritilmagan");
      return;
    }
    const cleanPhone = phone.replace(/\s/g, "");
    if (cleanPhone.length < 9) {
      toast.error(m.contactPhoneLabel + " to'liq kiritilmagan");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
    toast.success(m.contactSuccessTitle);
  }

  return (
    <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-10 shadow-xl">
      {submitted ? (
        <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-10" />
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--ink)]">
            {m.contactSuccessTitle}
          </h3>
          <p className="mx-auto max-w-md text-sm text-[var(--muted)] leading-relaxed">
            {m.contactSuccessDesc}
          </p>
          <div className="pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setPhone("");
                setRestaurant("");
                setMessage("");
              }}
            >
              Yangi xabar yuborish
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--ink)]">
            Demo yoki taklif so&apos;rash
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Quyidagi shaklni to&apos;ldiring, 15 daqiqa ichida siz bilan bog&apos;lanamiz.
          </p>

          <Input
            label={m.contactNameLabel}
            placeholder="Aziz Karimov"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--ink)]">
              {m.contactPhoneLabel}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-medium text-[var(--muted)]">
                +998
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="90 123 45 67"
                className="flex h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] pl-14 pr-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
                required
              />
            </div>
          </div>

          <Input
            label={m.contactRestaurantLabel}
            placeholder="Masalan: Rayhon Milliy Taomlar"
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--ink)]">
              {m.contactMessageLabel}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Filiallar soni, stollar soni yoki maxsus talablaringiz..."
              className="w-full h-28 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] transition resize-none"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-[var(--accent)]/20"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                {m.contactSubmitting}
              </>
            ) : (
              <>
                {m.contactSubmitBtn} &rarr;
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { t } = usePreferences();
  const m = t.marketing;

  return (
    <MarketingLayout>
      <div className="relative overflow-hidden py-16 sm:py-24">
        {/* Ambient Glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-10 -z-10 size-96 rounded-full bg-[var(--accent)]/10 blur-[100px]"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              {m.navContact}
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl">
              {m.contactTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
              {m.contactDesc}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Col: Contact info cards */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--ink)]">
                  To&apos;g&apos;ridan-to&apos;g&apos;ri aloqa
                </h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Savollaringiz bo&apos;lsa, to&apos;g&apos;ridan-to&apos;g&apos;ri bog&apos;lanishingiz mumkin.
                </p>

                <ul className="mt-6 space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                      <Send className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">{m.contactTelegram}</p>
                      <a
                        href="https://t.me/restoflow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[var(--ink)] hover:text-[var(--accent)]"
                      >
                        @restoflow
                      </a>
                    </div>
                  </li>

                  <li className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Phone className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">{m.contactPhone}</p>
                      <a
                        href="tel:+998901234567"
                        className="font-bold text-[var(--ink)] hover:text-[var(--accent)]"
                      >
                        +998 90 123 45 67
                      </a>
                    </div>
                  </li>

                  <li className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">{m.contactEmail}</p>
                      <a
                        href="mailto:info@restoflow.uz"
                        className="font-bold text-[var(--ink)] hover:text-[var(--accent)]"
                      >
                        info@restoflow.uz
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 pt-2 border-t border-[var(--line)]">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">{m.contactLocationLabel}</p>
                      <p className="font-semibold text-[var(--ink)]">
                        {m.contactLocationValue}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                      <Clock className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">{m.contactHoursLabel}</p>
                      <p className="font-semibold text-[var(--ink)]">
                        {m.contactHoursValue}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Col: Interactive Demo Form with Suspense */}
            <div className="lg:col-span-7">
              <Suspense
                fallback={
                  <div className="h-96 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 animate-pulse" />
                }
              >
                <ContactFormContent />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
