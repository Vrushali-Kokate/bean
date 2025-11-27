import { Category, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'hc-1',
    name: 'Espresso Silk',
    description: 'A smooth, rich shot of premium Arabica beans with a velvety crema.',
    price: 3.50,
    category: Category.HOT_COFFEE,
    image: 'https://picsum.photos/seed/espresso/400/400',
    calories: 10
  },
  {
    id: 'hc-2',
    name: 'Vanilla Oat Latte',
    description: 'House-made vanilla bean syrup swirled with espresso and steamed oat milk.',
    price: 5.50,
    category: Category.HOT_COFFEE,
    image: 'https://picsum.photos/seed/latte/400/400',
    calories: 180
  },
  {
    id: 'hc-3',
    name: 'Cappuccino Royale',
    description: 'Equal parts espresso, steamed milk, and milk foam, dusted with dark cocoa.',
    price: 4.75,
    category: Category.HOT_COFFEE,
    image: 'https://picsum.photos/seed/cappuccino/400/400',
    calories: 120
  },
  {
    id: 'cc-1',
    name: 'Nitro Cold Brew',
    description: 'Cold brew infused with nitrogen for a creamy texture and cascading effect.',
    price: 5.00,
    category: Category.COLD_COFFEE,
    image: 'https://picsum.photos/seed/nitro/400/400',
    calories: 5
  },
  {
    id: 'cc-2',
    name: 'Iced Caramel Macchiato',
    description: 'Espresso poured over ice and milk, topped with caramel drizzle.',
    price: 6.00,
    category: Category.COLD_COFFEE,
    image: 'https://picsum.photos/seed/icedmac/400/400',
    calories: 250
  },
  {
    id: 'tea-1',
    name: 'Matcha Green Tea Latte',
    description: 'Premium ceremonial grade matcha whisked with steamed milk.',
    price: 5.25,
    category: Category.TEA,
    image: 'https://picsum.photos/seed/matcha/400/400',
    calories: 140
  },
  {
    id: 'tea-2',
    name: 'Earl Grey Lavendar',
    description: 'Classic Earl Grey tea infused with dried lavender buds.',
    price: 4.00,
    category: Category.TEA,
    image: 'https://picsum.photos/seed/earlgrey/400/400',
    calories: 0
  },
  {
    id: 'bak-1',
    name: 'Almond Croissant',
    description: 'Buttery, flaky pastry filled with almond cream and topped with sliced almonds.',
    price: 4.50,
    category: Category.BAKERY,
    image: 'https://picsum.photos/seed/croissant/400/400',
    calories: 380
  },
  {
    id: 'bak-2',
    name: 'Blueberry Scone',
    description: 'Tender crumb scone bursting with fresh blueberries and lemon zest.',
    price: 3.75,
    category: Category.BAKERY,
    image: 'https://picsum.photos/seed/scone/400/400',
    calories: 320
  },
  {
    id: 'brk-1',
    name: 'Avocado Toast',
    description: 'Sourdough toast topped with smashed avocado, radish, chili flakes, and microgreens.',
    price: 9.50,
    category: Category.BREAKFAST,
    image: 'https://picsum.photos/seed/avotoast/400/400',
    calories: 350
  },
  {
    id: 'brk-2',
    name: 'Acai Bowl',
    description: 'Acai berry blend topped with granola, banana, strawberries, and honey.',
    price: 11.00,
    category: Category.BREAKFAST,
    image: 'https://picsum.photos/seed/acai/400/400',
    calories: 400
  }
];
