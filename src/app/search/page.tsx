import { Suspense } from "react";
import SearchPageClient from "./_components/search-page.client";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageClient />
    </Suspense>
  );
}
