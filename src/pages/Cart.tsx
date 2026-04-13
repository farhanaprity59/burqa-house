import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-body text-sm mb-8">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>

          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="font-heading text-xl text-muted-foreground mb-4">Your cart is empty</p>
              <Link to="/products">
                <Button className="bg-gold hover:bg-gold-dark text-accent-foreground font-body tracking-wider">
                  BROWSE COLLECTION
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-card rounded-lg p-4 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-20 h-28 object-cover rounded-md" loading="lazy" />
                    <div className="flex-1">
                      <h3 className="font-heading text-sm font-semibold text-card-foreground">{item.name}</h3>
                      <p className="text-muted-foreground text-xs font-body mt-1">Size: {item.size}</p>
                      <p className="font-body font-semibold text-card-foreground mt-2">₹{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-7 h-7 rounded border border-border text-foreground text-sm">−</button>
                        <span className="text-sm font-body w-6 text-center text-foreground">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-7 h-7 rounded border border-border text-foreground text-sm">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id, item.size)} className="text-muted-foreground hover:text-destructive transition-colors self-start">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-card rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body text-muted-foreground">Subtotal</span>
                  <span className="font-heading text-xl font-bold text-card-foreground">₹{totalPrice().toLocaleString()}</span>
                </div>
                <p className="text-muted-foreground text-xs font-body mb-6">Shipping calculated at checkout</p>
                <Button className="w-full bg-gold hover:bg-gold-dark text-accent-foreground font-body tracking-wider py-6 text-sm">
                  PROCEED TO CHECKOUT
                </Button>
                <button onClick={clearCart} className="w-full text-center text-muted-foreground hover:text-destructive text-xs font-body mt-3 transition-colors">
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
