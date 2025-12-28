import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subCategory?: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  inStock: boolean;
  stockQuantity: number;
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  sku: string;
  slug: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  sizeAvailability?: Map<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number },
    images: [{ type: String, required: true }],
    category: { type: String, required: true, index: true },
    subCategory: { type: String, index: true },
    sizes: [{ type: String }],
    colors: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, required: true, default: 0 },
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
    sizeAvailability: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating the model multiple times
const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
