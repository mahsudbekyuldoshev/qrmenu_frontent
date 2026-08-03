"use client";

import { useState, useCallback, useRef } from "react";
import { Search, X, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { UnsplashImage } from "@/lib/types";
import { usePreferences } from "@/providers/PreferencesProvider";

interface Props {
  onClose: () => void;
  onSelected: (url: string) => void;
}

export function ImagePickerModal({ onClose, onSelected }: Props) {
  const { t } = usePreferences();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnsplashImage[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const imgs = await api.searchBackgrounds(q.trim());
      setResults(imgs);
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e.status === 503) toast.error(t.apiNotConfigured);
      else toast.error(e.message ?? "Qidiruv xatosi");
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [t]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 600);
  };

  const handleSelect = async (img: UnsplashImage) => {
    if (selectingId) return;
    setSelectingId(img.unsplash_id);
    try {
      const res = await api.selectBackground({
        image_url: img.full_url,
        unsplash_id: img.unsplash_id,
      });
      onSelected(res.menu_background);
      toast.success(t.imageSelected);
      onClose();
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e.status === 400) toast.error(t.imageLoadError);
      else toast.error(e.message ?? "Xato yuz berdi");
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--surface)] w-full max-w-3xl max-h-[88vh] flex flex-col rounded-[2.5rem] shadow-2xl border border-[var(--line)] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[var(--line)] shrink-0">
          <div>
            <h2 className="text-2xl font-black text-[var(--ink)]">{t.selectImage}</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Unsplash · Bepul yuqori sifatli rasmlar</p>
          </div>
          <button
            onClick={onClose}
            className="size-11 rounded-2xl bg-[var(--bg)] flex items-center justify-center text-[var(--muted)] hover:text-rose-500 hover:bg-rose-50 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-8 py-5 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[var(--muted)]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { if (debounceRef.current) clearTimeout(debounceRef.current); doSearch(query); } }}
              placeholder={t.searchImages}
              className="w-full h-13 rounded-2xl border-2 border-[var(--line)] bg-[var(--bg)] pl-12 pr-4 py-3 text-[var(--ink)] text-sm font-medium outline-none focus:border-[var(--accent)] transition placeholder:text-[var(--muted)]"
            />
            {searching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[var(--accent)] animate-spin" />
            )}
          </div>
          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {["restoran", "taom", "milliy oshxona", "sushi", "salad", "burger"].map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); if (debounceRef.current) clearTimeout(debounceRef.current); doSearch(s); }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg)] border border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto flex-1 px-8 pb-8">
          {results.length === 0 && !searching && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ImageIcon className="size-14 text-[var(--muted)] opacity-30 mb-4" />
              <p className="text-sm font-bold text-[var(--muted)]">
                {query ? "Hech narsa topilmadi" : "Qidirish uchun so'z kiriting"}
              </p>
            </div>
          )}

          {searching && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="size-10 text-[var(--accent)] animate-spin mb-3" />
              <p className="text-sm text-[var(--muted)] font-medium">Qidirilmoqda...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {results.map((img) => {
                const isLoading = selectingId === img.unsplash_id;
                return (
                  <button
                    key={img.unsplash_id}
                    onClick={() => handleSelect(img)}
                    disabled={!!selectingId}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-[var(--bg)] border-2 border-[var(--line)] hover:border-[var(--accent)] focus:border-[var(--accent)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <img
                      src={img.thumb_url}
                      alt={`Photo by ${img.photographer}`}
                      className="size-full object-cover group-hover:scale-105 transition duration-400"
                      loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    <p className="absolute bottom-0 left-0 right-0 px-2 py-2 text-[0.6rem] font-bold text-white/90 truncate opacity-0 group-hover:opacity-100 transition duration-300">
                      {t.photoBy}: {img.photographer}
                    </p>
                    {/* Loading overlay */}
                    {isLoading && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="size-7 text-white animate-spin" />
                        <span className="text-[0.65rem] font-bold text-white">{t.selectingImage}</span>
                      </div>
                    )}
                    {!isLoading && selectingId === null && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <div className="size-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center">
                          <CheckCircle2 className="size-5 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
