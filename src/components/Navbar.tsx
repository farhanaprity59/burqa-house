import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        {/* Mobile menu */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="font-heading text-xl md:text-2xl font-bold tracking-wide">
          <span className="text-foreground">BURQA</span>
          <span className="text-gold"> HOUSE</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-wider uppercase">
          <Link to="/" className="text-foreground hover:text-gold transition-colors">Home</Link>
          <Link to="/products" className="text-foreground hover:text-gold transition-colors">Collection</Link>
          <Link to="/products?category=Premium" className="text-foreground hover:text-gold transition-colors">Premium</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="text-foreground hover:text-gold transition-colors">
            <Search size={20} />
          </button>
          <Link to="/cart" className="relative text-foreground hover:text-gold transition-colors">
            <ShoppingBag size={20} />
            {totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {totalItems()}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="bg-card border-t border-border px-4 py-3 animate-fade-in">
          <div className="container mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search burqa (e.g., black chiffon burqa)"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-body text-sm"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="flex flex-col py-4 px-6 gap-4 font-body text-sm tracking-wider uppercase">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-gold transition-colors py-2">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-gold transition-colors py-2">Collection</Link>
            <Link to="/products?category=Premium" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-gold transition-colors py-2">Premium</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
