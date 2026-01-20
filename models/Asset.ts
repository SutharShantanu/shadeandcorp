import mongoose, { Schema, Document } from "mongoose";

export interface IAsset extends Document {
    productId: mongoose.Types.ObjectId;
    variantId?: mongoose.Types.ObjectId; // Null if it's a "common" asset
    type: "image" | "video";
    role: "thumbnail" | "gallery" | "zoom";
    url: string; // Vercel Blob URL
    alt: string;
    order: number;
    metadata?: {
        source: string;
        photographerName?: string;
        photographerUrl?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const AssetSchema: Schema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        variantId: { type: Schema.Types.ObjectId, ref: "Variant", default: null },
        type: { type: String, enum: ["image", "video"], default: "image" },
        role: { type: String, enum: ["thumbnail", "gallery", "zoom"], default: "gallery" },
        url: { type: String, required: true },
        alt: { type: String, required: true },
        order: { type: Number, default: 0 },
        metadata: {
            source: { type: String, default: "manual" },
            photographerName: { type: String },
            photographerUrl: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient filtering by product/variant
AssetSchema.index({ productId: 1, variantId: 1, order: 1 });

const Asset = mongoose.models.Asset || mongoose.model<IAsset>("Asset", AssetSchema);

export default Asset;
