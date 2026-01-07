# Pagination System Documentation

## Overview

This documentation covers the complete pagination system implemented for the product catalog. The system provides server-side pagination with infinite scroll capabilities, designed for optimal performance and user experience.

## Architecture

The pagination system consists of three main components:

1. **Backend API** - Paginated endpoints with efficient database queries
2. **Frontend Hooks** - React hooks for state management and infinite scroll
3. **API Client** - Functions for communicating with the backend

## Quick Start

### Basic Implementation

```typescript
import { usePagination, useInfiniteScroll } from '@/lib/usePagination';
import { fetchPaginatedProducts } from '@/lib/productsApi';

function ProductCatalog() {
  // Set up pagination
  const {
    items: products,
    isLoading,
    hasMore,
    loadMore,
    reset,
    totalCount
  } = usePagination(fetchPaginatedProducts, 20);

  // Set up infinite scroll
  const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading);

  // Load initial data
  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div>
      <h1>Products ({totalCount})</h1>
      
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {hasMore && (
        <div ref={sentinelRef}>
          {isLoading ? <LoadingSpinner /> : 'Scroll for more...'}
        </div>
      )}
    </div>
  );
}
```

### With Filters

```typescript
function FilterableProductCatalog() {
  const [filters, setFilters] = useState({ search: '', categoryId: null });
  
  const pagination = usePagination(
    fetchPaginatedProducts,
    20,
    filters
  );

  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    pagination.reset(newFilters);
    pagination.loadMore();
  };

  const handleCategoryChange = (categoryId: number) => {
    const newFilters = { ...filters, categoryId };
    setFilters(newFilters);
    pagination.reset(newFilters);
    pagination.loadMore();
  };

  // ... rest of component
}
```

## API Reference

### usePagination Hook

```typescript
function usePagination<T>(
  fetchFunction: (page: number, limit: number, filters?: any) => Promise<PaginatedResponse<T>>,
  limit?: number,
  initialFilters?: Record<string, any>
): PaginationHookReturn<T>
```

#### Parameters

- `fetchFunction` - Function that fetches paginated data
- `limit` - Items per page (default: 20, recommended max: 50)
- `initialFilters` - Initial filter values

#### Returns

```typescript
interface PaginationHookReturn<T> {
  items: T[];                    // All loaded items
  isLoading: boolean;            // Initial loading state
  isLoadingMore: boolean;        // Loading more items state
  error: string | null;          // Error message if any
  hasMore: boolean;              // Whether more items are available
  totalCount: number;            // Total number of items
  currentPage: number;           // Current page number
  loadMore: () => Promise<void>; // Load next page
  reset: (newFilters?) => void;  // Reset pagination state
  retry: () => Promise<void>;    // Retry after error
}
```

### useInfiniteScroll Hook

```typescript
function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  isLoading: boolean,
  threshold?: number
): React.RefObject<HTMLDivElement>
```

#### Parameters

- `callback` - Function to call when loading more content
- `hasMore` - Whether more content is available
- `isLoading` - Whether currently loading (prevents duplicate calls)
- `threshold` - Intersection threshold (0.0-1.0, default: 0.1)

#### Returns

React ref to attach to the sentinel element at the bottom of your list.

### fetchPaginatedProducts Function

```typescript
function fetchPaginatedProducts(
  page?: number,
  limit?: number,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>>
```

#### Parameters

