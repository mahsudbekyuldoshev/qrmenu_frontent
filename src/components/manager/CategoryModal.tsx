"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Category } from "@/lib/types";
import toast from "react-hot-toast";

interface CategoryModalProps {
  categories: Category[];
  t: any;
  onClose: () => void;
  onUpdate: (categories: Category[]) => void;
}

export function CategoryModal({ categories, t, onClose, onUpdate }: CategoryModalProps) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName) return;
    const newCategory: Category = {
      id: Date.now(),
      name: newName,
      nameUz: newName,
    };
    onUpdate([...categories, newCategory]);
    setNewName("");
    toast.success("Kategoriya qo'shildi");
  };

  const handleDelete = (id: string | number) => {
    onUpdate(categories.filter((c) => c.id !== id));
    toast.success("Kategoriya o'chirildi");
  };

  const handleSaveEdit = (id: string | number) => {
    onUpdate(
      categories.map((c) => (c.id === id ? { ...c, name: editName, nameUz: editName } : c))
    );
    setEditingId(null);
    setEditName("");
    toast.success("Kategoriya yangilandi");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[var(--surface)] w-full max-w-lg rounded-[2rem] shadow-2xl p-8 border border-[var(--line)] animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[var(--ink)]">{t.categories}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--surface-2)] rounded-xl transition">
            <XCircle className="size-6 text-[var(--muted)]" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Yangi kategoriya nomi" className="flex-1" />
          <Button onClick={handleAdd}><Plus className="size-5" /></Button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
              {editingId === c.id ? (
                <>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" />
                  <Button size="sm" onClick={() => handleSaveEdit(c.id)}>Saqlash</Button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium text-[var(--ink)]">{c.nameUz || c.name}</span>
                  <button onClick={() => { setEditingId(c.id); setEditName(c.nameUz || c.name); }} className="p-2 text-[var(--muted)] hover:text-[var(--accent)]"><Edit2 className="size-4" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-[var(--muted)] hover:text-rose-500"><Trash2 className="size-4" /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
