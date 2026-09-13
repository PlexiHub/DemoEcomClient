import mongoose, { Schema, model } from "mongoose";

const siteConfigSchema = new Schema(
  {
    key: {
      type: String,
      default: "default",
      unique: true,
      index: true,
      trim: true,
    },
    general: {
      siteName: { type: String, default: "PLEXIVIA", trim: true },
      tagline: { type: String, default: "Crafting Digital Dreams", trim: true },
      notificationEmail: { type: String, default: "support@plexivia.com", trim: true, lowercase: true },
      contactEmail: { type: String, default: "info@plexivia.com", trim: true, lowercase: true },
      phone: { type: String, default: "+880 1700-000000", trim: true },
      whatsappNumber: { type: String, default: "8801700000000", trim: true },
      currencySymbol: { type: String, default: "৳ ", trim: true },
    },
    themeColors: {
      primaryColor: { type: String, default: "#58C1C3", trim: true },
      secondaryColor: { type: String, default: "#97CC6F", trim: true },
      accentColor: { type: String, default: "#284A52", trim: true },
      darkBgColor: { type: String, default: "#0C1618", trim: true },
      surfaceColor: { type: String, default: "#122225", trim: true },
      cardColor: { type: String, default: "#15272B", trim: true },
      borderColor: { type: String, default: "#1E373D", trim: true },
      textColor: { type: String, default: "#F5F7F7", trim: true },
      mutedColor: { type: String, default: "#94AFB5", trim: true },
    },
    branding: {
      logoUrl: { type: String, default: "", trim: true },
      darkLogoUrl: { type: String, default: "", trim: true },
      faviconUrl: { type: String, default: "", trim: true },
      showTagline: { type: Boolean, default: true },
    },
    banners: {
      heroBanners: [
        {
          _id: false,
          id: { type: String, default: () => Math.random().toString(36).substring(2, 9) },
          title: { type: String, default: "Next-Gen Digital Commerce", trim: true },
          subtitle: { type: String, default: "Minimalist, performance-first shopping experience built for modern scale.", trim: true },
          badge: { type: String, default: "Plexivia 2.0 Released", trim: true },
          imageUrl: { type: String, default: "", trim: true },
          ctaText: { type: String, default: "Explore Collection", trim: true },
          ctaLink: { type: String, default: "shop", trim: true },
          secondaryCtaText: { type: String, default: "Book a Demo", trim: true },
          sortOrder: { type: Number, default: 0 },
        },
      ],
      aboutBanner: {
        title: { type: String, default: "PLEXIVIA – Crafting Digital Dreams", trim: true },
        subtitle: { type: String, default: "Digital Development Agency", trim: true },
        description: { type: String, default: "We build bespoke web applications, modern e-commerce systems, and high-performance digital platforms that help brands grow and leave lasting impressions.", trim: true },
        imageUrl: { type: String, default: "", trim: true },
      },
      promoBanner: {
        enabled: { type: Boolean, default: true },
        badge: { type: String, default: "⚡ Special Launch Offer", trim: true },
        text: { type: String, default: "Get Free Nationwide Delivery on All Orders Over ৳ 2,000", trim: true },
        link: { type: String, default: "shop", trim: true },
      },
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// Exports Mongoose model for site-wide configuration
export const SiteConfigModel =
  mongoose.models.SiteConfig || model("SiteConfig", siteConfigSchema);
