import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/" className="text-blue-600 hover:underline">Back to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-2xl">←</Link>
          <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <span className="text-sm text-gray-500 uppercase">{product.category}</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-yellow-500">★ {product.rating}</span>
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;