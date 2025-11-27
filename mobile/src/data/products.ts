export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Artisan Sourdough',
    description: 'Classic sourdough with crispy crust and tangy flavor',
    price: 8.99,
    image: '/src/assets/sourdough.jpg',
    category: 'Bread',
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Whole Wheat Loaf',
    description: 'Healthy whole grain bread, perfect for sandwiches',
    price: 6.99,
    image: '/src/assets/whole-wheat.jpg',
    category: 'Bread',
    rating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    name: 'Butter Croissant',
    description: 'Flaky, buttery French pastry',
    price: 4.99,
    image: '/src/assets/croissant.jpg',
    category: 'Pastries',
    rating: 4.9,
    reviews: 203
  },
  {
    id: '4',
    name: 'Cinnamon Rolls',
    description: 'Sweet rolls with cinnamon and cream cheese frosting',
    price: 5.99,
    image: '/src/assets/cinnamon-rolls.jpg',
    category: 'Pastries',
    rating: 4.7,
    reviews: 156
  },
  {
    id: '5',
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake with ganache',
    price: 24.99,
    image: '/src/assets/chocolate-cake.jpg',
    category: 'Cakes',
    rating: 4.9,
    reviews: 87
  },
  {
    id: '6',
    name: 'French Baguette',
    description: 'Traditional French bread with crispy crust',
    price: 3.99,
    image: '/src/assets/baguette.jpg',
    category: 'Bread',
    rating: 4.5,
    reviews: 142
  }
];