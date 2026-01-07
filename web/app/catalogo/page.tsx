// web/app/catalogo/page.tsx
import CatalogoClient from "./CatalogoClient";
import { getCategories } from "../../lib/categoriesApi";

import CatalogFilters from "../catalogo/catalogoFilters";

type CatalogoPageProps = {
  searchParams?: {
    q?: string;
    cat?: string;
    featured?: string;
    onSale?: string;
    minPrice?: string;
    maxPrice?: string;
  };
};

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;

  // Get categories server-side (they don't change often)
  const categories = await getCategories();

  return (
    <CatalogoClient
      initialSearchParams={params}
      categories={categories}
    />
  );
}
