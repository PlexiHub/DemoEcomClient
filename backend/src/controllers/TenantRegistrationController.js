import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { TenantModel } from "../models/tenant.model.js";
import { UserModel } from "../models/user.model.js";
import { hashPassword } from "../utils/password.js";
import { generateDid } from "../utils/generateDid.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { provisionTenantSandbox } from "../services/sandboxProvisioner.js";

// Sanitizes a store name into a valid MongoDB database identifier
const sanitizeDbName = (name) => {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 20);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `demo_${clean || "store"}_${randomSuffix}`;
};

// Handles onboarding registration of a new 48-hour demo store client
export const registerDemoClient = async (req, res, next) => {
  try {
    const { storeName, name, email, phone, password, theme } = req.body ?? {};
    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";

    if (!storeName || !name || !normalizedEmail || !password) {
      return res.status(400).json({
        status: "error",
        message: "Store name, owner name, email, and password are required.",
      });
    }

    const existingMasterUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingMasterUser) {
      return res.status(409).json({
        status: "error",
        message: "This email address is already registered as an administrator. Please log in directly.",
      });
    }

    const existingTenant = await TenantModel.findOne({ email: normalizedEmail, status: "active" });
    if (existingTenant) {
      return res.status(409).json({
        status: "error",
        message: "An active demo sandbox is already associated with this email.",
      });
    }

    const tenantId = sanitizeDbName(storeName);
    const passwordHash = await hashPassword(password);
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const tenantDb = mongoose.connection.useDb(tenantId);

    await provisionTenantSandbox(tenantDb, {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : "",
      passwordHash,
    });

    const tenantRecord = await TenantModel.create({
      tenantId,
      storeName: storeName.trim(),
      ownerName: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : "",
      theme: theme || "luxury-1",
      dbName: tenantId,
      role: "Demo Client",
      status: "active",
      expiresAt,
    });

    await UserModel.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          name: name.trim(),
          email: normalizedEmail,
          phone: phone ? phone.trim() : "",
          passwordHash,
          role: "Demo Client",
          isActive: true,
          twoFactorEnabled: false,
        },
        $setOnInsert: {
          did: generateDid(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const tokenPayload = {
      userId: tenantRecord.id,
      tenantId,
      role: "Demo Client",
      email: normalizedEmail,
      storeName: tenantRecord.storeName,
    };

    const accessToken = jwt.sign(tokenPayload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: "48h",
    });

    logger.info(`[TenantOnboarding] Successfully provisioned new demo sandbox: ${tenantId} for ${normalizedEmail}`);

    return res.status(201).json({
      status: "success",
      message: "Demo store provisioned successfully. Your 48-hour sandbox is ready.",
      data: {
        accessToken,
        tenantId,
        storeName: tenantRecord.storeName,
        expiresAt,
        user: {
          name: tenantRecord.ownerName,
          email: tenantRecord.email,
          role: "Demo Client",
        },
      },
    });
  } catch (error) {
    logger.error(`[TenantOnboarding] Registration failure: ${error.message}`);
    next(error);
  }
};
