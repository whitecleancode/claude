export interface FavoriteFood {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const STORAGE_KEY = "favorite-foods";

export function getFavorites(): FavoriteFood[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addFavorite(food: FavoriteFood): FavoriteFood[] {
  const favs = getFavorites();
  // Don't add duplicates by name
  if (favs.some((f) => f.name === food.name)) return favs;
  favs.unshift(food);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs.slice(0, 50)));
  return favs;
}

export function removeFavorite(name: string): FavoriteFood[] {
  const favs = getFavorites().filter((f) => f.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(name: string): boolean {
  return getFavorites().some((f) => f.name === name);
}
