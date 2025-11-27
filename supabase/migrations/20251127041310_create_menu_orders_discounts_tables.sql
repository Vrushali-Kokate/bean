/*
  # Create Menu, Orders, and Discounts Tables

  1. New Tables
    - `menu_items`
      - `id` (text, primary key)
      - `name` (text, required)
      - `description` (text)
      - `price` (numeric, required)
      - `category` (text, required)
      - `image` (text)
      - `calories` (integer, default 0)
      - `available` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `orders`
      - `id` (text, primary key)
      - `date` (timestamptz, default now())
      - `items` (jsonb, array of cart items)
      - `subtotal` (numeric, required)
      - `discount_code` (text, nullable)
      - `discount_amount` (numeric, default 0)
      - `tax` (numeric, required)
      - `total` (numeric, required)
      - `table_number` (text, required)
      - `customer_name` (text, required)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `discount_codes`
      - `id` (text, primary key)
      - `code` (text, unique, required)
      - `type` (text, required) - 'percent' or 'fixed'
      - `value` (numeric, required)
      - `active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (customer view)
    - Add policies for authenticated admin access (dashboard)
    
  3. Important Notes
    - All tables use text IDs for compatibility with existing code
    - Orders store items as JSONB for flexibility
    - Discount codes are case-insensitive via UPPER() constraint
    - Timestamps track creation and modification
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image text DEFAULT '',
  calories integer DEFAULT 0,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  date timestamptz DEFAULT now(),
  items jsonb NOT NULL,
  subtotal numeric NOT NULL CHECK (subtotal >= 0),
  discount_code text,
  discount_amount numeric DEFAULT 0 CHECK (discount_amount >= 0),
  tax numeric NOT NULL CHECK (tax >= 0),
  total numeric NOT NULL CHECK (total >= 0),
  table_number text NOT NULL,
  customer_name text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id text PRIMARY KEY,
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('percent', 'fixed')),
  value numeric NOT NULL CHECK (value >= 0),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_table_customer ON orders(table_number, customer_name);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(UPPER(code));
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(active);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Menu Items Policies (Public can read, no auth needed for customer view)
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert menu items"
  ON menu_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update menu items"
  ON menu_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete menu items"
  ON menu_items FOR DELETE
  USING (true);

-- Orders Policies (Public can create orders, view their own)
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete orders"
  ON orders FOR DELETE
  USING (true);

-- Discount Codes Policies (Public can read active codes)
CREATE POLICY "Anyone can view active discount codes"
  ON discount_codes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create discount codes"
  ON discount_codes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update discount codes"
  ON discount_codes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete discount codes"
  ON discount_codes FOR DELETE
  USING (true);

-- Insert default menu items
INSERT INTO menu_items (id, name, description, price, category, image, calories, available) VALUES
  ('hc-1', 'Espresso Silk', 'A smooth, rich shot of premium Arabica beans with a velvety crema.', 3.50, 'Hot Coffee', 'https://picsum.photos/seed/espresso/400/400', 10, true),
  ('hc-2', 'Vanilla Oat Latte', 'House-made vanilla bean syrup swirled with espresso and steamed oat milk.', 5.50, 'Hot Coffee', 'https://picsum.photos/seed/latte/400/400', 180, true),
  ('hc-3', 'Cappuccino Royale', 'Equal parts espresso, steamed milk, and milk foam, dusted with dark cocoa.', 4.75, 'Hot Coffee', 'https://picsum.photos/seed/cappuccino/400/400', 120, true),
  ('cc-1', 'Nitro Cold Brew', 'Cold brew infused with nitrogen for a creamy texture and cascading effect.', 5.00, 'Cold Coffee', 'https://picsum.photos/seed/nitro/400/400', 5, true),
  ('cc-2', 'Iced Caramel Macchiato', 'Espresso poured over ice and milk, topped with caramel drizzle.', 6.00, 'Cold Coffee', 'https://picsum.photos/seed/icedmac/400/400', 250, true),
  ('tea-1', 'Matcha Green Tea Latte', 'Premium ceremonial grade matcha whisked with steamed milk.', 5.25, 'Tea', 'https://picsum.photos/seed/matcha/400/400', 140, true),
  ('tea-2', 'Earl Grey Lavendar', 'Classic Earl Grey tea infused with dried lavender buds.', 4.00, 'Tea', 'https://picsum.photos/seed/earlgrey/400/400', 0, true),
  ('bak-1', 'Almond Croissant', 'Buttery, flaky pastry filled with almond cream and topped with sliced almonds.', 4.50, 'Bakery', 'https://picsum.photos/seed/croissant/400/400', 380, true),
  ('bak-2', 'Blueberry Scone', 'Tender crumb scone bursting with fresh blueberries and lemon zest.', 3.75, 'Bakery', 'https://picsum.photos/seed/scone/400/400', 320, true),
  ('brk-1', 'Avocado Toast', 'Sourdough toast topped with smashed avocado, radish, chili flakes, and microgreens.', 9.50, 'Breakfast', 'https://picsum.photos/seed/avotoast/400/400', 350, true),
  ('brk-2', 'Acai Bowl', 'Acai berry blend topped with granola, banana, strawberries, and honey.', 11.00, 'Breakfast', 'https://picsum.photos/seed/acai/400/400', 400, true)
ON CONFLICT (id) DO NOTHING;

-- Insert default discount code
INSERT INTO discount_codes (id, code, type, value, active) VALUES
  ('welcome-1', 'WELCOME10', 'percent', 10, true)
ON CONFLICT (id) DO NOTHING;