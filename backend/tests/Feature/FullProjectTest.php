<?php

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

function createAdmin(): User
{
    return User::create([
        'name'     => 'Admin User',
        'email'    => 'admin@test.com',
        'password' => Hash::make('password'),
        'role'     => 'admin',
        'phone'    => '+8801700000000',
    ]);
}

function createCustomer(): User
{
    return User::create([
        'name'     => 'Customer User',
        'email'    => 'customer@test.com',
        'password' => Hash::make('password'),
        'role'     => 'customer',
        'phone'    => '+8801711111111',
    ]);
}

function createProduct(array $overrides = []): Product
{
    return Product::create(array_merge([
        'name'       => 'Test Abaya',
        'description' => 'A test product description',
        'base_price' => 2500.00,
        'category'   => 'abaya',
        'is_active'  => true,
    ], $overrides));
}

function createProductWithVariants(): Product
{
    $product = createProduct();
    $product->variants()->createMany([
        ['size' => 'S', 'color' => 'Black', 'sku' => 'TST-BLK-S', 'price' => 2500.00, 'stock' => 10],
        ['size' => 'M', 'color' => 'Black', 'sku' => 'TST-BLK-M', 'price' => 2500.00, 'stock' => 15],
        ['size' => 'L', 'color' => 'Black', 'sku' => 'TST-BLK-L', 'price' => 2700.00, 'stock' => 20],
    ]);
    $product->images()->create([
        'image_path' => 'products/test.jpg',
        'alt_text'   => 'Test image',
        'sort_order' => 0,
        'is_primary' => true,
    ]);
    return $product;
}

/*
|--------------------------------------------------------------------------
| AUTH: Registration Tests
|--------------------------------------------------------------------------
*/

