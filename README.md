# Burqa House E-Commerce Platform

A modern, high-performance e-commerce platform for selling premium burqas, abayas, and hijabs. Built with a React Single Page Application (SPA) frontend and a Laravel PHP backend API.

## 🏗️ Architecture

- **Frontend:** React + TypeScript + Vite + Zustand + Tailwind CSS + shadcn/ui. Built as a Single Page Application.
- **Backend:** Laravel 11.x + SQLite (dev) / MySQL (prod). Acts as a stateless API and serves the production SPA from the `/build/` directory.
- **Authentication:** Laravel Sanctum (token-based + single session enforcement).
- **Testing:** Pest PHP (Feature & Unit Tests).

## ✨ Features Implemented (Phase 1)

- **Authentication System:** Secure registration and login with role-based access (`admin` vs `customer`), password hashing, and session management. Single-session enforcement (re-login revokes old tokens).
- **Product Catalog Management:** Full CRUD operations for products and their variants (size, color, SKU, price, stock). Slugs are generated automatically and safely.
- **Dynamic Search & Filtering:** Product browsing by category, price range, and wildcard-safe search.
- **SPA Routing Integration:** The backend serves the Vite-built React SPA for all non-API routes, ensuring deep linking and routing work seamlessly without 404 errors.
- **Robust Automated Testing:** Over 60+ Pest PHP tests covering authentication flow, middleware protection, product catalog interactions, pagination, and SQL injection prevention.

## 🚀 Getting Started locally

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+ & npm
- Git

### 1. Repository Setup

```bash
git clone https://github.com/farhanaprity59/burqa-house.git
cd burqa-house
```

### 2. Backend Setup

Open a terminal in the `backend/` directory:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
The API and Laravel server will now be running on `http://127.0.0.1:8000`.

### 3. Frontend Setup

Open a separate terminal in the root directory:

```bash
npm install
npm run dev
```
The Vite development server will start on `http://127.0.0.1:8080`. API calls made by the Vite server are proxied automatically to the Laravel backend.

### 4. Running Automated Tests

From the `backend/` directory:
```bash
php artisan test
```

## 📦 Production Build

To build the React SPA for production and inject it into the Laravel application:

```bash
npm run build
```
This command compiles the React assets and places them in `backend/public/build/`.
After building, simply running `php artisan serve` on port 8000 will serve the fully compiled application natively through Laravel.

## 👥 Roles
- **Customer:** Browses catalog, manages cart, places orders.
- **Admin:** Manages products, handles orders, accesses dashboard endpoints. (Must be seeded or manually assigned via database).
