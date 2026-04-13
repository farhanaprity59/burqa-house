import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center py-20">
          <h1 className="font-heading text-2xl text-foreground">Product not found</h1>
          <Link to="/products" className="text-gold hover:underline mt-4 inline-block font-body text-sm">
            ← Back to products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity,
    });
    toast({ title: "Added to cart", description: `${product.name} (${selectedSize}) added.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-body text-sm mb-8">
            <ArrowLeft size={16} /> Back to Collection
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image */}
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-card">
              <img
                src={product.image}
                alt={product.name}
                width={800}
                height={1024}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-2">{product.fabric}</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="font-heading text-2xl text-foreground">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
                )}
                {product.originalPrice && (
                  <span className="bg-gold text-accent-foreground text-xs font-semibold px-2 py-1 rounded-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <p className="font-body text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mb-8 font-body text-sm">
                <div><span className="text-muted-foreground">Fabric:</span> <span className="text-foreground font-medium">{product.fabric}</span></div>
                <div><span className="text-muted-foreground">Color:</span> <span className="text-foreground font-medium">{product.color}</span></div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <p className="font-body text-sm text-foreground font-medium mb-3">Select Size</p>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border font-body text-sm transition-all ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-transparent text-foreground border-border hover:border-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="font-body text-sm text-foreground font-medium mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-border text-foreground hover:border-gold transition-colors">−</button>
                  <span className="font-body text-foreground w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-border text-foreground hover:border-gold transition-colors">+</button>
                </div>
              </div>

              {/* Add to cart */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gold hover:bg-gold-dark text-accent-foreground font-body tracking-wider py-6 text-sm"
              >
                <ShoppingBag className="mr-2" size={18} /> ADD TO CART
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
