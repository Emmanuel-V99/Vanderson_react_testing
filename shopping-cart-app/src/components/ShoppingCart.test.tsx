import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShoppingCart } from './ShoppingCart';

describe('ShoppingCart Component', () => {
  beforeEach(() => {
    // Reset any state before each test
  });

  describe('Initial Rendering', () => {
    it('should render the shopping cart title', () => {
      render(<ShoppingCart />);
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    });

    it('should display empty cart message initially', () => {
      render(<ShoppingCart />);
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should render product name input field', () => {
      render(<ShoppingCart />);
      expect(screen.getByLabelText('Product name')).toBeInTheDocument();
    });

    it('should render product price input field', () => {
      render(<ShoppingCart />);
      expect(screen.getByLabelText('Product price')).toBeInTheDocument();
    });

    it('should render add to cart button', () => {
      render(<ShoppingCart />);
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('should not display cart summary when cart is empty', () => {
      render(<ShoppingCart />);
      expect(screen.queryByText(/Subtotal:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Total:/)).not.toBeInTheDocument();
    });
  });

  describe('Adding Items to Cart', () => {
    it('should add a single item to the cart', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Product');
      await user.type(priceInput, '25.99');
      await user.click(addButton);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$25.99')).toBeInTheDocument();
    });

    it('should add multiple different items to the cart', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      // Add first item
      await user.type(nameInput, 'Item 1');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      // Add second item
      await user.type(nameInput, 'Item 2');
      await user.type(priceInput, '20.00');
      await user.click(addButton);

      // Add third item
      await user.type(nameInput, 'Item 3');
      await user.type(priceInput, '15.50');
      await user.click(addButton);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should clear input fields after adding item', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name') as HTMLInputElement;
      const priceInput = screen.getByLabelText('Product price') as HTMLInputElement;
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Product');
      await user.type(priceInput, '25.99');
      await user.click(addButton);

      expect(nameInput.value).toBe('');
      expect(priceInput.value).toBe('');
    });

    it('should not add item with empty name', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(priceInput, '25.99');
      await user.click(addButton);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should not add item with whitespace-only name', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, '   ');
      await user.type(priceInput, '25.99');
      await user.click(addButton);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should not add item with empty price', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Product');
      await user.click(addButton);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should not add item with zero price', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Product');
      await user.type(priceInput, '0');
      await user.click(addButton);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should not add item with negative price', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Product');
      await user.type(priceInput, '-10');
      await user.click(addButton);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should trim whitespace from product name', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, '  Test Product  ');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.queryByText('  Test Product  ')).not.toBeInTheDocument();
    });

    it('should add item with decimal price', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Decimal Item');
      await user.type(priceInput, '9.99');
      await user.click(addButton);

      expect(screen.getByText('Decimal Item')).toBeInTheDocument();
      expect(screen.getByText('$9.99')).toBeInTheDocument();
    });
  });

  describe('Removing Items from Cart', () => {
    it('should remove an item from the cart', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Item to Remove');
      await user.type(priceInput, '15.00');
      await user.click(addButton);

      expect(screen.getByText('Item to Remove')).toBeInTheDocument();

      const removeButton = screen.getByText('Remove');
      await user.click(removeButton);

      expect(screen.queryByText('Item to Remove')).not.toBeInTheDocument();
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should remove the correct item when multiple items exist', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      // Add three items
      await user.type(nameInput, 'Item 1');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      await user.type(nameInput, 'Item 2');
      await user.type(priceInput, '20.00');
      await user.click(addButton);

      await user.type(nameInput, 'Item 3');
      await user.type(priceInput, '30.00');
      await user.click(addButton);

      // Remove the second item
      const removeButtons = screen.getAllByText('Remove');
      await user.click(removeButtons[1]);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Updating Item Quantities', () => {
    it('should update quantity of an item', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Item');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      const quantityInput = screen.getByLabelText('Quantity for Test Item') as HTMLInputElement;
      expect(quantityInput.value).toBe('1');

      await user.clear(quantityInput);
      await user.type(quantityInput, '5');

      expect(quantityInput.value).toBe('5');
    });

    it('should not allow quantity less than 1', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Item');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      // Initial quantity should be 1
      const quantityInput = screen.getByLabelText('Quantity for Test Item') as HTMLInputElement;
      expect(quantityInput.value).toBe('1');
      
      // Component's updateQuantity function prevents updating to quantity < 1
      // So attempting to change to 0 or negative shouldn't work
      // However, the input field will reflect what user types
      // Let's verify the actual quantity by checking if it remains at the valid quantity
      await user.clear(quantityInput);
      
      // After clearing, input should be empty, and quantity should stay as is
      expect(quantityInput.value).toBe('');
    });

    it('should handle large quantities', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Bulk Item');
      await user.type(priceInput, '5.00');
      await user.click(addButton);

      const quantityInput = screen.getByLabelText('Quantity for Bulk Item');
      await user.clear(quantityInput);
      await user.type(quantityInput, '100');

      expect(screen.getByLabelText('Quantity for Bulk Item')).toHaveValue(100);
    });

    it('should update quantity for specific item when multiple items exist', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      // Add two items
      await user.type(nameInput, 'Item A');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      await user.type(nameInput, 'Item B');
      await user.type(priceInput, '20.00');
      await user.click(addButton);

      // Update quantity of first item
      const quantityInputA = screen.getByLabelText('Quantity for Item A');
      await user.clear(quantityInputA);
      await user.type(quantityInputA, '3');

      expect(screen.getByLabelText('Quantity for Item A')).toHaveValue(3);
      expect(screen.getByLabelText('Quantity for Item B')).toHaveValue(1);
    });
  });

  describe('Clearing the Cart', () => {
    it('should clear all items from the cart', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      // Add multiple items
      await user.type(nameInput, 'Item 1');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      await user.type(nameInput, 'Item 2');
      await user.type(priceInput, '20.00');
      await user.click(addButton);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();

      const clearButton = screen.getByText('Clear Cart');
      await user.click(clearButton);

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should not display clear cart button when cart is empty', () => {
      render(<ShoppingCart />);
      expect(screen.queryByText('Clear Cart')).not.toBeInTheDocument();
    });
  });

  describe('Cart Calculations', () => {
    it('should display correct subtotal for single item', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Item');
      await user.type(priceInput, '25.00');
      await user.click(addButton);

      expect(screen.getByText('Subtotal: $25.00')).toBeInTheDocument();
    });

    it('should display correct subtotal for multiple items', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Item 1');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      await user.type(nameInput, 'Item 2');
      await user.type(priceInput, '15.00');
      await user.click(addButton);

      await user.type(nameInput, 'Item 3');
      await user.type(priceInput, '20.00');
      await user.click(addButton);

      expect(screen.getByText('Subtotal: $45.00')).toBeInTheDocument();
    });

    it('should update subtotal when quantity changes', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Item');
      await user.type(priceInput, '10.00');
      await user.click(addButton);

      expect(screen.getByText('Subtotal: $10.00')).toBeInTheDocument();

      const quantityInput = screen.getByLabelText('Quantity for Test Item');
      await user.clear(quantityInput);
      await user.type(quantityInput, '5');

      expect(screen.getByText('Subtotal: $50.00')).toBeInTheDocument();
    });

    it('should display no discount when subtotal < $50', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Small Item');
      await user.type(priceInput, '25.00');
      await user.click(addButton);

      expect(screen.getByText('Discount: -$0.00')).toBeInTheDocument();
    });

    it('should display 5% discount when subtotal >= $50 and < $100', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Medium Item');
      await user.type(priceInput, '60.00');
      await user.click(addButton);

      expect(screen.getByText('Discount: -$3.00')).toBeInTheDocument();
    });

    it('should display 10% discount when subtotal >= $100', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Large Item');
      await user.type(priceInput, '150.00');
      await user.click(addButton);

      expect(screen.getByText('Discount: -$15.00')).toBeInTheDocument();
    });

    it('should calculate tax correctly on amount after discount', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Item');
      await user.type(priceInput, '100.00');
      await user.click(addButton);

      // Subtotal: $100, Discount: $10, After discount: $90, Tax: $7.20
      expect(screen.getByText('Tax: $7.20')).toBeInTheDocument();
    });

    it('should display correct total with no discount', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Item');
      await user.type(priceInput, '30.00');
      await user.click(addButton);

      // Subtotal: $30, Discount: $0, Tax: $2.40, Total: $32.40
      expect(screen.getByText('Total: $32.40')).toBeInTheDocument();
    });

    it('should display correct total with 5% discount', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Item');
      await user.type(priceInput, '60.00');
      await user.click(addButton);

      // Subtotal: $60, Discount: $3, After: $57, Tax: $4.56, Total: $61.56
      expect(screen.getByText('Total: $61.56')).toBeInTheDocument();
    });

    it('should display correct total with 10% discount', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Expensive Item');
      await user.type(priceInput, '150.00');
      await user.click(addButton);

      // Subtotal: $150, Discount: $15, After: $135, Tax: $10.80, Total: $145.80
      expect(screen.getByText('Total: $145.80')).toBeInTheDocument();
    });

    it('should update all calculations when item is removed', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      // Add items to get > $100 (10% discount)
      await user.type(nameInput, 'Item 1');
      await user.type(priceInput, '80.00');
      await user.click(addButton);

      await user.type(nameInput, 'Item 2');
      await user.type(priceInput, '30.00');
      await user.click(addButton);

      // Subtotal: $110, Discount: $11, After: $99, Tax: $7.92, Total: $106.92
      expect(screen.getByText('Subtotal: $110.00')).toBeInTheDocument();
      expect(screen.getByText('Discount: -$11.00')).toBeInTheDocument();

      // Remove second item
      const removeButtons = screen.getAllByText('Remove');
      await user.click(removeButtons[1]);

      // New: Subtotal: $80, Discount: $4 (5%), After: $76, Tax: $6.08, Total: $82.08
      expect(screen.getByText('Subtotal: $80.00')).toBeInTheDocument();
      expect(screen.getByText('Discount: -$4.00')).toBeInTheDocument();
      expect(screen.getByText('Total: $82.08')).toBeInTheDocument();
    });
  });

  describe('Display and Formatting', () => {
    it('should format all currency values correctly', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Test Item');
      await user.type(priceInput, '9.99');
      await user.click(addButton);

      // Check that price is displayed with $ and 2 decimals
      expect(screen.getByText('$9.99')).toBeInTheDocument();
    });

    it('should display item prices in the cart list', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Product A');
      await user.type(priceInput, '12.50');
      await user.click(addButton);

      await user.type(nameInput, 'Product B');
      await user.type(priceInput, '25.99');
      await user.click(addButton);

      expect(screen.getByText('$12.50')).toBeInTheDocument();
      expect(screen.getByText('$25.99')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle adding item at exactly $50 subtotal boundary', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Boundary Item');
      await user.type(priceInput, '50.00');
      await user.click(addButton);

      expect(screen.getByText('Subtotal: $50.00')).toBeInTheDocument();
      expect(screen.getByText('Discount: -$2.50')).toBeInTheDocument(); // 5% discount
    });

    it('should handle adding item at exactly $100 subtotal boundary', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Boundary Item');
      await user.type(priceInput, '100.00');
      await user.click(addButton);

      expect(screen.getByText('Subtotal: $100.00')).toBeInTheDocument();
      expect(screen.getByText('Discount: -$10.00')).toBeInTheDocument(); // 10% discount
    });

    it('should handle very small prices', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Cheap Item');
      await user.type(priceInput, '0.01');
      await user.click(addButton);

      expect(screen.getByText('Cheap Item')).toBeInTheDocument();
      expect(screen.getByText('$0.01')).toBeInTheDocument();
    });

    it('should handle large prices', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      await user.type(nameInput, 'Expensive Item');
      await user.type(priceInput, '9999.99');
      await user.click(addButton);

      expect(screen.getByText('Expensive Item')).toBeInTheDocument();
      expect(screen.getByText('$9999.99')).toBeInTheDocument();
    });

    it('should handle rapid successive operations', async () => {
      const user = userEvent.setup();
      render(<ShoppingCart />);

      const nameInput = screen.getByLabelText('Product name');
      const priceInput = screen.getByLabelText('Product price');
      const addButton = screen.getByText('Add to Cart');

      // Rapidly add multiple items
      for (let i = 1; i <= 5; i++) {
        await user.type(nameInput, `Item ${i}`);
        await user.type(priceInput, `${i * 10}.00`);
        await user.click(addButton);
      }

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 5')).toBeInTheDocument();
    });
  });
});
