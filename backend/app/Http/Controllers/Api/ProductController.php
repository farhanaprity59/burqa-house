<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * List products with pagination, filtering, and sorting.
     *
     * GET /api/products
     * Query params: category, min_price, max_price, search, sort_by, sort_dir, per_page
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['variants', 'images', 'primaryImage'])->active();

        // Filter by category
        if ($request->filled('category')) {
            $query->byCategory($request->input('category'));
        }

        // Filter by price range (base_price)
        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', $request->input('max_price'));
        }

        // Search by name or description (sanitize wildcards to prevent DoS)
        if ($request->filled('search')) {
            $search = substr($request->input('search'), 0, 100);
            $search = str_replace(['%', '_'], ['\%', '\_'], $search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        $allowedSorts = ['name', 'base_price', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        // Pagination
        $perPage = min((int) $request->input('per_page', 15), 100);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Products retrieved successfully.',
            'data'    => ProductResource::collection($products),
            'meta'    => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
            ],
        ]);
    }

    /**
     * Show a single product with variants and images.
     *
     * GET /api/products/{product}
     */
    public function show(Product $product): JsonResponse
    {
        // Ensure inactive products are not publicly accessible
        if (!$product->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }

        $product->load(['variants', 'images', 'primaryImage']);

        return response()->json([
            'success' => true,
            'message' => 'Product retrieved successfully.',
            'data'    => new ProductResource($product),
        ]);
    }

    /**
     * Create a new product with optional variants.
     *
     * POST /api/products
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $product = DB::transaction(function () use ($validated) {
            $product = Product::create([
                'name'        => $validated['name'],
                'description' => $validated['description'] ?? null,
                'base_price'  => $validated['base_price'],
                'category'    => $validated['category'] ?? null,
                'is_active'   => $validated['is_active'] ?? true,
            ]);

            // Create variants if provided
            if (!empty($validated['variants'])) {
                foreach ($validated['variants'] as $variantData) {
                    $product->variants()->create($variantData);
                }
            }

            return $product;
        });

        $product->load(['variants', 'images']);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data'    => new ProductResource($product),
        ], 201);
    }

    /**
     * Update an existing product and its variants.
     *
     * PUT /api/products/{product}
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($product, $validated) {
            // Update product fields
            $product->update(collect($validated)->except('variants')->toArray());

            // Update variants if provided
            if (isset($validated['variants'])) {
                $existingVariantIds = [];

                foreach ($validated['variants'] as $variantData) {
                    if (!empty($variantData['id'])) {
                        // Update existing variant
                        $variant = $product->variants()->find($variantData['id']);
                        if ($variant) {
                            $variant->update($variantData);
                            $existingVariantIds[] = $variant->id;
                        }
                    } else {
                        // Create new variant
                        $newVariant = $product->variants()->create($variantData);
                        $existingVariantIds[] = $newVariant->id;
                    }
                }

                // Remove variants not in the update payload
                $product->variants()
                    ->whereNotIn('id', $existingVariantIds)
                    ->delete();
            }
        });

        $product->load(['variants', 'images']);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'data'    => new ProductResource($product),
        ]);
    }

    /**
     * Soft delete a product.
     *
     * DELETE /api/products/{product}
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }
}
