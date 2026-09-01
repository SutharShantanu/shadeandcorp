import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/ProductCard";

export interface WishlistItem extends Product {
  collectionName?: string;
  addedAt?: string;
  addedPrice?: number;
}

export interface WishlistState {
  items: WishlistItem[];
  customCollections: string[];
}

const LS_KEY = "wishlist";
const LS_COLLECTIONS_KEY = "wishlist_custom_collections";

function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: WishlistItem[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    }
  } catch {}
}

function readCustomCollections(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_COLLECTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeCustomCollections(collections: string[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_COLLECTIONS_KEY, JSON.stringify(collections));
    }
  } catch {}
}

const initialState: WishlistState = {
  items: [],
  customCollections: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrate(state) {
      state.items = readWishlist();
      state.customCollections = readCustomCollections();
    },
    add(state, action: PayloadAction<Product & { collectionName?: string }>) {
      const existsIndex = state.items.findIndex(
        (p: WishlistItem) => p.id === action.payload.id,
      );
      if (existsIndex >= 0) {
        if (action.payload.collectionName) {
          state.items[existsIndex].collectionName =
            action.payload.collectionName;
        }
      } else {
        state.items.unshift({
          ...action.payload,
          collectionName: action.payload.collectionName || "General",
          addedAt: new Date().toISOString(),
          addedPrice:
            action.payload.basePrice ||
            action.payload.variants?.[0]?.price ||
            0,
        });
      }
      writeWishlist(state.items);
    },
    remove(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (p: WishlistItem) => p.id !== action.payload,
      );
      writeWishlist(state.items);
    },
    bulkRemove(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload);
      state.items = state.items.filter((p) => !ids.has(p.id));
      writeWishlist(state.items);
    },
    setCollection(
      state,
      action: PayloadAction<{ id: string; collectionName: string }>,
    ) {
      const item = state.items.find((p) => p.id === action.payload.id);
      if (item) {
        item.collectionName = action.payload.collectionName;
        writeWishlist(state.items);
      }
    },
    bulkSetCollection(
      state,
      action: PayloadAction<{ ids: string[]; collectionName: string }>,
    ) {
      const idSet = new Set(action.payload.ids);
      state.items.forEach((p) => {
        if (idSet.has(p.id)) {
          p.collectionName = action.payload.collectionName;
        }
      });
      writeWishlist(state.items);
    },
    createCustomCollection(state, action: PayloadAction<string>) {
      const name = action.payload.trim();
      if (name && !state.customCollections.includes(name)) {
        state.customCollections.push(name);
        writeCustomCollections(state.customCollections);
      }
    },
    deleteCustomCollection(state, action: PayloadAction<string>) {
      const name = action.payload;
      state.customCollections = state.customCollections.filter(
        (c) => c !== name,
      );
      writeCustomCollections(state.customCollections);
      state.items.forEach((p) => {
        if (p.collectionName === name) {
          p.collectionName = "General";
        }
      });
      writeWishlist(state.items);
    },
    setSampleItems(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
      writeWishlist(state.items);
    },
    clear(state) {
      state.items = [];
      writeWishlist(state.items);
    },
  },
});

export const {
  add,
  remove,
  bulkRemove,
  setCollection,
  bulkSetCollection,
  createCustomCollection,
  deleteCustomCollection,
  setSampleItems,
  clear,
  hydrate,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
