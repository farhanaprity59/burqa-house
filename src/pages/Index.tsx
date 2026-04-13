import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';

const Index = () => {
  const featured = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroBanner}
          alt="Burqa House - Elegant modest fashion"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">Modest Fashion Redefined</p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Elegance in Every<br />
            <span className="text-gradient-gold">Thread</span>
          </h1>
          <p className="font-body text-primary-foreground/80 text-base md:text-lg mb-8 max-w-md mx-auto">
            Discover our handcrafted collection of premium burqas and abayas
          </p>
          <Link to="/products">
            <Button className="bg-gold hover:bg-gold-dark text-accent-foreground font-body tracking-wider px-8 py-6 text-sm">
              EXPLORE COLLECTION <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-2">Handpicked for You</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Featured Collection</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">Premium Quality</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Crafted With Care</h2>
          <p className="font-body text-primary-foreground/70 max-w-lg mx-auto mb-8">
            Every piece in our collection is meticulously crafted using the finest fabrics, ensuring comfort, durability, and timeless elegance.
          </p>
          <Link to="/products?category=Premium">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-accent-foreground font-body tracking-wider px-8 py-6 text-sm">
              VIEW PREMIUM RANGE
            </Button>
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-2">Just In</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">New Arrivals</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/products">
            <Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background font-body tracking-wider px-8 py-6 text-sm">
              VIEW ALL PRODUCTS <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
