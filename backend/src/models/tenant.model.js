import mongoose, { Schema, model } from "mongoose";

const tenantSchema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true, index: true, trim: true },
    storeName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    theme: { type: String, default: "luxury-1" },
    dbName: { type: String, required: true, trim: true },
    role: { type: String, default: "Demo Client" },
    status: { type: String, enum: ["active", "expired", "suspended"], default: "active", index: true },
    expiresAt: { type: Date, required: true, index: true },
    productsCount: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Exports master tenant registry model for managing multi-tenant sandboxes
export const TenantModel = mongoose.models.Tenant || model("Tenant", tenantSchema);