- `page` - Page number (1-based, default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `filters` - Optional filters
  - `search` - Search term for product names
  - `categoryId` - Filter by category ID

#### Returns

```typescript
interface PaginatedResponse<Product> {
  items: Product[];     // Products for this page
  total: number;        // Total number of products
  page: number;         // Current page number
  lastPage: number;     // Last page number
  hasMore: boolean;     // Whether more pages exist
}
```

## Best Practices

### Performance Optimization

1. **Use appropriate page sizes**
   ```typescript
   // Good: Reasonable page size
   const pagination = usePagination(fetchProducts, 20);
   
   // Avoid: Too large (slow requests)
   const pagination = usePagination(fetchProducts, 100);
   
   // Avoid: Too small (too many requests)
   const pagination = usePagination(fetchProducts, 5);
   ```

2. **Implement proper loading states**
   ```typescript
   {isLoading && <SkeletonLoader />}
   {isLoadingMore && <LoadingSpinner />}
   {error && <ErrorMessage onRetry={retry} />}
   ```

3. **Use React.memo for list items**
   ```typescript
   const ProductCard = React.memo(({ product }) => {
     return <div>{product.name}</div>;
   });
   ```

### Error Handling

```typescript
function RobustProductList() {
  const { items, error, retry, isLoading } = usePagination(fetchProducts);

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load products: {error}</p>
        <button onClick={retry} disabled={isLoading}>
          {isLoading ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  // ... rest of component
}
```

### Filter Management

```typescript
function FilteredProductList() {
  const [filters, setFilters] = useState({});
  const pagination = usePagination(fetchProducts, 20, filters);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useMemo(
    () => debounce((searchTerm: string) => {
      const newFilters = { ...filters, search: searchTerm };
      setFilters(newFilters);
      pagination.reset(newFilters);
      pagination.loadMore();
    }, 300),
    [filters, pagination]
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      {/* Product list */}
    </div>
  );
}
```

## Common Patterns

### 1. Search with Pagination

```typescript
function SearchableProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const pagination = usePagination(fetchProducts, 20);

  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    pagination.reset({ search: term });
    await pagination.loadMore();
  }, [pagination]);

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      <ProductGrid products={pagination.items} />
      <InfiniteScrollTrigger
        onTrigger={pagination.loadMore}
        hasMore={pagination.hasMore}
        isLoading={pagination.isLoadingMore}
      />
    </div>
  );
}
```

### 2. Category Filtering

```typescript
function CategoryFilteredProducts() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const pagination = usePagination(fetchProducts, 20);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    pagination.reset({ categoryId });
    pagination.loadMore();
  };

  return (
    <div>
      <CategoryFilter
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />
      <ProductList products={pagination.items} />
    </div>
  );
}
```

### 3. Load More Button (Alternative to Infinite Scroll)

```typescript
function ManualPaginationList() {
  const { items, hasMore, isLoadingMore, loadMore } = usePagination(fetchProducts);

  return (
    <div>
      <ProductGrid products={items} />
      
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoadingMore}
          className="load-more-btn"
        >
          {isLoadingMore ? 'Loading...' : 'Load More Products'}
        </button>
      )}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Duplicate items in the list**
   - The hook automatically prevents duplicates based on item ID
   - Ensure your items have unique `id` properties

2. **Infinite scroll not triggering**
   - Check that the sentinel element is properly positioned
   - Verify `hasMore` is true and `isLoading` is false
   - Ensure the sentinel element is visible in the viewport

3. **Performance issues with large lists**
   - Consider implementing virtual scrolling for very large datasets
   - Use React.memo for list items
   - Optimize your fetch function

4. **Filters not working correctly**
   - Always call `reset()` before applying new filters
   - Ensure filter parameters are properly passed to the API

### Debug Mode

Enable debug logging in development:

```typescript
// Add to your component
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Pagination state:', {
      itemCount: items.length,
      currentPage,
      hasMore,
      isLoading,
      totalCount
    });
  }
}, [items.length, currentPage, hasMore, isLoading, totalCount]);
```

## Migration Guide

### From Client-Side Pagination

If you're migrating from client-side pagination:

```typescript
// Old approach (client-side)
const [allProducts, setAllProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [currentPage, setCurrentPage] = useState(1);

// New approach (server-side)
const { items: products, loadMore, reset } = usePagination(fetchPaginatedProducts);
```

### From Manual Pagination

If you're migrating from manual pagination controls:

```typescript
// Old approach (manual controls)
const [products, setProducts] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const loadPage = async (pageNum: number) => {
  const response = await fetchProducts(pageNum);
  setProducts(response.items);
  setTotalPages(response.totalPages);
};

// New approach (infinite scroll)
const { items: products, loadMore } = usePagination(fetchPaginatedProducts);
const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading);
```

## Performance Metrics

The system includes built-in performance monitoring:

- Initial load time tracking
- Subsequent page load timing
- Memory usage monitoring
- API response time logging

Access metrics in development console or through the global `performanceMetrics` object.