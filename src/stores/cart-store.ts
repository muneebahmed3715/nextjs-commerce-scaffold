import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  sku: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  hydrateFromServer: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      hydrateFromServer: async () => {
        if (typeof window === 'undefined') {
          return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
          return;
        }

        try {
          const response = await fetch('/api/cart', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            return;
          }

          const data = await response.json();
          const serverItems = Array.isArray(data?.items) ? data.items : [];
          const localItems = get().items;

          if (serverItems.length === 0 && localItems.length > 0) {
            await fetch('/api/cart', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                items: localItems.map((item) => ({
                  id: item.id,
                  quantity: item.quantity,
                })),
              }),
            });
            return;
          }

          set({ items: serverItems });
        } catch {
          // Keep local state as source of truth when server sync fails.
        }
      },
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          let nextItems: CartItem[];
          
          if (existingItem) {
            nextItems = state.items.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            nextItems = [...state.items, { ...newItem, quantity: 1 }];
          }

          if (typeof window !== 'undefined') {
            const userDataRaw = localStorage.getItem('userData');
            let customerName = '';
            if (userDataRaw) {
              try {
                const parsed = JSON.parse(userDataRaw) as { name?: string; email?: string };
                customerName = parsed.name || parsed.email || '';
              } catch {
                customerName = '';
              }
            }

            window.alert('Item added to your cart successfully.');

            const token = localStorage.getItem('authToken');

            void fetch('/api/supplier-notifications/cart-add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                productId: newItem.id,
                quantity: 1,
                customerName,
              }),
            });

            if (token) {
              void fetch('/api/cart', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  items: nextItems.map((item) => ({ id: item.id, quantity: item.quantity })),
                }),
              });
            }
          }
          
          return {
            items: nextItems,
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => {
          const nextItems = state.items.filter((item) => item.id !== id);

          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) {
              void fetch('/api/cart', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  items: nextItems.map((item) => ({ id: item.id, quantity: item.quantity })),
                }),
              });
            }
          }

          return {
            items: nextItems,
          };
        });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set((state) => {
          const nextItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );

          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) {
              void fetch('/api/cart', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  items: nextItems.map((item) => ({ id: item.id, quantity: item.quantity })),
                }),
              });
            }
          }

          return {
            items: nextItems,
          };
        });
      },
      
      clearCart: () => {
        set(() => {
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            if (token) {
              void fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            }
          }

          return { items: [] };
        });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);