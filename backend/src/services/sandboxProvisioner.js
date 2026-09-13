import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parses a string or object into a valid MongoDB ObjectId
const parseObjectId = (val) => {
  if (!val) return null;
  if (val instanceof mongoose.Types.ObjectId) return val;
  if (typeof val === "string" && mongoose.Types.ObjectId.isValid(val)) {
    return new mongoose.Types.ObjectId(val);
  }
  if (typeof val === "object" && val._id) {
    return parseObjectId(val._id);
  }
  return null;
};

// Provisions a fresh isolated database sandbox for a demo client on the shared MongoDB instance
export const provisionTenantSandbox = async (tenantDb, ownerData) => {
  try {
    const db = tenantDb.db || tenantDb;

    const categoriesFile = path.resolve(process.cwd(), "data/demoCategories.json");
    if (fs.existsSync(categoriesFile)) {
      const raw = JSON.parse(fs.readFileSync(categoriesFile, "utf8"));
      const catList = raw.data || raw;
      if (Array.isArray(catList) && catList.length > 0) {
        const catCol = db.collection("categories");
        const docs = catList.map((c) => {
          const doc = { ...c };
          if (doc._id) doc._id = parseObjectId(doc._id) || new mongoose.Types.ObjectId();
          doc.parent = doc.parent ? parseObjectId(doc.parent) : null;
          doc.createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();
          doc.updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : new Date();
          return doc;
        });
        await catCol.insertMany(docs);
      }
    }

    const productsFile = path.resolve(process.cwd(), "data/demoProducts.json");
    if (fs.existsSync(productsFile)) {
      const raw = JSON.parse(fs.readFileSync(productsFile, "utf8"));
      const prodList = raw.data || raw;
      if (Array.isArray(prodList) && prodList.length > 0) {
        const prodCol = db.collection("products");
        const docs = prodList.map((p) => {
          const doc = { ...p };
          if (doc._id || doc.id) {
            doc._id = parseObjectId(doc._id || doc.id) || new mongoose.Types.ObjectId();
          }
          if (Array.isArray(doc.categories)) {
            doc.categories = doc.categories.map((cat) => {
              const cDoc = { ...cat };
              if (cDoc._id) cDoc._id = parseObjectId(cDoc._id) || new mongoose.Types.ObjectId();
              if (cDoc.parent) cDoc.parent = parseObjectId(cDoc.parent);
              return cDoc;
            });
          }
          doc.createdAt = doc.createdAt ? new Date(doc.createdAt) : new Date();
          doc.updatedAt = doc.updatedAt ? new Date(doc.updatedAt) : new Date();
          return doc;
        });
        await prodCol.insertMany(docs);
      }
    }

    const usersCol = db.collection("users");
    await usersCol.insertOne({
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone || "",
      passwordHash: ownerData.passwordHash,
      role: "Owner",
      isActive: true,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    logger.error(`[SandboxProvisioner] Error provisioning tenant sandbox: ${error.message}`);
    throw error;
  }
};
