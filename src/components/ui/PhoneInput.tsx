import React, { useRef, useCallback } from 'react';

interface PhoneInputProps {
  value: string;        // faqat 9 ta raqam (operator va nomer), masalan "901234567"
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

/** 9 ta raqamni "90 000 00 00" formatiga o'tkazadi */
function formatDigits9(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 9);
  let out = '';
  if (d.length >= 1) out += d.slice(0, 2);
  if (d.length > 2)  out += ' ' + d.slice(2, 5);
  if (d.length > 5)  out += ' ' + d.slice(5, 7);
  if (d.length > 7)  out += ' ' + d.slice(7, 9);
  return out;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, label, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Faqat raqamlarni olamiz, max 9 ta
      const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
      onChange(digits);
    },
    [onChange],
  );

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--ink)]">{label}</label>
      )}
      <div className="flex h-12 w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] transition focus-within:border-[var(--accent-bright)]/60 focus-within:ring-2 focus-within:ring-[var(--accent-bright)]/20">
        {/* O'chirib bo'lmaydigan prefix */}
        <span className="flex items-center select-none border-r border-[var(--line)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--accent)]">
          +998
        </span>
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          className="flex-1 bg-transparent px-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]/60"
          placeholder="90 000 00 00"
          value={formatDigits9(value)}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
