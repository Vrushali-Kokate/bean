import { MenuItem, Order, DiscountCode } from '../types';
import { supabase } from './supabase';

/**
 * SUPABASE BACKEND SERVICE
 *
 * This service connects to Supabase for all data operations.
 * All data is persisted in the cloud and synchronized in real-time.
 */

// --- MENU OPERATIONS ---

export const getMenu = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching menu:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: Number(item.price),
    category: item.category,
    image: item.image || '',
    calories: item.calories || 0,
    available: item.available !== false
  }));
};

export const saveMenuItem = async (item: MenuItem): Promise<void> => {
  const { error } = await supabase
    .from('menu_items')
    .upsert({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      image: item.image || '',
      calories: item.calories || 0,
      available: item.available !== false,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

// --- ORDER OPERATIONS ---

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data.map(order => ({
    id: order.id,
    date: order.date,
    items: order.items,
    subtotal: Number(order.subtotal),
    discountCode: order.discount_code,
    discountAmount: Number(order.discount_amount),
    tax: Number(order.tax),
    total: Number(order.total),
    tableNumber: order.table_number,
    customerName: order.customer_name,
    status: order.status
  }));
};

export const createOrder = async (order: Order): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .insert({
      id: order.id,
      date: order.date,
      items: order.items,
      subtotal: order.subtotal,
      discount_code: order.discountCode,
      discount_amount: order.discountAmount,
      tax: order.tax,
      total: order.total,
      table_number: order.tableNumber,
      customer_name: order.customerName,
      status: order.status
    });

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: 'completed'): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// --- DISCOUNT OPERATIONS ---

export const getDiscounts = async (): Promise<DiscountCode[]> => {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching discounts:', error);
    return [];
  }

  return data.map(discount => ({
    id: discount.id,
    code: discount.code,
    type: discount.type as 'percent' | 'fixed',
    value: Number(discount.value),
    active: discount.active !== false
  }));
};

export const saveDiscount = async (discount: DiscountCode): Promise<void> => {
  const { error } = await supabase
    .from('discount_codes')
    .upsert({
      id: discount.id,
      code: discount.code.toUpperCase(),
      type: discount.type,
      value: discount.value,
      active: discount.active !== false,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving discount:', error);
    throw error;
  }
};

export const deleteDiscount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
};

export const validateDiscountCode = async (code: string): Promise<DiscountCode | null> => {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .ilike('code', code)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('Error validating discount code:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    code: data.code,
    type: data.type as 'percent' | 'fixed',
    value: Number(data.value),
    active: data.active
  };
};

// --- CATEGORY OPERATIONS ---

export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('category')
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const categories = new Set(data.map(item => item.category));
  return Array.from(categories);
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
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString());

  if (error) {
    console.error('Error fetching order stats:', error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      averageOrderValue: 0,
      taxCollected: 0,
      discountsGiven: 0
    };
  }

  const totalRevenue = data.reduce((sum, order) => sum + Number(order.total), 0);
  const totalOrders = data.length;
  const pendingOrders = data.filter(o => o.status === 'pending').length;
  const completedOrders = data.filter(o => o.status === 'completed').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const taxCollected = data.reduce((sum, order) => sum + Number(order.tax), 0);
  const discountsGiven = data.reduce((sum, order) => sum + Number(order.discount_amount), 0);

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    completedOrders,
    averageOrderValue,
    taxCollected,
    discountsGiven
  };
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