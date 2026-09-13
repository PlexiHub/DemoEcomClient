import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { TenantModel } from "../models/tenant.model.js";

// Resolves and attaches tenant-specific database context based on JWT or custom header
export const tenantResolver = async (req, res, next) => {
  try {
    let tenantId = null;

    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        if (decoded && decoded.tenantId) {
          tenantId = decoded.tenantId;
          req.tokenUser = decoded;
        }
      } catch (err) {
      }
    }

    if (!tenantId && req.headers["x-tenant-id"]) {
      tenantId = String(req.headers["x-tenant-id"]).trim();
    }

    if (tenantId && /^demo_[a-z0-9_]{3,35}$/.test(tenantId)) {
      const tenant = await TenantModel.findOne({ tenantId });
      if (tenant) {
        if (tenant.status === "expired" || new Date(tenant.expiresAt) <= new Date()) {
          return res.status(403).json({
            status: "error",
            message: "Your 48-hour demo store trial has expired. Contact support to activate your permanent store.",
          });
        }

        req.tenantId = tenantId;
        req.isDemoTenant = true;
        req.tenantDb = mongoose.connection.useDb(tenantId, { useCache: true });
        return next();
      }
    }

    req.tenantId = null;
    req.isDemoTenant = false;
    req.tenantDb = mongoose.connection;
    return next();
  } catch (error) {
    return next(error);
  }
};
