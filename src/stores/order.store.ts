import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "rejected";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface GlobalOrder {
  id: string;
  type: "dine-in" | "delivery";
  tableNumber?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "cash" | "wallet";
  createdAt: string;
}

interface OrderState {
  orders: GlobalOrder[];
  placeOrder: (order: GlobalOrder) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      
      placeOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders]
        }));
      },
      
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) => 
            order.id === id ? { ...order, status } : order
          )
        }));
      }
    }),
    {
      name: 'smartmenu-global-orders',
    }
  )
);
