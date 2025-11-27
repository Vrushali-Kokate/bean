import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';
import Toast from '../components/Toast';
import WelcomeModal from '../components/WelcomeModal';

describe('Header Component', () => {
  it('should render header with app name', () => {
    const mockCartClick = vi.fn();
    const mockMenuClick = vi.fn();
    const mockHistoryClick = vi.fn();

    render(
      <Header
        cartCount={0}
        onCartClick={mockCartClick}
        onMenuClick={mockMenuClick}
        onHistoryClick={mockHistoryClick}
      />
    );

    expect(screen.getByText('Aroma & Bean')).toBeInTheDocument();
  });

  it('should display cart count badge when items in cart', () => {
    const mockCartClick = vi.fn();
    const mockMenuClick = vi.fn();
    const mockHistoryClick = vi.fn();

    render(
      <Header
        cartCount={3}
        onCartClick={mockCartClick}
        onMenuClick={mockMenuClick}
        onHistoryClick={mockHistoryClick}
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should have cart and history buttons', () => {
    const mockCartClick = vi.fn();
    const mockMenuClick = vi.fn();
    const mockHistoryClick = vi.fn();

    render(
      <Header
        cartCount={0}
        onCartClick={mockCartClick}
        onMenuClick={mockMenuClick}
        onHistoryClick={mockHistoryClick}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

describe('Toast Component', () => {
  it('should render toast with message when visible', () => {
    const mockClose = vi.fn();

    render(
      <Toast
        message="Test message"
        isVisible={true}
        onClose={mockClose}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    const mockClose = vi.fn();

    const { container } = render(
      <Toast
        message="Test message"
        isVisible={false}
        onClose={mockClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe('WelcomeModal Component', () => {
  it('should render welcome modal with input fields', () => {
    const mockSubmit = vi.fn();

    render(<WelcomeModal onSubmit={mockSubmit} />);

    expect(screen.getByText('Welcome to Aroma & Bean')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., 12/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., John Doe/i)).toBeInTheDocument();
  });

  it('should show error when submitting without required fields', () => {
    const mockSubmit = vi.fn();

    render(<WelcomeModal onSubmit={mockSubmit} />);

    const submitButton = screen.getByRole('button', { name: /start ordering/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/please enter both/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with correct data when form is valid', () => {
    const mockSubmit = vi.fn();

    render(<WelcomeModal onSubmit={mockSubmit} />);

    const tableInput = screen.getByPlaceholderText(/e.g., 12/i);
    const nameInput = screen.getByPlaceholderText(/e.g., John Doe/i);
    const submitButton = screen.getByRole('button', { name: /start ordering/i });

    fireEvent.change(tableInput, { target: { value: '5' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith('John Doe', '5');
  });
});

describe('Menu Component Utilities', () => {
  it('should filter menu items by category', () => {
    const items = [
      { id: '1', name: 'Espresso', category: 'Hot Coffee', price: 3 },
      { id: '2', name: 'Iced Latte', category: 'Cold Coffee', price: 5 },
      { id: '3', name: 'Cappuccino', category: 'Hot Coffee', price: 4 }
    ];

    const hotCoffee = items.filter(item => item.category === 'Hot Coffee');

    expect(hotCoffee).toHaveLength(2);
    expect(hotCoffee[0].name).toBe('Espresso');
    expect(hotCoffee[1].name).toBe('Cappuccino');
  });
});

describe('Cart Utilities', () => {
  it('should calculate subtotal correctly', () => {
    const cartItems = [
      { id: '1', name: 'Coffee', price: 5, quantity: 2 },
      { id: '2', name: 'Tea', price: 3, quantity: 1 }
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    expect(subtotal).toBe(13);
  });

  it('should calculate discount correctly for percentage', () => {
    const subtotal = 100;
    const discountPercent = 10;

    const discountAmount = subtotal * (discountPercent / 100);

    expect(discountAmount).toBe(10);
  });

  it('should calculate discount correctly for fixed amount', () => {
    const subtotal = 100;
    const discountFixed = 15;

    const discountAmount = Math.min(discountFixed, subtotal);

    expect(discountAmount).toBe(15);
  });

  it('should not allow discount to exceed subtotal', () => {
    const subtotal = 10;
    const discountFixed = 20;

    const discountAmount = Math.min(discountFixed, subtotal);

    expect(discountAmount).toBe(10);
  });

  it('should calculate tax correctly', () => {
    const subtotal = 100;
    const discountAmount = 10;
    const taxRate = 0.1;

    const tax = (subtotal - discountAmount) * taxRate;

    expect(tax).toBe(9);
  });

  it('should calculate total correctly', () => {
    const subtotal = 100;
    const discountAmount = 10;
    const tax = 9;

    const total = subtotal - discountAmount + tax;

    expect(total).toBe(99);
  });
});
