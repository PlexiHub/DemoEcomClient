import { Router } from "express";
import {
  getPublicSiteConfig,
  getDashboardSiteConfig,
  updateSiteConfig,
} from "../controllers/siteConfig.controller.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const siteConfigRouter = Router();

// Public sanitized site configuration endpoint for storefront client integration
siteConfigRouter.get("/public/site-config", getPublicSiteConfig);

// Protected site configuration administration endpoint for dashboard settings
siteConfigRouter.get(
  "/site-config",
  authenticateToken,
  authorizeRoles("Owner", "Admin", "Demo Client"),
  getDashboardSiteConfig
);

// Protected site configuration mutation endpoint for updating themes and branding
siteConfigRouter.put(
  "/site-config",
  authenticateToken,
  authorizeRoles("Owner", "Admin", "Demo Client"),
  updateSiteConfig
);

export default siteConfigRouter;
