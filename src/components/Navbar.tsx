import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((s) => s.totalItems);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

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

          {/* Auth: User menu or Login link */}
          {isAuthenticated() ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
                className="flex items-center gap-1.5 text-foreground hover:text-gold transition-colors"
                aria-label="Account menu"
              >
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                  <User size={16} className="text-gold" />
                </div>
                <span className="hidden md:inline font-body text-xs tracking-wider">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} className="hidden md:inline" />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card rounded-xl shadow-lg border border-border py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="font-heading text-sm font-semibold text-card-foreground truncate">{user?.name}</p>
                    <p className="font-body text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-muted-foreground hover:text-destructive hover:bg-muted/50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-foreground hover:text-gold transition-colors"
            >
              <User size={20} />
              <span className="hidden md:inline font-body text-xs tracking-wider uppercase">Sign In</span>
            </Link>
          )}
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
            <div className="border-t border-border pt-4">
              {isAuthenticated() ? (
                <>
                  <p className="text-muted-foreground text-xs normal-case tracking-normal mb-3">
                    Signed in as <span className="text-gold">{user?.name}</span>
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-foreground hover:text-destructive transition-colors py-2 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-foreground hover:text-gold transition-colors py-2 block">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="text-gold hover:text-gold-dark transition-colors py-2 block">Create Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
