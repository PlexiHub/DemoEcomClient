// Protects demo client sandboxes from resource exhaustion and enforces quotas
export const demoQuotaGuard = (resourceType) => {
  return async (req, res, next) => {
    if (!req.isDemoTenant || !req.tenantDb) {
      return next();
    }

    try {
      const db = req.tenantDb.db || req.tenantDb;

      if (resourceType === "products" && req.method === "POST") {
        const count = await db.collection("products").countDocuments();
        if (count >= 25) {
          return res.status(403).json({
            status: "error",
            message: "Demo Sandbox Limit Reached: You can create a maximum of 25 products in the demo environment.",
          });
        }
      }

      if (resourceType === "orders" && req.method === "POST") {
        const count = await db.collection("orders").countDocuments();
        if (count >= 50) {
          return res.status(403).json({
            status: "error",
            message: "Demo Sandbox Limit Reached: You can create a maximum of 50 test orders in the demo environment.",
          });
        }
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