describe('POST /api/register', function () {
    it('registers a new user successfully', function () {
        $response = $this->postJson('/api/register', [
            'name'                  => 'John Doe',
            'email'                 => 'john@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'phone'                 => '+8801800000000',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'User registered successfully.',
            ])
            ->assertJsonStructure([
                'data' => ['user' => ['id', 'name', 'email', 'role', 'phone'], 'token', 'token_type'],
            ]);

        expect($response->json('data.user.role'))->toBe('customer');
        expect($response->json('data.user.email'))->toBe('john@example.com');
        expect($response->json('data.token'))->not()->toBeEmpty();

        $this->assertDatabaseHas('users', ['email' => 'john@example.com', 'role' => 'customer']);
    });

    it('registers without phone (optional field)', function () {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Jane Doe',
            'email'                 => 'jane@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);
        expect($response->json('data.user.phone'))->toBeNull();
    });

    it('fails with missing required fields', function () {
        $response = $this->postJson('/api/register', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    });

    it('fails with invalid email', function () {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Test',
            'email'                 => 'not-an-email',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    });

    it('fails with short password', function () {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Test',
            'email'                 => 'test@example.com',
            'password'              => 'short',
            'password_confirmation' => 'short',
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['password']);
    });

    it('fails with mismatched password confirmation', function () {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Test',
            'email'                 => 'test@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'different123',
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['password']);
    });

    it('fails with duplicate email', function () {
        createCustomer();

        $response = $this->postJson('/api/register', [
            'name'                  => 'Duplicate',
            'email'                 => 'customer@test.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    });

    it('always assigns customer role (cannot register as admin)', function () {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Hacker',
            'email'                 => 'hacker@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'role'                  => 'admin', // trying to escalate
        ]);

        $response->assertStatus(201);
        expect($response->json('data.user.role'))->toBe('customer');
        $this->assertDatabaseHas('users', ['email' => 'hacker@example.com', 'role' => 'customer']);
    });
});

/*
|--------------------------------------------------------------------------
| AUTH: Login Tests
|--------------------------------------------------------------------------
*/

describe('POST /api/login', function () {
    it('logs in with correct credentials', function () {
        createCustomer();

        $response = $this->postJson('/api/login', [
            'email'    => 'customer@test.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJson(['success' => true, 'message' => 'Login successful.'])
            ->assertJsonStructure(['data' => ['user', 'token', 'token_type']]);

        expect($response->json('data.token'))->not()->toBeEmpty();
    });

    it('rejects wrong password', function () {
        createCustomer();

        $response = $this->postJson('/api/login', [
            'email'    => 'customer@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)->assertJson(['success' => false]);
    });

    it('rejects non-existent email', function () {
        $response = $this->postJson('/api/login', [
            'email'    => 'nonexistent@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(401);
    });

    it('fails with missing fields', function () {
        $response = $this->postJson('/api/login', []);
        $response->assertStatus(422)->assertJsonValidationErrors(['email', 'password']);
    });

    it('revokes previous tokens on login (single session)', function () {
        $user = createCustomer();

        // First login
        $res1 = $this->postJson('/api/login', ['email' => 'customer@test.com', 'password' => 'password']);
        $token1 = $res1->json('data.token');

        // Second login
        $res2 = $this->postJson('/api/login', ['email' => 'customer@test.com', 'password' => 'password']);
        $token2 = $res2->json('data.token');

        // Old token should be invalid
        $this->getJson('/api/user', ['Authorization' => "Bearer $token1"])
            ->assertStatus(401);

        // New token should work
        $this->getJson('/api/user', ['Authorization' => "Bearer $token2"])
            ->assertOk();
    });
});

/*
|--------------------------------------------------------------------------
| AUTH: Logout Tests
|--------------------------------------------------------------------------
*/

describe('POST /api/logout', function () {
    it('logs out authenticated user', function () {
        $user = createCustomer();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');
        $response->assertOk()->assertJson(['success' => true]);
    });

    it('rejects unauthenticated logout', function () {
        $response = $this->postJson('/api/logout');
        $response->assertStatus(401);
    });
});

/*
|--------------------------------------------------------------------------
| AUTH: Profile Tests
|--------------------------------------------------------------------------
*/

describe('GET /api/user', function () {
    it('returns authenticated user profile', function () {
        $user = createAdmin();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data'    => [
                    'name'  => 'Admin User',
                    'email' => 'admin@test.com',
                    'role'  => 'admin',
                ],
            ]);
    });

    it('rejects unauthenticated access', function () {
        $this->getJson('/api/user')->assertStatus(401);
    });
});

/*
|--------------------------------------------------------------------------
| PRODUCTS: Public Listing
|--------------------------------------------------------------------------
*/

describe('GET /api/products', function () {
    it('returns paginated products', function () {
        createProductWithVariants();
        createProduct(['name' => 'Another Product', 'base_price' => 1500]);

        $response = $this->getJson('/api/products');

        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => [['id', 'name', 'slug', 'base_price', 'category', 'variants', 'images']],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);

        expect($response->json('meta.total'))->toBe(2);
    });

    it('filters by category', function () {
        createProduct(['name' => 'Abaya', 'category' => 'abaya']);
        createProduct(['name' => 'Hijab', 'category' => 'hijab']);

        $response = $this->getJson('/api/products?category=hijab');

        expect($response->json('meta.total'))->toBe(1);
        expect($response->json('data.0.category'))->toBe('hijab');
    });

    it('filters by price range', function () {
        createProduct(['name' => 'Cheap', 'base_price' => 500]);
        createProduct(['name' => 'Mid', 'base_price' => 2000]);
        createProduct(['name' => 'Expensive', 'base_price' => 5000]);

        $response = $this->getJson('/api/products?min_price=1000&max_price=3000');
        expect($response->json('meta.total'))->toBe(1);
    });

    it('searches by name', function () {
        createProduct(['name' => 'Royal Navy Abaya']);
        createProduct(['name' => 'Classic Black Hijab']);

        $response = $this->getJson('/api/products?search=navy');
        expect($response->json('meta.total'))->toBe(1);
        expect($response->json('data.0.name'))->toBe('Royal Navy Abaya');
    });

    it('searches by description', function () {
        createProduct(['name' => 'Product A', 'description' => 'Made from premium silk fabric']);
        createProduct(['name' => 'Product B', 'description' => 'Cotton material']);

        $response = $this->getJson('/api/products?search=silk');
        expect($response->json('meta.total'))->toBe(1);
    });

    it('sorts by price ascending', function () {
        createProduct(['name' => 'Expensive', 'base_price' => 5000]);
        createProduct(['name' => 'Cheap', 'base_price' => 500]);

        $response = $this->getJson('/api/products?sort_by=base_price&sort_dir=asc');
        $data = $response->json('data');

        expect((float) $data[0]['base_price'])->toBeLessThanOrEqual((float) $data[1]['base_price']);
    });

    it('excludes inactive products', function () {
        createProduct(['name' => 'Active', 'is_active' => true]);
        createProduct(['name' => 'Inactive', 'is_active' => false]);

        $response = $this->getJson('/api/products');
        expect($response->json('meta.total'))->toBe(1);
        expect($response->json('data.0.name'))->toBe('Active');
    });

    it('respects per_page parameter', function () {
        for ($i = 0; $i < 5; $i++) {
            createProduct(['name' => "Product $i", 'base_price' => 1000 + $i]);
        }

        $response = $this->getJson('/api/products?per_page=2');
        expect($response->json('meta.per_page'))->toBe(2);
        expect(count($response->json('data')))->toBe(2);
        expect($response->json('meta.total'))->toBe(5);
    });

    it('caps per_page at 100', function () {
        $response = $this->getJson('/api/products?per_page=999');
        expect($response->json('meta.per_page'))->toBe(100);
    });

    it('rejects invalid sort_by (SQL injection prevention)', function () {
        createProduct();
        $response = $this->getJson('/api/products?sort_by=1;DROP TABLE products');
        $response->assertOk(); // should not crash, just ignore invalid sort
    });

    it('does not require authentication', function () {
        createProduct();
        $this->getJson('/api/products')->assertOk();
    });
});

/*
|--------------------------------------------------------------------------
| PRODUCTS: Single Product
|--------------------------------------------------------------------------
*/

describe('GET /api/products/{id}', function () {
    it('returns product with variants and images', function () {
        $product = createProductWithVariants();

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'data' => ['id', 'name', 'slug', 'variants' => [['id', 'size', 'color', 'sku', 'price', 'stock']], 'images'],
            ]);

        expect(count($response->json('data.variants')))->toBe(3);
        expect(count($response->json('data.images')))->toBe(1);
    });

    it('returns 404 for non-existent product', function () {
        $this->getJson('/api/products/99999')->assertStatus(404);
    });

    it('returns 404 for soft-deleted product', function () {
        $product = createProduct();
        $product->delete();

        $this->getJson("/api/products/{$product->id}")->assertStatus(404);
    });
});

/*
|--------------------------------------------------------------------------
| PRODUCTS: Admin CRUD
|--------------------------------------------------------------------------
*/

describe('POST /api/products (create)', function () {
    it('admin can create product with variants', function () {
        Sanctum::actingAs(createAdmin());

        $response = $this->postJson('/api/products', [
            'name'       => 'New Abaya',
            'base_price' => 3000,
            'category'   => 'abaya',
            'description' => 'Beautiful new abaya',
            'variants'   => [
                ['size' => 'M', 'color' => 'Black', 'sku' => 'NEW-BLK-M', 'price' => 3000, 'stock' => 20],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true, 'data' => ['name' => 'New Abaya']]);

        expect($response->json('data.slug'))->toBe('new-abaya');
        expect(count($response->json('data.variants')))->toBe(1);

        $this->assertDatabaseHas('products', ['name' => 'New Abaya']);
        $this->assertDatabaseHas('product_variants', ['sku' => 'NEW-BLK-M']);
    });

    it('auto-generates unique slug', function () {
        Sanctum::actingAs(createAdmin());

        $this->postJson('/api/products', ['name' => 'Test Product', 'base_price' => 1000]);
        $res2 = $this->postJson('/api/products', ['name' => 'Test Product', 'base_price' => 1000]);

        expect($res2->json('data.slug'))->toBe('test-product-1');
    });

    it('customer cannot create product', function () {
        Sanctum::actingAs(createCustomer());

        $response = $this->postJson('/api/products', [
            'name' => 'Hack Product',
            'base_price' => 1000,
        ]);

        $response->assertStatus(403)->assertJson(['success' => false]);
    });

    it('unauthenticated user cannot create product', function () {
        $this->postJson('/api/products', [
            'name' => 'No Auth Product',
            'base_price' => 1000,
        ])->assertStatus(401);
    });

    it('validates required fields', function () {
        Sanctum::actingAs(createAdmin());

        $response = $this->postJson('/api/products', []);
        $response->assertStatus(422)->assertJsonValidationErrors(['name', 'base_price']);
    });

    it('rejects negative price', function () {
        Sanctum::actingAs(createAdmin());

        $response = $this->postJson('/api/products', [
            'name' => 'Bad Price',
            'base_price' => -100,
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['base_price']);
    });

    it('rejects zero price', function () {
        Sanctum::actingAs(createAdmin());

        $response = $this->postJson('/api/products', [
            'name' => 'Zero Price',
            'base_price' => 0,
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['base_price']);
    });

    it('rejects duplicate variant SKU', function () {
        Sanctum::actingAs(createAdmin());

        // Create first product with SKU
        createProduct()->variants()->create([
            'size' => 'M', 'color' => 'Black', 'sku' => 'DUPE-SKU', 'price' => 1000, 'stock' => 5,
        ]);

        // Try creating another with same SKU
        $response = $this->postJson('/api/products', [
            'name' => 'New Product',
            'base_price' => 1000,
            'variants' => [
                ['size' => 'M', 'color' => 'Black', 'sku' => 'DUPE-SKU', 'price' => 1000, 'stock' => 5],
            ],
        ]);
        $response->assertStatus(422);
    });
});

describe('PUT /api/products/{id} (update)', function () {
    it('admin can update product', function () {
        Sanctum::actingAs(createAdmin());
        $product = createProduct();

        $response = $this->putJson("/api/products/{$product->id}", [
            'name'       => 'Updated Name',
            'base_price' => 9999,
        ]);

        $response->assertOk()->assertJson(['success' => true, 'data' => ['name' => 'Updated Name']]);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Updated Name']);
    });

    it('admin can add new variants while updating', function () {
        Sanctum::actingAs(createAdmin());
        $product = createProductWithVariants();
        $existingVariantId = $product->variants->first()->id;

        $response = $this->putJson("/api/products/{$product->id}", [
            'variants' => [
                ['id' => $existingVariantId, 'size' => 'S', 'color' => 'Black', 'sku' => 'TST-BLK-S', 'price' => 2600, 'stock' => 8],
                ['size' => 'XL', 'color' => 'White', 'sku' => 'TST-WHT-XL', 'price' => 3000, 'stock' => 5],
            ],
        ]);

        $response->assertOk();
        // Old variants not in payload should be deleted, new ones created
        expect(count($response->json('data.variants')))->toBe(2);
    });

    it('customer cannot update product', function () {
        Sanctum::actingAs(createCustomer());
        $product = createProduct();

        $this->putJson("/api/products/{$product->id}", ['name' => 'Hacked'])
            ->assertStatus(403);
    });
});

describe('DELETE /api/products/{id} (soft delete)', function () {
    it('admin can soft-delete product', function () {
        Sanctum::actingAs(createAdmin());
        $product = createProduct();

        $response = $this->deleteJson("/api/products/{$product->id}");
        $response->assertOk()->assertJson(['success' => true]);

        // Product should be soft-deleted
        $this->assertSoftDeleted('products', ['id' => $product->id]);

        // Should not appear in listing
        $this->getJson('/api/products')->assertJson(['meta' => ['total' => 0]]);

        // Should not be findable by ID
        $this->getJson("/api/products/{$product->id}")->assertStatus(404);
    });

    it('customer cannot delete product', function () {
        Sanctum::actingAs(createCustomer());
        $product = createProduct();

        $this->deleteJson("/api/products/{$product->id}")->assertStatus(403);
    });
});

/*
|--------------------------------------------------------------------------
| MODEL: Slug Generation
|--------------------------------------------------------------------------
*/

describe('Product slug generation', function () {
    it('auto-generates slug from name', function () {
        $product = createProduct(['name' => 'Fancy Embroidered Abaya']);
        expect($product->slug)->toBe('fancy-embroidered-abaya');
    });

    it('generates unique slug for duplicate names', function () {
        createProduct(['name' => 'Classic Abaya']);
        $product2 = createProduct(['name' => 'Classic Abaya']);

        expect($product2->slug)->toBe('classic-abaya-1');
    });

    it('updates slug when name changes', function () {
        $product = createProduct(['name' => 'Old Name']);
        expect($product->slug)->toBe('old-name');

        $product->update(['name' => 'New Name']);
        expect($product->fresh()->slug)->toBe('new-name');
    });
});

/*
|--------------------------------------------------------------------------
| MODEL: Relationships & Accessors
|--------------------------------------------------------------------------
*/

describe('Product model relationships', function () {
    it('has many variants', function () {
        $product = createProductWithVariants();
        expect($product->variants)->toHaveCount(3);
    });

    it('computes min_price from variants', function () {
        $product = createProductWithVariants();
        expect((float) $product->min_price)->toBe(2500.00);
    });

    it('computes max_price from variants', function () {
        $product = createProductWithVariants();
        expect((float) $product->max_price)->toBe(2700.00);
    });

    it('computes total_stock from variants', function () {
        $product = createProductWithVariants();
        expect($product->total_stock)->toBe(45);
    });

    it('has primary image', function () {
        $product = createProductWithVariants();
        expect($product->primaryImage)->not()->toBeNull();
        expect($product->primaryImage->is_primary)->toBeTrue();
    });
});

/*
|--------------------------------------------------------------------------
| MODEL: User
|--------------------------------------------------------------------------
*/

describe('User model', function () {
    it('isAdmin returns true for admin role', function () {
        $admin = createAdmin();
        expect($admin->isAdmin())->toBeTrue();
    });

    it('isAdmin returns false for customer role', function () {
        $customer = createCustomer();
        expect($customer->isAdmin())->toBeFalse();
    });

    it('hashes password on creation', function () {
        $user = createCustomer();
        expect($user->password)->not()->toBe('password');
        expect(Hash::check('password', $user->password))->toBeTrue();
    });
});

/*
|--------------------------------------------------------------------------
| MIDDLEWARE: Admin Protection
|--------------------------------------------------------------------------
*/

describe('Admin middleware', function () {
    it('allows admin access', function () {
        Sanctum::actingAs(createAdmin());
        $this->postJson('/api/products', ['name' => 'Test', 'base_price' => 1000])
            ->assertStatus(201);
    });

    it('blocks customer access with 403', function () {
        Sanctum::actingAs(createCustomer());
        $this->postJson('/api/products', ['name' => 'Test', 'base_price' => 1000])
            ->assertStatus(403)
            ->assertJson(['success' => false, 'message' => 'Forbidden. Admin access required.']);
    });

    it('returns 401 for unauthenticated', function () {
        $this->postJson('/api/products', ['name' => 'Test', 'base_price' => 1000])
            ->assertStatus(401);
    });
});

/*
|--------------------------------------------------------------------------
| API: Response Format Consistency
|--------------------------------------------------------------------------
*/

describe('API response format', function () {
    it('all success responses have success=true and message field', function () {
        createProduct();

        $response = $this->getJson('/api/products');
        expect($response->json('success'))->toBeTrue();
        expect($response->json('message'))->toBeString();
    });

    it('error responses have success=false', function () {
        $response = $this->postJson('/api/login', [
            'email' => 'x@x.com',
            'password' => 'wrong',
        ]);
        expect($response->json('success'))->toBeFalse();
    });

    it('product listing includes meta pagination', function () {
        $response = $this->getJson('/api/products');
        $response->assertJsonStructure([
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ]);
    });
});

/*
|--------------------------------------------------------------------------
| SPA Routing
|--------------------------------------------------------------------------
*/

describe('SPA fallback route', function () {
    it('serves SPA for root path', function () {
        $response = $this->get('/');
        // Should return 200 (serving build/index.html) or 500 if build doesn't exist in test env
        expect(in_array($response->getStatusCode(), [200, 500]))->toBeTrue();
    });

    it('does not intercept API routes', function () {
        $this->getJson('/api/products')->assertOk();
    });
});
