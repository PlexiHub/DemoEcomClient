// Intercepts restricted modification actions for Demo Client role with friendly upgrade message
export const demoRestrictionGuard = (req, res, next) => {
  if (req.user && req.user.role === "Demo Client") {
    return res.status(403).json({
      status: "fail",
      code: "DEMO_RESTRICTION",
      message: "You have to purchase this system to use it.",
    });
  }
  next();
};
