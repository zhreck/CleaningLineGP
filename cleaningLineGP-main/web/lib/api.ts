import type { Product } from "./types";

export async function fetchProducts(query?: string): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:3001/products", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    // --- CATÁLOGO MOCK DEFINITIVO ---
    const mockProducts: Product[] = [
      // CLORO
      {
        id: "1",
        slug: "cloro-hogar-1l",
        name: "Cloro hogar 1L",
        price: 2490,
        description: "Cloro para uso domiciliario, ideal para baños y cocina.",
        imageUrl: "/placeholder.png",
        categoryKey: "cloro",
        categoryName: "Cloro y desinfectantes",
        stock: 120,
        isFeatured: true,
        isOnSale: true,
        discountPercent: 10,
      },
      {
        id: "2",
        slug: "cloro-industrial-5l",
        name: "Cloro industrial 5L",
        price: 6990,
        description: "Cloro concentrado para uso industrial y grandes superficies.",
        imageUrl: "/placeholder.png",
        categoryKey: "cloro",
        categoryName: "Cloro y desinfectantes",
        stock: 60,
        isFeatured: true,
        isOnSale: true,
        discountPercent: 15,
      },
      {
        id: "3",
        slug: "desinfectante-multiuso-1l",
        name: "Desinfectante multiuso 1L",
        price: 3990,
        description: "Desinfectante aromatizado para pisos, baños y superficies.",
        imageUrl: "/placeholder.png",
        categoryKey: "cloro",
        categoryName: "Cloro y desinfectantes",
        stock: 80,
      },

      // HOGAR
      {
        id: "4",
        slug: "detergente-liquido-3l",
        name: "Detergente líquido 3L",
        price: 5490,
        description: "Detergente para ropa, fórmula suave de alta limpieza.",
        imageUrl: "/placeholder.png",
        categoryKey: "hogar",
        categoryName: "Limpieza del hogar",
        stock: 90,
        isFeatured: true,
      },
      {
        id: "5",
        slug: "limpiador-pisos-2l",
        name: "Limpiador de pisos 2L",
        price: 3590,
        description: "Limpieza y brillo para pisos cerámicos y flotantes.",
        imageUrl: "/placeholder.png",
        categoryKey: "hogar",
        categoryName: "Limpieza del hogar",
        stock: 75,
      },
      {
        id: "6",
        slug: "desengrasante-cocina-1l",
        name: "Desengrasante de cocina 1L",
        price: 3990,
        description: "Desengrasante potente para cocina, campanas y hornos.",
        imageUrl: "/placeholder.png",
        categoryKey: "hogar",
        categoryName: "Limpieza del hogar",
        stock: 50,
        isOnSale: true,
        discountPercent: 12,
      },

      // PERSONAL
      {
        id: "7",
        slug: "jabón-liquido-manos-1l",
        name: "Jabón líquido de manos 1L",
        price: 2990,
        description: "Jabón líquido para manos, suave con la piel.",
        imageUrl: "/placeholder.png",
        categoryKey: "personal",
        categoryName: "Limpieza personal",
        stock: 100,
      },
      {
        id: "8",
        slug: "alcohol-gel-500ml",
        name: "Alcohol gel 500 ml",
        price: 2990,
        description: "Alcohol gel para uso personal, ideal para oficinas y locales.",
        imageUrl: "/placeholder.png",
        categoryKey: "personal",
        categoryName: "Limpieza personal",
        stock: 200,
        isFeatured: true,
      },
      {
        id: "9",
        slug: "toallas-desinfectantes-80u",
        name: "Toallas desinfectantes (80 unidades)",
        price: 4490,
        description: "Toallas desinfectantes para manos y superficies.",
        imageUrl: "/placeholder.png",
        categoryKey: "personal",
        categoryName: "Limpieza personal",
        stock: 65,
        isOnSale: true,
        discountPercent: 8,
      },
    ];

    return mockProducts;
  }
}

// si ya tenías fetchProductBySlug, lo dejas como estaba:
export async function fetchProductBySlug(slug: string): Promise<Product> {
  const products = await fetchProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      id: "0",
      slug,
      name: "Producto no encontrado",
      price: 0,
      description: "No existe este producto en el catálogo.",
    };
  }

  return product;
}
