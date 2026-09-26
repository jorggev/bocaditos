import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  quantity: number;
};

type StoreState = {
  items: CartItem[];
  isAuthenticated: boolean;
  displayName: string | null;
  registeredAt: string | null;
  promoBannerDismissed: boolean;
  cartOpen: boolean;
  welcomeName: string | null;
  addItem: (id: string) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  login: (name?: string) => void;
  register: (name: string) => void;
  logout: () => void;
  dismissPromoBanner: () => void;
  setCartOpen: (open: boolean) => void;
  clearWelcome: () => void;
};

export const useStore = create<StoreState>()(persist((set) => ({
  items: [],
  isAuthenticated: false,
  displayName: null,
  registeredAt: null,
  promoBannerDismissed: false,
  cartOpen: false,
  welcomeName: null,
  addItem: (id) => set((state) => {
    const item = state.items.find((entry) => entry.id === id);
    if (item) {
      return { items: state.items.map((entry) => entry.id === id ? { ...entry, quantity: entry.quantity + 1 } : entry) };
    }
    return { items: [...state.items, { id, quantity: 1 }] };
  }),
  setItemQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) return state;
    const existingIndex = state.items.findIndex((item) => item.id === id);
    const safeQuantity = Math.max(1, Math.floor(quantity));
    if (existingIndex === -1) {
      return quantity > 0 ? { items: [...state.items, { id, quantity: safeQuantity }] } : state;
    }
    return {
      items: state.items.map((item, index) => index === existingIndex ? { ...item, quantity: safeQuantity } : item),
    };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((entry) => entry.id !== id) })),
  clearCart: () => set({ items: [] }),
  login: (name) => set((state) => {
    const displayName = name?.trim() || state.displayName || "Cliente";
    return { isAuthenticated: true, displayName, welcomeName: displayName };
  }),
  register: (name) => set((state) => {
    const displayName = name.trim() || "Cliente";
    return {
      isAuthenticated: true,
      displayName,
      registeredAt: state.registeredAt ?? new Date().toISOString(),
      promoBannerDismissed: false,
      welcomeName: displayName,
    };
  }),
  logout: () => set({ isAuthenticated: false, items: [], cartOpen: false, welcomeName: null }),
  dismissPromoBanner: () => set({ promoBannerDismissed: true }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  clearWelcome: () => set({ welcomeName: null }),
}), {
  name: "wuff-store",
  partialize: (state) => ({
    items: state.items,
    isAuthenticated: state.isAuthenticated,
    displayName: state.displayName,
    registeredAt: state.registeredAt,
    promoBannerDismissed: state.promoBannerDismissed,
  }),
}));