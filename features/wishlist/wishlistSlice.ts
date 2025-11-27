import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/ProductCard";

export interface WishlistState {
    items: Product[];
}

const LS_KEY = "wishlist";

function readWishlist(): Product[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as Product[]) : [];
    } catch {
        return [];
    }
}

function writeWishlist(items: Product[]) {
    try {
        if (typeof window !== "undefined") {
            localStorage.setItem(LS_KEY, JSON.stringify(items));
        }
    } catch { }
}

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        hydrate(state) {
            state.items = readWishlist();
        },
        add(state, action: PayloadAction<Product>) {
            const exists = state.items.some((p: Product) => p.id === action.payload.id);
            if (!exists) {
                state.items.unshift(action.payload);
                writeWishlist(state.items);
            }
        },
        remove(state, action: PayloadAction<string>) {
            state.items = state.items.filter((p: Product) => p.id !== action.payload);
            writeWishlist(state.items);
        },
        clear(state) {
            state.items = [];
            writeWishlist(state.items);
        },
    },
});

export const { add, remove, clear, hydrate } = wishlistSlice.actions;
export default wishlistSlice.reducer;
