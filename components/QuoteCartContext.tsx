"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export interface QuoteItem {
  id: string; // unique key, e.g. `${productSlug}-${itemCode || 'default'}`
  productSlug: string;
  productName: string;
  itemCode?: string;
  description?: string;
  unit?: string;
  box?: string;
  ctn?: string;
  quantity: number;
  image?: string | null;
}

interface QuoteCartContextType {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "id"> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const STORAGE_KEY = "prodesk_quote_basket_v1";

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined);

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (item): item is QuoteItem =>
              Boolean(item) &&
              typeof item === "object" &&
              typeof (item as QuoteItem).id === "string" &&
              typeof (item as QuoteItem).productSlug === "string" &&
              typeof (item as QuoteItem).productName === "string" &&
              Number.isFinite((item as QuoteItem).quantity) &&
              (item as QuoteItem).quantity > 0
          );
          setItems(validItems);
        }
      }
    } catch {
      // Ignore malformed client storage and start with an empty basket.
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  }, [items, isLoaded]);

  const addItem = (itemData: Omit<QuoteItem, "id"> & { id?: string }) => {
    const id = itemData.id || `${itemData.productSlug}-${itemData.itemCode || "main"}`;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + (itemData.quantity || 1),
        };
        return next;
      }
      return [...prev, { ...itemData, id, quantity: itemData.quantity || 1 }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (!context) {
    throw new Error("useQuoteCart must be used within a QuoteCartProvider");
  }
  return context;
}
