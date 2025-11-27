import React from 'react'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
    </div>
  )
}
