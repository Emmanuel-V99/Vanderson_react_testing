import { describe, it, expect } from 'vitest';
import type { CartItem } from './cartUtils';
import {
  calculateItemTotal,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  formatCurrency,
  isValidQuantity,
} from './cartUtils';

describe('calculateItemTotal', () => {
  it('should calculate the total for a single item correctly', () => {
    const item: CartItem = { id: 1, name: 'Test Item', price: 10, quantity: 3 };
    expect(calculateItemTotal(item)).toBe(30);
  });

  it('should handle quantity of 1', () => {
    const item: CartItem = { id: 1, name: 'Test Item', price: 25.99, quantity: 1 };
    expect(calculateItemTotal(item)).toBe(25.99);
  });

  it('should handle decimal prices correctly', () => {
    const item: CartItem = { id: 1, name: 'Test Item', price: 9.99, quantity: 2 };
    expect(calculateItemTotal(item)).toBeCloseTo(19.98, 2);
  });

  it('should return 0 when quantity is 0', () => {
    const item: CartItem = { id: 1, name: 'Test Item', price: 10, quantity: 0 };
    expect(calculateItemTotal(item)).toBe(0);
  });

  it('should handle large quantities', () => {
    const item: CartItem = { id: 1, name: 'Test Item', price: 5.50, quantity: 100 };
    expect(calculateItemTotal(item)).toBe(550);
  });
});

describe('calculateSubtotal', () => {
  it('should calculate subtotal for multiple items', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 10, quantity: 2 },
      { id: 2, name: 'Item 2', price: 15, quantity: 1 },
      { id: 3, name: 'Item 3', price: 5, quantity: 3 },
    ];
    expect(calculateSubtotal(items)).toBe(50); // (10*2) + (15*1) + (5*3) = 20 + 15 + 15
  });

  it('should return 0 for an empty cart', () => {
    const items: CartItem[] = [];
    expect(calculateSubtotal(items)).toBe(0);
  });

  it('should handle a single item', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 25, quantity: 2 },
    ];
    expect(calculateSubtotal(items)).toBe(50);
  });

  it('should handle decimal prices accurately', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 9.99, quantity: 2 },
      { id: 2, name: 'Item 2', price: 5.50, quantity: 3 },
    ];
    expect(calculateSubtotal(items)).toBeCloseTo(36.48, 2);
  });

  it('should handle items with 0 quantity', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 10, quantity: 0 },
      { id: 2, name: 'Item 2', price: 20, quantity: 1 },
    ];
    expect(calculateSubtotal(items)).toBe(20);
  });
});

describe('calculateDiscount', () => {
  it('should apply 10% discount for subtotal >= $100', () => {
    expect(calculateDiscount(100)).toBe(10);
    expect(calculateDiscount(150)).toBe(15);
    expect(calculateDiscount(200)).toBe(20);
  });

  it('should apply 5% discount for subtotal >= $50 and < $100', () => {
    expect(calculateDiscount(50)).toBe(2.5);
    expect(calculateDiscount(75)).toBe(3.75);
    expect(calculateDiscount(99.99)).toBeCloseTo(4.9995, 4);
  });

  it('should apply no discount for subtotal < $50', () => {
    expect(calculateDiscount(0)).toBe(0);
    expect(calculateDiscount(25)).toBe(0);
    expect(calculateDiscount(49.99)).toBe(0);
  });

  it('should handle boundary condition at $100', () => {
    expect(calculateDiscount(99.99)).toBeCloseTo(4.9995, 4); // 5% discount
    expect(calculateDiscount(100.00)).toBe(10); // 10% discount
    expect(calculateDiscount(100.01)).toBeCloseTo(10.001, 3); // 10% discount
  });

  it('should handle boundary condition at $50', () => {
    expect(calculateDiscount(49.99)).toBe(0); // No discount
    expect(calculateDiscount(50.00)).toBe(2.5); // 5% discount
    expect(calculateDiscount(50.01)).toBeCloseTo(2.5005, 4); // 5% discount
  });

  it('should handle very large subtotals', () => {
    expect(calculateDiscount(1000)).toBe(100);
    expect(calculateDiscount(10000)).toBe(1000);
  });
});

describe('calculateTax', () => {
  it('should calculate 8% tax correctly', () => {
    expect(calculateTax(100)).toBe(8);
    expect(calculateTax(50)).toBe(4);
    expect(calculateTax(25)).toBe(2);
  });

  it('should handle decimal amounts', () => {
    expect(calculateTax(99.99)).toBeCloseTo(7.9992, 4);
    expect(calculateTax(12.50)).toBeCloseTo(1.00, 2);
  });

  it('should return 0 for 0 amount', () => {
    expect(calculateTax(0)).toBe(0);
  });

  it('should handle very small amounts', () => {
    expect(calculateTax(0.01)).toBeCloseTo(0.0008, 4);
    expect(calculateTax(1)).toBe(0.08);
  });

  it('should handle large amounts', () => {
    expect(calculateTax(1000)).toBe(80);
    expect(calculateTax(5000)).toBe(400);
  });
});

