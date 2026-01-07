# Products API - Pagination Documentation

## Overview

This document describes the paginated products API endpoint that provides server-side pagination with filtering capabilities. The endpoint is designed for efficient data retrieval and optimal performance with large product catalogs.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, the products endpoints are public and do not require authentication. Admin endpoints (POST, PUT, DELETE) may require authentication in future versions.

## Endpoints

### Get Paginated Products

Retrieves a paginated list of products with optional filtering.

**Endpoint:** `GET /products/paginated`

**Description:** Returns products in pages with metadata for pagination controls. Supports search and category filtering.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-based) |
| `limit` | integer | No | 20 | Number of items per page (max: 100) |
| `search` | string | No | - | Search term to filter products by name |
| `categoryId` | integer | No | - | Filter products by category ID |

#### Request Examples

**Basic pagination:**
```http
GET /products/paginated?page=1&limit=20
```

**With search filter:**
```http
GET /products/paginated?page=1&limit=20&search=laptop
```

**With category filter:**
```http
GET /products/paginated?page=1&limit=20&categoryId=3
```

**Combined filters:**
```http
GET /products/paginated?page=2&limit=10&search=gaming&categoryId=1
```

#### Response Format

**Success Response (200 OK):**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Gaming Laptop Pro",
      "slug": "gaming-laptop-pro",
      "description": "High-performance gaming laptop with RTX graphics",
      "price": 1299.99,
      "stock": 15,
      "imageUrl": "https://example.com/images/laptop1.jpg",
      "isFeatured": true,
      "isOnSale": false,
      "discountPercent": null,
      "category": {
        "id": 1,
        "name": "Laptops",
        "slug": "laptops"
      }
    },
    {
      "id": 2,
      "name": "Business Laptop",
      "slug": "business-laptop",
      "description": "Professional laptop for business use",
      "price": 899.99,
      "stock": 8,
      "imageUrl": "https://example.com/images/laptop2.jpg",
      "isFeatured": false,
      "isOnSale": true,
      "discountPercent": 10,
      "category": {
        "id": 1,
        "name": "Laptops",
        "slug": "laptops"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "lastPage": 8,
  "hasMore": true
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `items` | array | Array of product objects for the current page |
| `total` | integer | Total number of products matching the filters |
| `page` | integer | Current page number |
| `lastPage` | integer | Last page number |
| `hasMore` | boolean | Whether more pages are available |

#### Product Object Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | Yes | Unique product identifier |
| `name` | string | Yes | Product name |
| `slug` | string | Yes | URL-friendly product identifier |
| `description` | string | No | Product description |
| `price` | number | Yes | Product price in local currency |
| `stock` | integer | No | Available stock quantity |
| `imageUrl` | string | No | URL to product image |
| `isFeatured` | boolean | No | Whether product is featured |
| `isOnSale` | boolean | No | Whether product is on sale |
| `discountPercent` | number/null | No | Discount percentage if on sale |
| `category` | object/null | No | Associated category object |

#### Category Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique category identifier |
| `name` | string | Category name |
| `slug` | string | URL-friendly category identifier |

#### Error Responses

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": [
    "page must not be less than 1",
    "limit must not be greater than 100"
  ],
  "error": "Bad Request"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Usage Examples

### JavaScript/TypeScript

```typescript
// Basic fetch
async function fetchProducts(page = 1, limit = 20) {
  const response = await fetch(
    `http://localhost:3001/api/products/paginated?page=${page}&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

// With filters
async function fetchFilteredProducts(filters) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    ...(filters.search && { search: filters.search }),
    ...(filters.categoryId && { categoryId: filters.categoryId })
  });
  
  const response = await fetch(
    `http://localhost:3001/api/products/paginated?${params}`
  );
  
  return response.json();
}

// Usage with async/await
try {
  const result = await fetchProducts(1, 20);
  console.log(`Loaded ${result.items.length} of ${result.total} products`);
  console.log(`Page ${result.page} of ${result.lastPage}`);
} catch (error) {
  console.error('Error fetching products:', error);
}
```

### cURL Examples

**Basic request:**
```bash
curl -X GET "http://localhost:3001/api/products/paginated?page=1&limit=20" \
  -H "Accept: application/json"
```

**With search:**
```bash
curl -X GET "http://localhost:3001/api/products/paginated?search=laptop&page=1&limit=10" \
  -H "Accept: application/json"
```

**With category filter:**
```bash
curl -X GET "http://localhost:3001/api/products/paginated?categoryId=3&page=1&limit=20" \
  -H "Accept: application/json"
```

### Python Example

```python
import requests

def fetch_paginated_products(page=1, limit=20, search=None, category_id=None):
    url = "http://localhost:3001/api/products/paginated"
    params = {
        "page": page,
        "limit": limit
    }
    
    if search:
        params["search"] = search
    if category_id:
        params["categoryId"] = category_id
    
    response = requests.get(url, params=params)
    response.raise_for_status()
    
    return response.json()

