import React from 'react'
import { ProductCard } from '../components/ProductCard'

export default function Page() {
  const products = [
    { id: 1, name: 'Sourdough Bread', price: 3.99, image: 'https://placehold.co/400x300' },
    { id: 2, name: 'Whole Wheat Bread', price: 2.99, image: 'https://placehold.co/400x300' },
    { id: 3, name: 'Rye Bread', price: 4.49, image: 'https://placehold.co/400x300' },
    { id: 4, name: 'Baguette', price: 2.49, image: 'https://placehold.co/400x300' },
  ]
  
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8">Online Bread Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </main>
  )
}
