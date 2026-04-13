import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[0],
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-in"
    >
      <div className="relative overflow-hidden rounded-lg bg-card shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={400}
            height={533}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Sale badge */}
        {product.originalPrice && (
          <span className="absolute top-3 left-3 bg-gold text-accent-foreground text-xs font-semibold px-2 py-1 rounded-sm">
            SALE
          </span>
        )}

        {/* Quick add */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-20 right-3 bg-primary text-primary-foreground p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold"
          aria-label="Add to cart"
        >
          <ShoppingBag size={16} />
        </button>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.fabric}</p>
          <h3 className="font-heading text-sm font-semibold text-card-foreground truncate">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-body font-semibold text-card-foreground">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground text-xs line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex gap-1 mt-2">
            {product.sizes.map((size) => (
              <span key={size} className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm">
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
