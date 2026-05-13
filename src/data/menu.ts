export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  featured?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export const menu: MenuCategory[] = [
  {
    id: "coffee-tea",
    title: "Espresso, Coffee & Tea",
    items: [
      { name: "Double Espresso", price: "2.50", featured: true },
      { name: "Cappuccino", price: "3.50", featured: true },
      { name: "Drip — Ethiopian Yirgacheffe", description: "Bright, citrus, floral.", featured: true },
      { name: "Drip — Congo Dark Roast", description: "Cocoa, walnut, deep finish." },
    ],
  },
  {
    id: "breakfast",
    title: "Breakfast",
    subtitle: "Served until 10:30",
    items: [
      {
        name: "Smoked Salmon & Herbed Cream Cheese",
        description: "Everything bagel with house-made dill-and-chive cream cheese, smoked salmon, capers, red onion, fresh dill.",
        price: "11",
        featured: true,
      },
      {
        name: "Quiche du Jour",
        description: "Ask staff for today's selection.",
        price: "6",
      },
      {
        name: '"F" Is for Frankie',
        description: "Canadian bacon, sharp cheddar, sunny-up egg on a house-made biscuit. Add hot honey +.50.",
        price: "8",
        featured: true,
      },
      {
        name: "Greek Yogurt Parfait",
        description: "Layered Greek yogurt, honey-almond granola, banana, chia seed.",
        price: "5",
      },
    ],
  },
  {
    id: "lunch",
    title: "Lunch",
    items: [
      {
        name: "Turkey and Cheese",
        description: "Smoked peppercorn turkey, arugula, sharp cheddar, basil pesto, hummus on multi-grain.",
        price: "10",
        featured: true,
      },
      {
        name: "Prosciutto and Arugula",
        description: "Sliced prosciutto, organic arugula, roasted red pepper spread on toasted ciabatta.",
        price: "7",
      },
      {
        name: "Mediterranean",
        description: "Roasted red pepper hummus, spinach, red onion, black olive, feta on toasted ciabatta.",
        price: "11",
        featured: true,
      },
    ],
  },
  {
    id: "pastries",
    title: "Pastries",
    subtitle: "Served all day",
    items: [
      { name: "Cheddar-Bacon Scone", description: "House-made, baked fresh each morning.", featured: true },
      { name: "Strawberry Scone", description: "Macerated strawberries, light glaze." },
      { name: "Blueberry Muffin" },
      { name: "Cranberry-Orange Scone" },
    ],
  },
];

export const featuredItems = menu.flatMap((c) => c.items.filter((i) => i.featured));
