"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { QuickAddModal } from "./QuickAddModal";

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isOpen && <QuickAddModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