describe('calculateTotal', () => {
  it('should calculate total with no discount (subtotal < $50)', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 10, quantity: 2 },
      { id: 2, name: 'Item 2', price: 5, quantity: 2 },
    ];
    // subtotal = 30, discount = 0, tax = 30 * 0.08 = 2.40, total = 32.40
    expect(calculateTotal(items)).toBe(32.40);
  });

  it('should calculate total with 5% discount (subtotal >= $50 and < $100)', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 25, quantity: 2 },
      { id: 2, name: 'Item 2', price: 10, quantity: 1 },
    ];
    // subtotal = 60, discount = 3, afterDiscount = 57, tax = 4.56, total = 61.56
    expect(calculateTotal(items)).toBe(61.56);
  });

  it('should calculate total with 10% discount (subtotal >= $100)', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 50, quantity: 2 },
      { id: 2, name: 'Item 2', price: 25, quantity: 2 },
    ];
    // subtotal = 150, discount = 15, afterDiscount = 135, tax = 10.80, total = 145.80
    expect(calculateTotal(items)).toBe(145.80);
  });

  it('should handle empty cart', () => {
    const items: CartItem[] = [];
    expect(calculateTotal(items)).toBe(0);
  });

  it('should handle boundary at $50 subtotal', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 10, quantity: 5 },
    ];
    // subtotal = 50, discount = 2.50, afterDiscount = 47.50, tax = 3.80, total = 51.30
    expect(calculateTotal(items)).toBe(51.30);
  });

  it('should handle boundary at $100 subtotal', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 25, quantity: 4 },
    ];
    // subtotal = 100, discount = 10, afterDiscount = 90, tax = 7.20, total = 97.20
    expect(calculateTotal(items)).toBe(97.20);
  });

  it('should round to 2 decimal places', () => {
    const items: CartItem[] = [
      { id: 1, name: 'Item 1', price: 9.99, quantity: 3 },
    ];
    // subtotal = 29.97, discount = 0, tax = 2.3976, total = 32.3676 -> 32.37
    expect(calculateTotal(items)).toBe(32.37);
  });
});

describe('formatCurrency', () => {
  it('should format whole numbers with 2 decimal places', () => {
    expect(formatCurrency(10)).toBe('$10.00');
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format decimal numbers correctly', () => {
    expect(formatCurrency(9.99)).toBe('$9.99');
    expect(formatCurrency(12.50)).toBe('$12.50');
    expect(formatCurrency(99.95)).toBe('$99.95');
  });

  it('should format single decimal place numbers', () => {
    expect(formatCurrency(5.5)).toBe('$5.50');
    expect(formatCurrency(10.1)).toBe('$10.10');
  });

  it('should round to 2 decimal places', () => {
    expect(formatCurrency(9.999)).toBe('$10.00');
    expect(formatCurrency(5.555)).toBe('$5.55'); // toFixed uses banker's rounding
    expect(formatCurrency(12.346)).toBe('$12.35');
  });

  it('should handle very small amounts', () => {
    expect(formatCurrency(0.01)).toBe('$0.01');
    expect(formatCurrency(0.99)).toBe('$0.99');
  });

  it('should handle large amounts', () => {
    expect(formatCurrency(1000)).toBe('$1000.00');
    expect(formatCurrency(9999.99)).toBe('$9999.99');
  });
});

describe('isValidQuantity', () => {
  it('should return true for positive integers', () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity(5)).toBe(true);
    expect(isValidQuantity(100)).toBe(true);
    expect(isValidQuantity(1000)).toBe(true);
  });

  it('should return false for zero', () => {
    expect(isValidQuantity(0)).toBe(false);
  });

  it('should return false for negative numbers', () => {
    expect(isValidQuantity(-1)).toBe(false);
    expect(isValidQuantity(-10)).toBe(false);
    expect(isValidQuantity(-100)).toBe(false);
  });

  it('should return false for decimal numbers', () => {
    expect(isValidQuantity(1.5)).toBe(false);
    expect(isValidQuantity(2.99)).toBe(false);
    expect(isValidQuantity(0.5)).toBe(false);
  });

  it('should return false for very small positive decimals', () => {
    expect(isValidQuantity(0.01)).toBe(false);
    expect(isValidQuantity(0.999)).toBe(false);
  });

  it('should handle boundary condition at 1', () => {
    expect(isValidQuantity(0.99)).toBe(false);
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity(1.01)).toBe(false);
  });
});
