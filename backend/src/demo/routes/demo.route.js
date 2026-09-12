// Router definitions for public demo registration and demo status endpoints
import { Router } from "express";
import { registerDemoClient, getDemoStatus } from "../controllers/demoAuth.controller.js";

const demoRouter = Router();

demoRouter.post("/register", registerDemoClient);
demoRouter.get("/status", getDemoStatus);

export default demoRouter;
