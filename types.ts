export enum Category {
  HOT_COFFEE = 'Hot Coffee',
  COLD_COFFEE = 'Cold Coffee',
  TEA = 'Tea',
  BAKERY = 'Bakery',
  BREAKFAST = 'Breakfast'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Changed from enum to string to allow dynamic categories
  image: string;
  calories?: number;
  available?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface AiRecommendation {
  menuItemId: string;
  reasoning: string;
}

export type OrderStatus = 'pending' | 'completed';

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  tax: number;
  total: number;
  tableNumber: string;
  customerName: string;
  status: OrderStatus;
}