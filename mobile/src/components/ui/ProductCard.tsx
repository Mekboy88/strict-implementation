import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  onAddToCart: () => void;
}

export const ProductCard = ({ id, title, description, price, image, category, onAddToCart }: ProductCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${id}`}>
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <span className="text-xs text-gray-500 uppercase">{category}</span>
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-semibold mt-1 hover:text-blue-600">{title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-blue-600">${price.toFixed(2)}</span>
          <button 
            onClick={onAddToCart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};