# Usage
try:
    result = fetch_paginated_products(page=1, limit=20, search="laptop")
    print(f"Loaded {len(result['items'])} of {result['total']} products")
except requests.RequestException as e:
    print(f"Error: {e}")
```

## Performance Considerations

### Database Optimization

The endpoint uses optimized database queries with:

- **Indexes:** Composite indexes on `categoryId` and `name` fields
- **LIMIT/OFFSET:** Efficient pagination using SQL LIMIT and OFFSET
- **JOIN Optimization:** Left joins for category relations
- **Search Optimization:** ILIKE queries for case-insensitive search

### Recommended Practices

1. **Page Size:** Use reasonable page sizes (10-50 items)
   - Small pages: More requests, better responsiveness
   - Large pages: Fewer requests, higher memory usage

2. **Caching:** Consider implementing client-side caching for:
   - Recently viewed pages
   - Search results
   - Category filters

3. **Debouncing:** For search functionality, debounce user input to avoid excessive API calls

```typescript
// Example debounced search
const debouncedSearch = useMemo(
  () => debounce((searchTerm) => {
    fetchProducts(1, 20, { search: searchTerm });
  }, 300),
  []
);
```

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider:

- Rate limiting per IP address
- Different limits for authenticated vs anonymous users
- Burst protection for search endpoints

## Monitoring and Analytics

The API includes performance monitoring:

- Response time tracking
- Query performance metrics
- Error rate monitoring
- Usage analytics

## Migration from Legacy Endpoint

If migrating from the legacy `/products` endpoint:

### Old Endpoint (Client-side pagination)
```http
GET /products
```
Returns all products, filtered client-side.

### New Endpoint (Server-side pagination)
```http
GET /products/paginated?page=1&limit=20
```
Returns paginated results, filtered server-side.

### Migration Benefits

1. **Performance:** Faster initial load times
2. **Scalability:** Handles large product catalogs efficiently
3. **Memory Usage:** Reduced client-side memory consumption
4. **Network:** Smaller response payloads

## Troubleshooting

### Common Issues

1. **Empty Results**
   - Check if filters are too restrictive
   - Verify category IDs exist
   - Ensure search terms match product names

2. **Performance Issues**
   - Use appropriate page sizes (20-50 items)
   - Avoid very large page numbers
   - Consider search term length and complexity

3. **Validation Errors**
   - Ensure page >= 1
   - Ensure limit <= 100
   - Check parameter types (integers for page, limit, categoryId)

### Debug Information

Enable debug logging by setting environment variable:
```bash
DEBUG=products:pagination
```

This will log:
- Query execution times
- Filter applications
- Result counts
- Performance metrics

## Future Enhancements

Planned improvements:

1. **Additional Filters:**
   - Price range filtering
   - Stock availability
   - Featured products only
   - Sale items only

2. **Sorting Options:**
   - Price (ascending/descending)
   - Name (alphabetical)
   - Creation date
   - Popularity

3. **Advanced Search:**
   - Full-text search
   - Category name search
   - Description search

4. **Performance:**
   - Redis caching
   - Database query optimization
   - CDN integration for images

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: Products API
  version: 1.0.0
  description: Paginated products API with filtering capabilities

paths:
  /products/paginated:
    get:
      summary: Get paginated products
      description: Retrieve products with server-side pagination and filtering
      parameters:
        - name: page
          in: query
          description: Page number (1-based)
          required: false
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          description: Number of items per page
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: search
          in: query
          description: Search term for product names
          required: false
          schema:
            type: string
        - name: categoryId
          in: query
          description: Filter by category ID
          required: false
          schema:
            type: integer
            minimum: 1
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  items:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  total:
                    type: integer
                    description: Total number of products
                  page:
                    type: integer
                    description: Current page number
                  lastPage:
                    type: integer
                    description: Last page number
                  hasMore:
                    type: boolean
                    description: Whether more pages are available
        '400':
          description: Bad request - invalid parameters
        '500':
          description: Internal server error

components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: integer
          description: Unique product identifier
        name:
          type: string
          description: Product name
        slug:
          type: string
          description: URL-friendly identifier
        description:
          type: string
          description: Product description
        price:
          type: number
          format: float
          description: Product price
        stock:
          type: integer
          description: Available stock
        imageUrl:
          type: string
          format: uri
          description: Product image URL
        isFeatured:
          type: boolean
          description: Whether product is featured
        isOnSale:
          type: boolean
          description: Whether product is on sale
        discountPercent:
          type: number
          format: float
          nullable: true
          description: Discount percentage
        category:
          $ref: '#/components/schemas/Category'
    
    Category:
      type: object
      properties:
        id:
          type: integer
          description: Category ID
        name:
          type: string
          description: Category name
        slug:
          type: string
          description: URL-friendly category identifier
```