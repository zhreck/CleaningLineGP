# API Usage Examples - Pagination

This document provides practical examples for using the paginated products API in various scenarios and programming languages.

## Interactive API Documentation

Once the server is running, you can access the interactive Swagger documentation at:

**URL:** `http://localhost:3001/api/docs`

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Parameter validation
- Schema documentation
- Try-it-out functionality

## Quick Reference

### Endpoint
```
GET /api/products/paginated
```

### Parameters
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 20, max 100
- `search` (optional): Search term for product names
- `categoryId` (optional): Filter by category ID

## Frontend Integration Examples

### React with TypeScript

```typescript
// types.ts
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  lastPage: number;
  hasMore: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

// api.ts
const API_BASE = 'http://localhost:3001/api';

export async function fetchPaginatedProducts(
  page = 1,
  limit = 20,
  filters?: { search?: string; categoryId?: number }
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.categoryId) {
    params.append('categoryId', filters.categoryId.toString());
  }

  const response = await fetch(`${API_BASE}/products/paginated?${params}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// ProductList.tsx
import React, { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');

  const loadProducts = async (pageNum: number, searchTerm = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchPaginatedProducts(
        pageNum,
        20,
        searchTerm ? { search: searchTerm } : undefined
      );
      
      if (pageNum === 1) {
        setProducts(response.items);
      } else {
        setProducts(prev => [...prev, ...response.items]);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1, search);
  }, [search]);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setProducts([]);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadProducts(page + 1, search);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {error && <div className="error">Error: {error}</div>}
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            {product.category && <span>{product.category.name}</span>}
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Vue.js 3 with Composition API

```vue
<template>
  <div>
    <input
      v-model="searchTerm"
      @input="handleSearch"
      placeholder="Search products..."
      class="search-input"
    />
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div class="products-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <h3>{{ product.name }}</h3>
        <p>${{ product.price }}</p>
        <span v-if="product.category">{{ product.category.name }}</span>
      </div>
    </div>
    
    <button
      v-if="hasMore"
      @click="loadMore"
      :disabled="loading"
      class="load-more-btn"
    >
      {{ loading ? 'Loading...' : 'Load More' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Product {
  id: number;
  name: string;
  price: number;
  category?: { id: number; name: string; slug: string };
}

const products = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const page = ref(1);
const hasMore = ref(true);
const searchTerm = ref('');

const fetchProducts = async (pageNum: number, search?: string) => {
  loading.value = true;
  error.value = null;
  
  try {
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: '20',
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await fetch(
      `http://localhost:3001/api/products/paginated?${params}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (pageNum === 1) {
      products.value = data.items;
    } else {
      products.value.push(...data.items);
    }
    
    hasMore.value = data.hasMore;
    page.value = pageNum;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load products';
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  products.value = [];
  page.value = 1;
  fetchProducts(1, searchTerm.value);
};

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    fetchProducts(page.value + 1, searchTerm.value);
  }
};

onMounted(() => {
  fetchProducts(1);
});
</script>
```

### Angular Service and Component

```typescript
// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  lastPage: number;
  hasMore: boolean;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category?: { id: number; name: string; slug: string };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  getPaginatedProducts(
    page = 1,
    limit = 20,
    search?: string,
    categoryId?: number
  ): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiUrl}/products/paginated`,
      { params }
    );
  }
}

// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <input
        [(ngModel)]="searchTerm"
        (input)="onSearch()"
        placeholder="Search products..."
      />
      
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div class="products-grid">
        <div *ngFor="let product of products" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>\${{ product.price }}</p>
          <span *ngIf="product.category">{{ product.category.name }}</span>
        </div>
      </div>
      
      <button
        *ngIf="hasMore"
        (click)="loadMore()"
        [disabled]="loading"
      >
        {{ loading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  page = 1;
  hasMore = true;
  searchTerm = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts(1);
  }

  loadProducts(pageNum: number, search?: string) {
    this.loading = true;
    this.error = null;

    this.productService.getPaginatedProducts(pageNum, 20, search)
      .subscribe({
        next: (response) => {
          if (pageNum === 1) {
            this.products = response.items;
          } else {
            this.products.push(...response.items);
          }
          this.hasMore = response.hasMore;
          this.page = pageNum;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products';
          this.loading = false;
        }
      });
  }

  onSearch() {
    this.products = [];
    this.page = 1;
    this.loadProducts(1, this.searchTerm);
  }

  loadMore() {
    if (!this.loading && this.hasMore) {
      this.loadProducts(this.page + 1, this.searchTerm);
    }
  }
}
```

