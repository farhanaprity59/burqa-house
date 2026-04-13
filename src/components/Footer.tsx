import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">
              BURQA <span className="text-gold">HOUSE</span>
            </h3>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed">
              Curating elegant and modest fashion for the modern woman. Quality fabrics, timeless designs.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-lg mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 font-body text-sm">
              <Link to="/products" className="text-primary-foreground/70 hover:text-gold transition-colors">All Products</Link>
              <Link to="/products?category=Premium" className="text-primary-foreground/70 hover:text-gold transition-colors">Premium Collection</Link>
              <Link to="/cart" className="text-primary-foreground/70 hover:text-gold transition-colors">Cart</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg mb-4">Contact</h4>
            <div className="flex flex-col gap-2 font-body text-sm text-primary-foreground/70">
              <p>support@burqahouse.com</p>
              <p>+91 98765 43210</p>
              <p>Mon - Sat, 10AM - 7PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center font-body text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Burqa House. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
