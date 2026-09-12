import { UserModel } from "../../models/user.model.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { createAccessToken, createRefreshToken } from "../../controllers/AuthController.js";
import { env } from "../../config/env.js";

// Registers a new user with Demo Client role and returns authentication tokens
export const registerDemoClient = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body || {};
    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanPhone = typeof phone === "string" ? phone.trim() : "";

    if (!cleanName || !normalizedEmail || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Name, email, and password are required.",
      });
    }

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "An account with this email address already exists.",
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await UserModel.create({
      name: cleanName,
      email: normalizedEmail,
      phone: cleanPhone,
      passwordHash,
      role: "Demo Client",
      isActive: true,
      twoFactorEnabled: false,
      lastLogin: new Date(),
    });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken();
    const refreshTokenExpiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_MS);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = refreshTokenExpiresAt;
    await user.save();

    const userJson = user.toJSON();

    return res.status(201).json({
      status: "success",
      message: "Demo account created successfully.",
      data: {
        user: userJson,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Returns operational parameters and demo mode capability flags
export const getDemoStatus = async (req, res, next) => {
  try {
    return res.json({
      status: "success",
      data: {
        isDemoMode: true,
        defaultClient: "demo",
        brandName: "Plexivia",
        capabilities: {
          products: { add: true, edit: true, delete: true },
          orders: { test: true, view: true },
          assets: { uploadLogo: true, view: true },
          customers: { view: true },
        },
        restrictions: {
          systemUsers: false,
          billingGateways: false,
          systemSettings: false,
          developerTools: false,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