## Backend Integration Examples

### Node.js with Axios

```javascript
const axios = require('axios');

class ProductAPI {
  constructor(baseURL = 'http://localhost:3001/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  async getPaginatedProducts(options = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId
    } = options;

    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;

      const response = await this.client.get('/products/paginated', {
        params
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data.message}`);
      }
      throw new Error(`Network Error: ${error.message}`);
    }
  }

  async getAllProducts(filters = {}) {
    const allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getPaginatedProducts({
        ...filters,
        page,
        limit: 50 // Use larger page size for bulk operations
      });

      allProducts.push(...response.items);
      hasMore = response.hasMore;
      page++;

      // Add delay to avoid overwhelming the server
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return allProducts;
  }
}

// Usage examples
const productAPI = new ProductAPI();

// Get first page
productAPI.getPaginatedProducts({ page: 1, limit: 20 })
  .then(response => {
    console.log(`Loaded ${response.items.length} of ${response.total} products`);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Search products
productAPI.getPaginatedProducts({ search: 'laptop', limit: 10 })
  .then(response => {
    console.log('Search results:', response.items.map(p => p.name));
  });

// Get all products (be careful with large datasets)
productAPI.getAllProducts({ categoryId: 1 })
  .then(products => {
    console.log(`Total products in category: ${products.length}`);
  });
```

### Python with Requests

```python
import requests
from typing import Optional, Dict, List, Any
import time

class ProductAPI:
    def __init__(self, base_url: str = "http://localhost:3001/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.timeout = 10

    def get_paginated_products(
        self,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        category_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Fetch paginated products from the API."""
        
        params = {
            "page": page,
            "limit": limit
        }
        
        if search:
            params["search"] = search
        if category_id:
            params["categoryId"] = category_id
        
        try:
            response = self.session.get(
                f"{self.base_url}/products/paginated",
                params=params
            )
            response.raise_for_status()
            return response.json()
            
        except requests.RequestException as e:
            raise Exception(f"API request failed: {e}")

    def get_all_products(
        self,
        search: Optional[str] = None,
        category_id: Optional[int] = None,
        delay: float = 0.1
    ) -> List[Dict[str, Any]]:
        """Fetch all products by paginating through all pages."""
        
        all_products = []
        page = 1
        has_more = True
        
        while has_more:
            response = self.get_paginated_products(
                page=page,
                limit=50,  # Use larger page size
                search=search,
                category_id=category_id
            )
            
            all_products.extend(response["items"])
            has_more = response["hasMore"]
            page += 1
            
            # Add delay to avoid overwhelming the server
            if has_more and delay > 0:
                time.sleep(delay)
        
        return all_products

    def search_products(self, search_term: str, max_results: int = 100) -> List[Dict[str, Any]]:
        """Search for products with a specific term."""
        
        products = []
        page = 1
        limit = min(max_results, 50)
        
        while len(products) < max_results:
            response = self.get_paginated_products(
                page=page,
                limit=limit,
                search=search_term
            )
            
            products.extend(response["items"])
            
            if not response["hasMore"] or len(products) >= max_results:
                break
                
            page += 1
        
        return products[:max_results]

# Usage examples
if __name__ == "__main__":
    api = ProductAPI()
    
    try:
        # Get first page
        result = api.get_paginated_products(page=1, limit=20)
        print(f"Loaded {len(result['items'])} of {result['total']} products")
        
        # Search for laptops
        laptops = api.search_products("laptop", max_results=50)
        print(f"Found {len(laptops)} laptops")
        
        # Get products from specific category
        category_products = api.get_paginated_products(category_id=1, limit=10)
        print(f"Category products: {len(category_products['items'])}")
        
    except Exception as e:
        print(f"Error: {e}")
```

## Testing Examples

### Jest/Supertest (Backend Testing)

```javascript
// products.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products Pagination (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products/paginated (GET)', () => {
    it('should return paginated products with default parameters', () => {
      return request(app.getHttpServer())
        .get('/products/paginated')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page', 1);
          expect(res.body).toHaveProperty('lastPage');
          expect(res.body).toHaveProperty('hasMore');
          expect(Array.isArray(res.body.items)).toBe(true);
          expect(res.body.items.length).toBeLessThanOrEqual(20);
        });
    });

    it('should respect page and limit parameters', () => {
      return request(app.getHttpServer())
        .get('/products/paginated?page=2&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(2);
          expect(res.body.items.length).toBeLessThanOrEqual(5);
        });
    });

    it('should filter by search term', () => {
      return request(app.getHttpServer())
        .get('/products/paginated?search=laptop')
        .expect(200)
        .expect((res) => {
          res.body.items.forEach(product => {
            expect(product.name.toLowerCase()).toContain('laptop');
          });
        });
    });

    it('should filter by category ID', () => {
      return request(app.getHttpServer())
        .get('/products/paginated?categoryId=1')
        .expect(200)
        .expect((res) => {
          res.body.items.forEach(product => {
            expect(product.category?.id).toBe(1);
          });
        });
    });

    it('should validate parameters', () => {
      return request(app.getHttpServer())
        .get('/products/paginated?page=0&limit=101')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('page must not be less than 1');
          expect(res.body.message).toContain('limit must not be greater than 100');
        });
    });
  });
});
```

### Frontend Testing with React Testing Library

```typescript
// ProductList.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ProductList from './ProductList';

const mockProducts = {
  items: [
    { id: 1, name: 'Laptop Pro', price: 1299.99, category: { id: 1, name: 'Laptops' } },
    { id: 2, name: 'Gaming Mouse', price: 59.99, category: { id: 2, name: 'Accessories' } },
  ],
  total: 50,
  page: 1,
  lastPage: 3,
  hasMore: true,
};

const server = setupServer(
  rest.get('http://localhost:3001/api/products/paginated', (req, res, ctx) => {
    const page = req.url.searchParams.get('page') || '1';
    const search = req.url.searchParams.get('search');
    
    let filteredItems = mockProducts.items;
    if (search) {
      filteredItems = mockProducts.items.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return res(
      ctx.json({
        ...mockProducts,
        items: filteredItems,
        page: parseInt(page),
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductList', () => {
  test('renders products and pagination controls', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
      expect(screen.getByText('Gaming Mouse')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Load More')).toBeInTheDocument();
  });

  test('filters products by search term', async () => {
    render(<ProductList />);
    
    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    
    await waitFor(() => {
      expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
    });
  });

  test('loads more products when button is clicked', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Load More'));
    
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization Examples

### Debounced Search

```typescript
import { useMemo, useState, useEffect } from 'react';
import { debounce } from 'lodash';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchableProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { products, loadMore, reset } = usePagination(fetchPaginatedProducts);

  useEffect(() => {
    reset({ search: debouncedSearchTerm });
    loadMore();
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
      />
      {/* Product list */}
    </div>
  );
}
```

### Caching with React Query

```typescript
import { useInfiniteQuery } from 'react-query';

function useInfiniteProducts(filters: ProductFilters) {
  return useInfiniteQuery(
    ['products', filters],
    ({ pageParam = 1 }) => fetchPaginatedProducts(pageParam, 20, filters),
    {
      getNextPageParam: (lastPage) => 
        lastPage.hasMore ? lastPage.page + 1 : undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
}

function CachedProductList() {
  const [filters, setFilters] = useState({});
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProducts(filters);

  const products = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

This comprehensive documentation provides practical examples for integrating the paginated products API across different technologies and use cases.