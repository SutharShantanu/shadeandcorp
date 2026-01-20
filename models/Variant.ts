import mongoose, { Schema, Document } from "mongoose";

export interface IVariant extends Document {
    productId: mongoose.Types.ObjectId;
    color: {
        name: string;
        hex: string;
    };
    size: string;
    sku: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    stockQuantity: number;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VariantSchema: Schema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        color: {
            name: { type: String, required: true },
            hex: { type: String, required: true },
        },
        size: { type: String, required: true },
        sku: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        discount: { type: Number },
        stockQuantity: { type: Number, required: true, default: 0 },
        isDefault: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Index for faster lookups
VariantSchema.index({ productId: 1, "color.name": 1 });

const Variant = mongoose.models.Variant || mongoose.model<IVariant>("Variant", VariantSchema);

export default Variant;
