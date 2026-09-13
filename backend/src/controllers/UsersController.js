import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { UserModel } from "../models/user.model.js";
import { AssetModel } from "../models/asset.model.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { env } from "../config/env.js";
import { renderUserInviteEmail } from "../templates/userInviteEmailTemplate.js";
import {
  validateCreateUserPayload,
  validateUpdateUserPayload,
} from "../helper/userControllerHelper.js";

let defaultTransport;

// Dynamically retrieve or initialize SMTP transport
const getTransport = () => {
  if (!defaultTransport) {
    const isSecure =
      Number(env.SMTP_PORT) === 465 ||
      String(env.SMTP_ENCRYPTION).toLowerCase() === "ssl";

    defaultTransport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: isSecure,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return defaultTransport;
};

// List all users in the system.
export const listUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find().lean();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

// Fetch a single user record by id.
export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).lean();
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

// Create a new user / send invitation with role-aware permission checks
export const createUser = async (req, res, next) => {
  try {
    const payload = req.body ?? {};
    const validationErrors = validateCreateUserPayload(payload);
    if (validationErrors.length > 0) {
      return res.status(400).json({ status: "error", message: "Invalid user payload", errors: validationErrors });
    }

    // If creator is Admin, they cannot create Owner or Admin accounts
    const creatorRole = req.user?.role || null;
    if (creatorRole === "Admin" && (payload.role === "Owner" || payload.role === "Admin")) {
      return res.status(403).json({ status: "error", message: "Insufficient permissions to create this role" });
    }

    const email = payload.email.toLowerCase().trim();
    const existing = await UserModel.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(409).json({ status: "error", message: "A user with this email already exists" });
      }
    }

    // Generate secure invite token
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteTokenExpiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days

    let passwordHash = null;
    if (payload.password && payload.password.trim()) {
      passwordHash = await hashPassword(payload.password.trim());
    }

    let user;
    if (existing && !existing.isActive) {
      existing.name = payload.name.trim();
      existing.role = payload.role || existing.role;
      existing.inviteToken = inviteToken;
      existing.inviteTokenExpiresAt = inviteTokenExpiresAt;
      if (passwordHash) existing.passwordHash = passwordHash;
      await existing.save();
      user = existing;
    } else {
      user = await UserModel.create({
        name: payload.name.trim(),
        email,
        phone: payload.phone ? payload.phone.trim() : "",
        role: payload.role || "Marketing Expert",
        passwordHash,
        inviteToken,
        inviteTokenExpiresAt,
        isActive: Boolean(passwordHash), // Active if password explicitly provided, otherwise pending activation
        createdBy: req.user?.userId || null,
      });
    }

    // Resolve white-label domain for invitation link
    const origin = req.headers.origin || req.headers.referer || "";
    let domainUrl = "https://decantrebd.com";
    if (payload.domain) {
      domainUrl = payload.domain.startsWith("http") ? payload.domain : `https://${payload.domain}`;
    } else if (origin) {
      try {
        domainUrl = new URL(origin).origin;
      } catch (_) {}
    }
    const inviteUrl = `${domainUrl.replace(/\/$/, "")}/invite?token=${inviteToken}`;

    // Send invitation email if SMTP configured
    if (env.SMTP_USER && env.SMTP_PASSWORD) {
      try {
        const transport = getTransport();
        const brandName = env.SMTP_FROM_NAME || "Store Team";
        await transport.sendMail({
          from: `"${brandName}" <${env.SMTP_FROM || env.SMTP_USER}>`,
          to: user.email,
          subject: `You're invited to join ${brandName} as ${user.role}`,
          html: renderUserInviteEmail({
            name: user.name,
            role: user.role,
            inviteUrl,
            brandName,
          }),
        });
      } catch (mailErr) {
        console.error("[UsersController] Failed to send invitation email:", mailErr);
      }
    }

    res.status(201).json({
      status: "success",
      message: "User invited successfully. Invitation link sent via email.",
      data: user,
      inviteUrl,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing user while enforcing role-based restrictions.
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const payload = req.body ?? {};
    const validationErrors = validateUpdateUserPayload(payload);
    if (validationErrors.length > 0) {
      return res.status(400).json({ status: "error", message: "Invalid user payload", errors: validationErrors });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    // If updater is Admin, prevent modifying Owner accounts
    const updaterRole = req.user?.role || null;
    if (updaterRole === "Admin" && user.role === "Owner") {
      return res.status(403).json({ status: "error", message: "Insufficient permissions to modify this user" });
    }

    if (payload.email && payload.email.toLowerCase().trim() !== user.email) {
      const emailExists = await UserModel.findOne({ email: payload.email.toLowerCase().trim() });
      if (emailExists) return res.status(409).json({ status: "error", message: "A user with this email already exists" });
    }

    user.name = payload.name.trim();
    user.email = payload.email.toLowerCase().trim();
    user.phone = payload.phone.trim();
    user.role = payload.role || user.role;
    user.isActive = payload.isActive !== undefined ? Boolean(payload.isActive) : user.isActive;

    if (payload.password) {
      user.passwordHash = await hashPassword(payload.password);
    }

    if (payload.role === "Employee" && payload.assets) {
      const assignedAssets = Array.isArray(payload.assets) ? payload.assets : [];
      if (assignedAssets.length > 2) {
        return res.status(400).json({ status: "error", message: "An employee may have at most 2 assets assigned" });
      }
      const found = await AssetModel.find({ did: { $in: assignedAssets } }).lean();
      if (found.length !== assignedAssets.length) {
        return res.status(400).json({ status: "error", message: "One or more assigned assets not found" });
      }
      user.assets = assignedAssets;
    }

    await user.save();

    res.json({ status: "success", data: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// Delete a user and prevent unsafe admin/self-deletion cases.
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user?.userId;
    const requesterRole = req.user?.role;

    const user = await UserModel.findById(userId).lean();
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    // Admin cannot delete their own account
    if (requesterRole === "Admin" && requesterId === String(user._id)) {
      return res.status(403).json({ status: "error", message: "Admin cannot delete own account" });
    }

    // Admin cannot delete Owner
    if (requesterRole === "Admin" && user.role === "Owner") {
      return res.status(403).json({ status: "error", message: "Insufficient permissions to delete this user" });
    }

    await UserModel.findByIdAndDelete(userId);
    res.json({ status: "success", message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Retrieves personal profile details for authenticated user
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const user = await UserModel.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    res.json({
      status: "success",
      data: {
        id: user._id ? user._id.toString() : user.id,
        did: user.did,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Updates personal profile information and credentials for authenticated user
export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const { name, phone, avatar, email, currentPassword, newPassword } = req.body ?? {};

    const user = await UserModel.findById(userId).select("+passwordHash");
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    if (avatar !== undefined) {
      user.avatar = String(avatar).trim();
    }

    if (typeof email === "string" && email.trim().toLowerCase() !== user.email) {
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await UserModel.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return res.status(409).json({ status: "error", message: "Email is already registered by another user" });
      }
      user.email = normalizedEmail;
    }

    if (newPassword && newPassword.trim()) {
      if (!user.passwordHash) {
        user.passwordHash = await hashPassword(newPassword.trim());
      } else {
        if (!currentPassword) {
          return res.status(400).json({ status: "error", message: "Current password is required to change password" });
        }
        const isMatch = await comparePassword(currentPassword, user.passwordHash);
        if (!isMatch) {
          return res.status(400).json({ status: "error", message: "Current password does not match" });
        }
        if (newPassword.trim().length < 6) {
          return res.status(400).json({ status: "error", message: "New password must be at least 6 characters long" });
        }
        user.passwordHash = await hashPassword(newPassword.trim());
      }
    }

    await user.save();

    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        id: user._id.toString(),
        did: user.did,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: user.avatar || "",
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

