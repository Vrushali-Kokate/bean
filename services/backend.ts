
import { MenuItem, Order, DiscountCode } from '../types';
import { db } from './firebase'; // Use db from firebase
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  getDoc,
  updateDoc
} from 'firebase/firestore';

/**
 * FIREBASE BACKEND SERVICE
 *
 * This service connects to Firebase Firestore for all data operations.
 */

// --- MENU OPERATIONS ---

export const getMenu = async (): Promise<MenuItem[]> => {
  try {
    const q = query(collection(db, 'menu_items'), orderBy('category'));
    const querySnapshot = await getDocs(q);
    const menu = querySnapshot.docs.map(doc => doc.data() as MenuItem);
    return menu;
  } catch (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
};

export const saveMenuItem = async (item: MenuItem): Promise<void> => {
  try {
    const docRef = doc(db, 'menu_items', item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    console.error('Error saving menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'menu_items', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// --- ORDER OPERATIONS ---

export const getOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => doc.data() as Order);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const createOrder = async (order: Order): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, order);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: 'completed'): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, { status: status, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// --- DISCOUNT OPERATIONS ---

export const getDiscounts = async (): Promise<DiscountCode[]> => {
  try {
    const q = query(collection(db, 'discount_codes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const discounts = querySnapshot.docs.map(doc => doc.data() as DiscountCode);
    return discounts;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return [];
  }
};

export const saveDiscount = async (discount: DiscountCode): Promise<void> => {
  try {
    const docRef = doc(db, 'discount_codes', discount.id);
    await setDoc(docRef, { ...discount, code: discount.code.toUpperCase() }, { merge: true });
  } catch (error) {
    console.error('Error saving discount:', error);
    throw error;
  }
};

export const deleteDiscount = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'discount_codes', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
};

export const validateDiscountCode = async (code: string): Promise<DiscountCode | null> => {
  try {
    const q = query(collection(db, 'discount_codes'), where('code', '==', code.toUpperCase()), where('active', '==', true));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return doc.data() as DiscountCode;
  } catch (error) {
    console.error('Error validating discount code:', error);
    return null;
  }
};

// --- CATEGORY OPERATIONS ---

export const getCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'menu_items'));
    const categories = new Set(querySnapshot.docs.map(doc => doc.data().category));
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};


// --- STATISTICS OPERATIONS ---

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  taxCollected: number;
  discountsGiven: number;
}

export const getOrderStats = async (startDate: Date, endDate: Date): Promise<OrderStats> => {
  try {
    const q = query(collection(db, 'orders'), where('date', '>=', startDate.toISOString()), where('date', '<=', endDate.toISOString()));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => doc.data() as Order);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const taxCollected = orders.reduce((sum, order) => sum + order.tax, 0);
    const discountsGiven = orders.reduce((sum, order) => sum + order.discountAmount, 0);

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      averageOrderValue,
      taxCollected,
      discountsGiven,
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      averageOrderValue: 0,
      taxCollected: 0,
      discountsGiven: 0,
    };
  }
};

export const getDailyStats = async (): Promise<OrderStats> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getOrderStats(today, tomorrow);
};

export const getWeeklyStats = async (): Promise<OrderStats> => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return getOrderStats(startOfWeek, endOfWeek);
};

export const getMonthlyStats = async (): Promise<OrderStats> => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  return getOrderStats(startOfMonth, endOfMonth);
};

export const getYearlyStats = async (): Promise<OrderStats> => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);

  return getOrderStats(startOfYear, endOfYear);
};


export function seedDatabase() {
  throw new Error('Function not implemented.');
}
