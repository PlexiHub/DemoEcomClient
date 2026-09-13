import { SiteConfigModel } from "../models/siteConfig.model.js";

// Returns public sanitized site configuration for storefront rendering and dynamic theme injection
export const getPublicSiteConfig = async (req, res, next) => {
  try {
    let config = await SiteConfigModel.findOne({ key: "default" }).lean();
    if (!config) {
      config = await SiteConfigModel.create({ key: "default" });
      config = config.toJSON();
    }

    return res.json({
      status: "success",
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieves full site configuration for administrative management in dashboard
export const getDashboardSiteConfig = async (req, res, next) => {
  try {
    let config = await SiteConfigModel.findOne({ key: "default" }).lean();
    if (!config) {
      config = await SiteConfigModel.create({ key: "default" });
      config = config.toJSON();
    }

    return res.json({
      status: "success",
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

// Persists updated site configuration including colors, branding, and banners to database
export const updateSiteConfig = async (req, res, next) => {
  try {
    const { general, themeColors, branding, banners } = req.body || {};

    const updatePayload = {};
    if (general) updatePayload.general = general;
    if (themeColors) updatePayload.themeColors = themeColors;
    if (branding) updatePayload.branding = branding;
    if (banners) updatePayload.banners = banners;
    updatePayload.updatedBy = req.user?.userId || null;

    const updatedDoc = await SiteConfigModel.findOneAndUpdate(
      { key: "default" },
      { $set: updatePayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return res.json({
      status: "success",
      message: "Site configuration saved successfully.",
      data: updatedDoc,
    });
  } catch (error) {
    next(error);
  }
};
