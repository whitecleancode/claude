"use client";

import { useState, useEffect, useRef } from "react";

export interface FoodResult {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface OpenFoodFactsProduct {
  product_name?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    fat_100g?: number;
    carbohydrates_100g?: number;
  };
}

export function useFoodSearch(query: string) {
  const [results, setResults] = useState<FoodResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      try {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,nutriments`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        const products: FoodResult[] = (data.products || [])
          .filter((p: OpenFoodFactsProduct) => p.product_name)
          .map((p: OpenFoodFactsProduct) => ({
            name: p.product_name || "",
            calories: Math.round(p.nutriments?.["energy-kcal_100g"] || 0),
            protein: Math.round((p.nutriments?.proteins_100g || 0) * 10) / 10,
            fat: Math.round((p.nutriments?.fat_100g || 0) * 10) / 10,
            carbs: Math.round((p.nutriments?.carbohydrates_100g || 0) * 10) / 10,
          }));

        setResults(products);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading };
}
