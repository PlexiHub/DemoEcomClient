// Router for customer authentication and customer record management
import { Router } from "express";
import {
  createMember as createCustomer,
  getMemberById as getCustomerById,
  listMembers as listCustomers,
  updateMember as updateCustomer,
  deleteMember as deleteCustomer,
  registerMember as registerCustomer,
  verifyMemberOtp as verifyCustomerOtp,
  loginMember as loginCustomer,
  checkMemberEmail as checkCustomerEmail,
  resendMemberOtp as resendCustomerOtp,
  forgotPassword as forgotCustomerPassword,
  resetPassword as resetCustomerPassword,
  changeMemberPassword as changeCustomerPassword,
  refreshMemberToken as refreshCustomerToken,
  logoutMember as logoutCustomer,
} from "../controllers/MembersController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";

const customerRouter = Router();

// Public customer auth and email-verification flow
customerRouter.post("/register", registerCustomer);
customerRouter.post("/login", loginCustomer);
customerRouter.post("/check-email", checkCustomerEmail);
customerRouter.post("/refresh-token", refreshCustomerToken);
customerRouter.post("/logout", logoutCustomer);
customerRouter.post("/verify-otp", verifyCustomerOtp);
customerRouter.post("/resend-otp", resendCustomerOtp);
customerRouter.post("/forgot-password", forgotCustomerPassword);
customerRouter.post("/reset-password", resetCustomerPassword);

// Protected customer management endpoints
customerRouter.use(authenticateToken);
customerRouter.post("/", createCustomer);
customerRouter.get("/", listCustomers);
customerRouter.get("/:customerId", getCustomerById);
customerRouter.post("/:customerId/change-password", changeCustomerPassword);
customerRouter.put("/:customerId", updateCustomer);
customerRouter.delete("/:customerId", authorizeRoles("Owner", "Admin", "Manager"), deleteCustomer);

export default customerRouter;
