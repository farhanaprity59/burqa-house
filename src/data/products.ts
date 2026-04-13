import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import product5 from '@/assets/product-5.jpg';
import product6 from '@/assets/product-6.jpg';
import product7 from '@/assets/product-7.jpg';
import product8 from '@/assets/product-8.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes: string[];
  fabric: string;
  color: string;
  description: string;
  category: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1", name: "Classic Black Chiffon Burqa", price: 2499, originalPrice: 3299,
    image: product1, sizes: ["S", "M", "L", "XL"], fabric: "Chiffon", color: "Black",
    description: "Elegant classic black chiffon burqa with delicate embroidery along the sleeves and hemline. Lightweight and breathable, perfect for everyday wear.",
    category: "Chiffon", inStock: true,
  },
  {
    id: "2", name: "Royal Navy Nida Burqa", price: 2999,
    image: product2, sizes: ["M", "L", "XL", "XXL"], fabric: "Nida", color: "Navy",
    description: "Premium navy nida fabric burqa with intricate gold threadwork. Flowing silhouette with a comfortable fit.",
    category: "Nida", inStock: true,
  },
  {
    id: "3", name: "Embroidered Crepe Abaya", price: 3499, originalPrice: 4199,
    image: product3, sizes: ["S", "M", "L"], fabric: "Crepe", color: "Black",
    description: "Luxurious crepe abaya with hand-embroidered floral patterns. Features bell sleeves and a flattering A-line cut.",
    category: "Crepe", inStock: true,
  },
  {
    id: "4", name: "Pearl White Georgette Burqa", price: 3999,
    image: product4, sizes: ["S", "M", "L", "XL"], fabric: "Georgette", color: "White",
    description: "Stunning pearl white georgette burqa with pearl detailing. Ideal for special occasions and celebrations.",
    category: "Georgette", inStock: true,
  },
  {
    id: "5", name: "Olive Green Linen Abaya", price: 2799,
    image: product5, sizes: ["M", "L", "XL"], fabric: "Linen", color: "Olive",
    description: "Modern olive green linen abaya with clean lines and minimalist design. Perfect for a contemporary look.",
    category: "Linen", inStock: true,
  },
  {
    id: "6", name: "Maroon Silk Blend Burqa", price: 4499, originalPrice: 5299,
    image: product6, sizes: ["S", "M", "L", "XL", "XXL"], fabric: "Silk Blend", color: "Maroon",
    description: "Rich maroon silk blend burqa with gold zari work. A statement piece for weddings and formal gatherings.",
    category: "Silk", inStock: true,
  },
  {
    id: "7", name: "Dusty Rose Nida Abaya", price: 2699,
    image: product7, sizes: ["S", "M", "L"], fabric: "Nida", color: "Dusty Rose",
    description: "Soft dusty rose nida abaya with lace trim details. A feminine and graceful choice for daily wear.",
    category: "Nida", inStock: true,
  },
  {
    id: "8", name: "Jet Black Premium Abaya", price: 5999,
    image: product8, sizes: ["S", "M", "L", "XL"], fabric: "Premium Nida", color: "Black",
    description: "Our signature premium abaya crafted from the finest nida fabric. Features Swarovski crystal embellishments and a regal flowing design.",
    category: "Premium", inStock: true,
  },
];

export const categories = ["All", "Chiffon", "Nida", "Crepe", "Georgette", "Linen", "Silk", "Premium"];
