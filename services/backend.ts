import { MenuItem, Order, DiscountCode } from '../types';
import { MENU_ITEMS } from '../constants';

/**
 * MOCK BACKEND SERVICE
 * 
 * In a real production environment, these methods would connect to 
 * Firebase Firestore using the Firebase JS SDK.
 * 
 * For this demo, we use localStorage to persist data so the app 
 * is fully functional out of the box without API keys.
 */

const KEYS = {
  MENU: 'aroma_menu_v1',
  ORDERS: 'aroma_orders_v1',
  DISCOUNTS: 'aroma_discounts_v1',
  CATEGORIES: 'aroma_categories_v1'
};

// --- MENU OPERATIONS ---

export const getMenu = async (): Promise<MenuItem[]> => {
  const stored = localStorage.getItem(KEYS.MENU);
  if (!stored) {
    // Seed initial data
    const initialData = MENU_ITEMS.map(item => ({ ...item, available: true, category: item.category.toString() }));
    localStorage.setItem(KEYS.MENU, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored);
};

export const saveMenuItem = async (item: MenuItem): Promise<void> => {
  const items = await getMenu();
  const index = items.findIndex(i => i.id === item.id);
  
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  
  localStorage.setItem(KEYS.MENU, JSON.stringify(items));
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const items = await getMenu();
  const filtered = items.filter(i => i.id !== id);
  localStorage.setItem(KEYS.MENU, JSON.stringify(filtered));
};

// --- ORDER OPERATIONS ---

export const getOrders = async (): Promise<Order[]> => {
  const stored = localStorage.getItem(KEYS.ORDERS);
  return stored ? JSON.parse(stored) : [];
};

export const createOrder = async (order: Order): Promise<void> => {
  const orders = await getOrders();
  // Newest first
  const newOrders = [order, ...orders];
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(newOrders));
  // Trigger storage event for cross-tab sync
  window.dispatchEvent(new Event('storage'));
};

export const updateOrderStatus = async (orderId: string, status: 'completed'): Promise<void> => {
  const orders = await getOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
};

// --- DISCOUNT OPERATIONS ---

export const getDiscounts = async (): Promise<DiscountCode[]> => {
  const stored = localStorage.getItem(KEYS.DISCOUNTS);
  if (!stored) {
    // Seed a default code
    const defaultCode: DiscountCode = {
      id: 'welcome-1',
      code: 'WELCOME10',
      type: 'percent',
      value: 10,
      active: true
    };
    localStorage.setItem(KEYS.DISCOUNTS, JSON.stringify([defaultCode]));
    return [defaultCode];
  }
  return JSON.parse(stored);
};

export const saveDiscount = async (discount: DiscountCode): Promise<void> => {
  const discounts = await getDiscounts();
  const index = discounts.findIndex(d => d.id === discount.id);
  
  if (index >= 0) {
    discounts[index] = discount;
  } else {
    discounts.push(discount);
  }
  localStorage.setItem(KEYS.DISCOUNTS, JSON.stringify(discounts));
};

export const deleteDiscount = async (id: string): Promise<void> => {
  const discounts = await getDiscounts();
  const filtered = discounts.filter(d => d.id !== id);
  localStorage.setItem(KEYS.DISCOUNTS, JSON.stringify(filtered));
};

export const validateDiscountCode = async (code: string): Promise<DiscountCode | null> => {
  const discounts = await getDiscounts();
  const found = discounts.find(d => d.code.toUpperCase() === code.toUpperCase() && d.active);
  return found || null;
};

// --- CATEGORY OPERATIONS ---

export const getCategories = async (): Promise<string[]> => {
  const items = await getMenu();
  const categories = new Set(items.map(i => i.category));
  return Array.from(categories);
};