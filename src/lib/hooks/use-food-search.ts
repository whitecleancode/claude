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

// Popular Russian products fallback (per 100g)
const LOCAL_PRODUCTS: FoodResult[] = [
  { name: "Куриная грудка", calories: 165, protein: 31, fat: 3.6, carbs: 0 },
  { name: "Куриное бедро", calories: 209, protein: 26, fat: 11, carbs: 0 },
  { name: "Гречка (варёная)", calories: 132, protein: 4.5, fat: 2.3, carbs: 25 },
  { name: "Рис белый (варёный)", calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
  { name: "Яйцо куриное (1 шт, 60г)", calories: 93, protein: 7.5, fat: 6.6, carbs: 0.6 },
  { name: "Овсянка (варёная)", calories: 88, protein: 3, fat: 1.5, carbs: 15 },
  { name: "Творог 5%", calories: 121, protein: 17, fat: 5, carbs: 1.8 },
  { name: "Творог 0%", calories: 71, protein: 18, fat: 0.1, carbs: 3.3 },
  { name: "Молоко 2.5%", calories: 52, protein: 2.8, fat: 2.5, carbs: 4.7 },
  { name: "Кефир 1%", calories: 40, protein: 3, fat: 1, carbs: 4 },
  { name: "Банан", calories: 89, protein: 1.1, fat: 0.3, carbs: 23 },
  { name: "Яблоко", calories: 52, protein: 0.3, fat: 0.2, carbs: 14 },
  { name: "Хлеб белый", calories: 265, protein: 9, fat: 3.2, carbs: 49 },
  { name: "Хлеб чёрный", calories: 174, protein: 6.6, fat: 1.2, carbs: 33 },
  { name: "Макароны (варёные)", calories: 131, protein: 5, fat: 1.1, carbs: 25 },
  { name: "Говядина (варёная)", calories: 254, protein: 26, fat: 16, carbs: 0 },
  { name: "Свинина (варёная)", calories: 375, protein: 23, fat: 31, carbs: 0 },
  { name: "Лосось", calories: 208, protein: 20, fat: 13, carbs: 0 },
  { name: "Тунец (консервы)", calories: 116, protein: 26, fat: 1, carbs: 0 },
  { name: "Картофель (варёный)", calories: 82, protein: 2, fat: 0.1, carbs: 17 },
  { name: "Огурец", calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6 },
  { name: "Помидор", calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
  { name: "Сыр твёрдый", calories: 350, protein: 25, fat: 28, carbs: 0 },
  { name: "Масло сливочное", calories: 717, protein: 0.9, fat: 81, carbs: 0.1 },
  { name: "Сметана 15%", calories: 162, protein: 2.6, fat: 15, carbs: 3.6 },
  { name: "Гречка (сухая)", calories: 343, protein: 13, fat: 3.4, carbs: 62 },
  { name: "Рис (сухой)", calories: 350, protein: 7, fat: 0.7, carbs: 79 },
  { name: "Протеиновый коктейль", calories: 120, protein: 24, fat: 1.5, carbs: 4 },
  { name: "Арахис", calories: 567, protein: 26, fat: 49, carbs: 16 },
  { name: "Миндаль", calories: 579, protein: 21, fat: 50, carbs: 22 },
];

function searchLocal(query: string): FoodResult[] {
  const q = query.toLowerCase();
  return LOCAL_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5);
}

export function useFoodSearch(query: string) {
  const [results, setResults] = useState<FoodResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Immediately show local results
    const local = searchLocal(query);
    if (local.length > 0) {
      setResults(local);
    }

    if (query.length < 3) return;

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      try {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,nutriments`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          // API error — keep local results
          setResults(local);
          return;
        }

        const data = await res.json();

        const apiProducts: FoodResult[] = (data.products || [])
          .filter((p: OpenFoodFactsProduct) => p.product_name)
          .map((p: OpenFoodFactsProduct) => ({
            name: p.product_name || "",
            calories: Math.round(p.nutriments?.["energy-kcal_100g"] || 0),
            protein: Math.round((p.nutriments?.proteins_100g || 0) * 10) / 10,
            fat: Math.round((p.nutriments?.fat_100g || 0) * 10) / 10,
            carbs: Math.round((p.nutriments?.carbohydrates_100g || 0) * 10) / 10,
          }));

        // Merge: local first, then API (deduplicated), max 8
        const seen = new Set(local.map((p) => p.name.toLowerCase()));
        const merged = [...local];
        for (const p of apiProducts) {
          if (!seen.has(p.name.toLowerCase()) && merged.length < 8) {
            merged.push(p);
            seen.add(p.name.toLowerCase());
          }
        }

        setResults(merged);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // On network error, keep local results
        setResults(local);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading };
}
