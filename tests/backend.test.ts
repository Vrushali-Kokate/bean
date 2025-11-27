import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as backend from '../services/backend';
import { MenuItem, Order, DiscountCode } from '../types';

vi.mock('../services/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      const mockData: any = {
        menu_items: [
          {
            id: 'test-1',
            name: 'Test Coffee',
            description: 'Test description',
            price: 5.0,
            category: 'Hot Coffee',
            image: 'test.jpg',
            calories: 100,
            available: true
          }
        ],
        orders: [
          {
            id: 'order-1',
            date: new Date().toISOString(),
            items: [{ id: 'test-1', name: 'Test Coffee', price: 5, quantity: 2 }],
            subtotal: 10,
            discount_code: null,
            discount_amount: 0,
            tax: 1,
            total: 11,
            table_number: '5',
            customer_name: 'Test User',
            status: 'pending'
          }
        ],
        discount_codes: [
          {
            id: 'discount-1',
            code: 'TEST10',
            type: 'percent',
            value: 10,
            active: true
          }
        ]
      };

      return {
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData[table], error: null }),
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockData[table][0], error: null })
          }),
          ilike: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: mockData[table][0], error: null })
            })
          }),
          gte: vi.fn().mockReturnValue({
            lte: vi.fn().mockResolvedValue({ data: mockData[table], error: null })
          })
        }),
        insert: vi.fn().mockResolvedValue({ error: null }),
        upsert: vi.fn().mockResolvedValue({ error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null })
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null })
        })
      };
    })
  }
}));

describe('Backend Service - Menu Operations', () => {
  it('should fetch menu items', async () => {
    const menu = await backend.getMenu();
    expect(menu).toBeDefined();
    expect(Array.isArray(menu)).toBe(true);
  });

  it('should save a menu item', async () => {
    const item: MenuItem = {
      id: 'new-item',
      name: 'New Coffee',
      description: 'A new coffee',
      price: 4.5,
      category: 'Hot Coffee',
      image: 'new.jpg',
      calories: 80,
      available: true
    };

    await expect(backend.saveMenuItem(item)).resolves.not.toThrow();
  });

  it('should delete a menu item', async () => {
    await expect(backend.deleteMenuItem('test-1')).resolves.not.toThrow();
  });
});

describe('Backend Service - Order Operations', () => {
  it('should fetch orders', async () => {
    const orders = await backend.getOrders();
    expect(orders).toBeDefined();
    expect(Array.isArray(orders)).toBe(true);
  });

  it('should create an order', async () => {
    const order: Order = {
      id: 'new-order',
      date: new Date().toISOString(),
      items: [
        {
          id: 'test-1',
          name: 'Test Coffee',
          description: 'Test',
          price: 5,
          category: 'Hot Coffee',
          image: 'test.jpg',
          calories: 100,
          quantity: 1
        }
      ],
      subtotal: 5,
      discountAmount: 0,
      tax: 0.5,
      total: 5.5,
      tableNumber: '10',
      customerName: 'John Doe',
      status: 'pending'
    };

    await expect(backend.createOrder(order)).resolves.not.toThrow();
  });

  it('should update order status', async () => {
    await expect(backend.updateOrderStatus('order-1', 'completed')).resolves.not.toThrow();
  });
});

describe('Backend Service - Discount Operations', () => {
  it('should fetch discount codes', async () => {
    const discounts = await backend.getDiscounts();
    expect(discounts).toBeDefined();
    expect(Array.isArray(discounts)).toBe(true);
  });

  it('should save a discount code', async () => {
    const discount: DiscountCode = {
      id: 'new-discount',
      code: 'SAVE20',
      type: 'percent',
      value: 20,
      active: true
    };

    await expect(backend.saveDiscount(discount)).resolves.not.toThrow();
  });

  it('should delete a discount code', async () => {
    await expect(backend.deleteDiscount('discount-1')).resolves.not.toThrow();
  });

  it('should validate a discount code', async () => {
    const discount = await backend.validateDiscountCode('TEST10');
    expect(discount).toBeDefined();
  });
});

describe('Backend Service - Statistics Operations', () => {
  it('should calculate order stats for a date range', async () => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const stats = await backend.getOrderStats(startDate, endDate);

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty('totalRevenue');
    expect(stats).toHaveProperty('totalOrders');
    expect(stats).toHaveProperty('pendingOrders');
    expect(stats).toHaveProperty('completedOrders');
    expect(stats).toHaveProperty('averageOrderValue');
    expect(stats).toHaveProperty('taxCollected');
    expect(stats).toHaveProperty('discountsGiven');
  });

  it('should get daily stats', async () => {
    const stats = await backend.getDailyStats();
    expect(stats).toBeDefined();
    expect(typeof stats.totalRevenue).toBe('number');
  });

  it('should get weekly stats', async () => {
    const stats = await backend.getWeeklyStats();
    expect(stats).toBeDefined();
    expect(typeof stats.totalOrders).toBe('number');
  });

  it('should get monthly stats', async () => {
    const stats = await backend.getMonthlyStats();
    expect(stats).toBeDefined();
    expect(typeof stats.averageOrderValue).toBe('number');
  });

  it('should get yearly stats', async () => {
    const stats = await backend.getYearlyStats();
    expect(stats).toBeDefined();
    expect(typeof stats.taxCollected).toBe('number');
  });
});

describe('Backend Service - Category Operations', () => {
  it('should fetch categories', async () => {
    const categories = await backend.getCategories();
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
  });
});
