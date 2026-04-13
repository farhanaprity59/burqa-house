<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed sample products with variants and images.
     */
    public function run(): void
    {
        $products = [
            [
                'name'        => 'Classic Black Abaya',
                'description' => 'A timeless black abaya crafted from premium crepe fabric with elegant embroidery along the sleeves and hemline. Perfect for daily wear and special occasions.',
                'base_price'  => 2500.00,
                'category'    => 'abaya',
                'variants'    => [
                    ['size' => 'S', 'color' => 'Black', 'sku' => 'ABA-BLK-S', 'price' => 2500.00, 'stock' => 25],
                    ['size' => 'M', 'color' => 'Black', 'sku' => 'ABA-BLK-M', 'price' => 2500.00, 'stock' => 30],
                    ['size' => 'L', 'color' => 'Black', 'sku' => 'ABA-BLK-L', 'price' => 2500.00, 'stock' => 20],
                    ['size' => 'XL', 'color' => 'Black', 'sku' => 'ABA-BLK-XL', 'price' => 2700.00, 'stock' => 15],
                ],
            ],
            [
                'name'        => 'Embroidered Navy Abaya',
                'description' => 'Luxurious navy blue abaya with intricate gold thread embroidery. Made from soft chiffon fabric with a flowing silhouette.',
                'base_price'  => 3200.00,
                'category'    => 'abaya',
                'variants'    => [
                    ['size' => 'S', 'color' => 'Navy', 'sku' => 'ABA-NVY-S', 'price' => 3200.00, 'stock' => 15],
                    ['size' => 'M', 'color' => 'Navy', 'sku' => 'ABA-NVY-M', 'price' => 3200.00, 'stock' => 20],
                    ['size' => 'L', 'color' => 'Navy', 'sku' => 'ABA-NVY-L', 'price' => 3200.00, 'stock' => 18],
                ],
            ],
            [
                'name'        => 'Premium Silk Niqab',
                'description' => 'High-quality silk niqab with adjustable tie-back and comfortable fit. Breathable fabric ideal for everyday use.',
                'base_price'  => 450.00,
                'category'    => 'niqab',
                'variants'    => [
                    ['size' => 'One Size', 'color' => 'Black', 'sku' => 'NIQ-SLK-BLK', 'price' => 450.00, 'stock' => 50],
                    ['size' => 'One Size', 'color' => 'Navy', 'sku' => 'NIQ-SLK-NVY', 'price' => 450.00, 'stock' => 35],
                    ['size' => 'One Size', 'color' => 'Brown', 'sku' => 'NIQ-SLK-BRN', 'price' => 450.00, 'stock' => 30],
                ],
            ],
            [
                'name'        => 'Chiffon Layered Niqab',
                'description' => 'Double-layered chiffon niqab with elegant draping. Lightweight and comfortable for extended wear.',
                'base_price'  => 350.00,
                'category'    => 'niqab',
                'variants'    => [
                    ['size' => 'One Size', 'color' => 'Black', 'sku' => 'NIQ-CHF-BLK', 'price' => 350.00, 'stock' => 60],
                    ['size' => 'One Size', 'color' => 'Dark Grey', 'sku' => 'NIQ-CHF-GRY', 'price' => 350.00, 'stock' => 40],
                ],
            ],
            [
                'name'        => 'Cotton Jersey Hijab',
                'description' => 'Soft cotton jersey hijab with excellent stretch and recovery. Available in multiple colors to match any outfit.',
                'base_price'  => 280.00,
                'category'    => 'hijab',
                'variants'    => [
                    ['size' => 'One Size', 'color' => 'Black', 'sku' => 'HIJ-CTN-BLK', 'price' => 280.00, 'stock' => 100],
                    ['size' => 'One Size', 'color' => 'White', 'sku' => 'HIJ-CTN-WHT', 'price' => 280.00, 'stock' => 80],
                    ['size' => 'One Size', 'color' => 'Dusty Pink', 'sku' => 'HIJ-CTN-PNK', 'price' => 280.00, 'stock' => 60],
                    ['size' => 'One Size', 'color' => 'Olive Green', 'sku' => 'HIJ-CTN-OLV', 'price' => 280.00, 'stock' => 45],
                    ['size' => 'One Size', 'color' => 'Burgundy', 'sku' => 'HIJ-CTN-BRG', 'price' => 280.00, 'stock' => 55],
                ],
            ],
            [
                'name'        => 'Premium Chiffon Hijab',
                'description' => 'Elegant chiffon hijab with a subtle shimmer finish. Lightweight and drapes beautifully.',
                'base_price'  => 380.00,
                'category'    => 'hijab',
                'variants'    => [
                    ['size' => 'One Size', 'color' => 'Champagne', 'sku' => 'HIJ-CHF-CHP', 'price' => 380.00, 'stock' => 40],
                    ['size' => 'One Size', 'color' => 'Sage', 'sku' => 'HIJ-CHF-SAG', 'price' => 380.00, 'stock' => 35],
                    ['size' => 'One Size', 'color' => 'Mauve', 'sku' => 'HIJ-CHF-MAV', 'price' => 380.00, 'stock' => 30],
                ],
            ],
            [
                'name'        => 'Overhead Khimar',
                'description' => 'Single-piece overhead khimar in flowing jersey fabric. Easy to wear with no pins required.',
                'base_price'  => 800.00,
                'category'    => 'khimar',
                'variants'    => [
                    ['size' => 'S', 'color' => 'Black', 'sku' => 'KHI-OVR-BLK-S', 'price' => 800.00, 'stock' => 20],
                    ['size' => 'M', 'color' => 'Black', 'sku' => 'KHI-OVR-BLK-M', 'price' => 800.00, 'stock' => 25],
                    ['size' => 'L', 'color' => 'Black', 'sku' => 'KHI-OVR-BLK-L', 'price' => 850.00, 'stock' => 20],
                    ['size' => 'M', 'color' => 'Dark Blue', 'sku' => 'KHI-OVR-BLU-M', 'price' => 800.00, 'stock' => 15],
                ],
            ],
            [
                'name'        => 'Butterfly Khimar',
                'description' => 'Elegant butterfly-style khimar with wide wingspan design. Made from premium nida fabric.',
                'base_price'  => 950.00,
                'category'    => 'khimar',
                'variants'    => [
                    ['size' => 'One Size', 'color' => 'Black', 'sku' => 'KHI-BTF-BLK', 'price' => 950.00, 'stock' => 30],
                    ['size' => 'One Size', 'color' => 'Dark Brown', 'sku' => 'KHI-BTF-BRN', 'price' => 950.00, 'stock' => 20],
                ],
            ],
            [
                'name'        => 'Two-Piece Jilbab Set',
                'description' => 'Complete two-piece jilbab set including overhead top and matching skirt. Made from wrinkle-free nida fabric.',
                'base_price'  => 1800.00,
                'category'    => 'jilbab',
                'variants'    => [
                    ['size' => 'S', 'color' => 'Black', 'sku' => 'JIL-2PC-BLK-S', 'price' => 1800.00, 'stock' => 15],
                    ['size' => 'M', 'color' => 'Black', 'sku' => 'JIL-2PC-BLK-M', 'price' => 1800.00, 'stock' => 20],
                    ['size' => 'L', 'color' => 'Black', 'sku' => 'JIL-2PC-BLK-L', 'price' => 1800.00, 'stock' => 18],
                    ['size' => 'XL', 'color' => 'Black', 'sku' => 'JIL-2PC-BLK-XL', 'price' => 1950.00, 'stock' => 10],
                ],
            ],
            [
                'name'        => 'French Jilbab',
                'description' => 'Stylish French-cut jilbab with modern tailoring. Features a fitted bodice with a flared skirt for graceful movement.',
                'base_price'  => 2200.00,
                'category'    => 'jilbab',
                'variants'    => [
                    ['size' => 'S', 'color' => 'Black', 'sku' => 'JIL-FRN-BLK-S', 'price' => 2200.00, 'stock' => 12],
                    ['size' => 'M', 'color' => 'Black', 'sku' => 'JIL-FRN-BLK-M', 'price' => 2200.00, 'stock' => 18],
                    ['size' => 'L', 'color' => 'Black', 'sku' => 'JIL-FRN-BLK-L', 'price' => 2200.00, 'stock' => 14],
                    ['size' => 'M', 'color' => 'Plum', 'sku' => 'JIL-FRN-PLM-M', 'price' => 2200.00, 'stock' => 10],
                ],
            ],
            [
                'name'        => 'Lace Trim Abaya',
                'description' => 'Sophisticated abaya with delicate lace trim along the front opening and cuffs. Made from premium Korean nida.',
                'base_price'  => 3500.00,
                'category'    => 'abaya',
                'variants'    => [
                    ['size' => 'S', 'color' => 'Black', 'sku' => 'ABA-LCE-BLK-S', 'price' => 3500.00, 'stock' => 10],
                    ['size' => 'M', 'color' => 'Black', 'sku' => 'ABA-LCE-BLK-M', 'price' => 3500.00, 'stock' => 15],
                    ['size' => 'L', 'color' => 'Black', 'sku' => 'ABA-LCE-BLK-L', 'price' => 3500.00, 'stock' => 12],
                ],
            ],
            [
                'name'        => 'Half Niqab with Nose String',
                'description' => 'Practical half niqab with adjustable nose string for a secure and comfortable fit. Made from breathable georgette.',
                'base_price'  => 250.00,
                'category'    => 'niqab',
                'variants'    => [
                    ['size' => 'One Size', 'color' => 'Black', 'sku' => 'NIQ-HLF-BLK', 'price' => 250.00, 'stock' => 70],
                    ['size' => 'One Size', 'color' => 'Dark Grey', 'sku' => 'NIQ-HLF-GRY', 'price' => 250.00, 'stock' => 45],
                ],
            ],
        ];

        foreach ($products as $productData) {
            $variants = $productData['variants'];
            unset($productData['variants']);

            $product = Product::create($productData);

            foreach ($variants as $variant) {
                $product->variants()->create($variant);
            }

            // Create a placeholder primary image
            $product->images()->create([
                'image_path' => 'products/' . $product->slug . '.jpg',
                'alt_text'   => $product->name,
                'sort_order' => 0,
                'is_primary' => true,
            ]);
        }
    }
}
