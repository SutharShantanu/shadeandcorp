import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  brand: string;
  basePrice: number;
  category: string;
  subCategory?: string;
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  sku: string; // Base SKU
  slug: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    basePrice: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    subCategory: { type: String, index: true },
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    sku: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating the model multiple times
const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
