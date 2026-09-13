import mongoose from "mongoose";
import { TenantModel } from "../models/tenant.model.js";
import { logger } from "../config/logger.js";

let cleanupTimer = null;

// Executes cleanup query and drops databases for all expired demo tenants
export const runTenantCleanup = async () => {
  try {
    const expiredTenants = await TenantModel.find({
      status: "active",
      expiresAt: { $lte: new Date() },
    });

    if (!expiredTenants || expiredTenants.length === 0) {
      return { cleanedCount: 0 };
    }

    logger.info(`[TenantCleanup] Found ${expiredTenants.length} expired demo sandbox(es) to prune`);

    for (const tenant of expiredTenants) {
      try {
        if (tenant.tenantId && tenant.tenantId.startsWith("demo_")) {
          const tenantDb = mongoose.connection.useDb(tenant.tenantId);
          await tenantDb.dropDatabase();
          logger.info(`[TenantCleanup] Successfully dropped database: ${tenant.tenantId}`);
        }

        tenant.status = "expired";
        await tenant.save();
      } catch (dropErr) {
        logger.error(`[TenantCleanup] Failed to drop database for ${tenant.tenantId}: ${dropErr.message}`);
      }
    }

    return { cleanedCount: expiredTenants.length };
  } catch (error) {
    logger.error(`[TenantCleanup] Error during scheduled cleanup: ${error.message}`);
    return { cleanedCount: 0, error: error.message };
  }
};

// Initializes recurring background timer to prune expired 48-hour demo databases
export const initTenantCleanupScheduler = () => {
  const checkIntervalMs = 60 * 60 * 1000;

  logger.info("[TenantCleanup] Initializing 48-hour demo sandbox auto-cleanup scheduler");

  setTimeout(() => {
    runTenantCleanup().catch((err) => {
      logger.error(`[TenantCleanup] Initial run error: ${err.message}`);
    });
  }, 30 * 1000);

  cleanupTimer = setInterval(() => {
    runTenantCleanup().catch((err) => {
      logger.error(`[TenantCleanup] Hourly run error: ${err.message}`);
    });
  }, checkIntervalMs);
};
