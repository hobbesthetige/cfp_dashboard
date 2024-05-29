import exp from "constants";
import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import placePlanDB from "../models/pacePlan.mjs";
const router = express.Router();

// Get endpoint
router.get("/pacePlan", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const pacePlan = placePlanDB.data;
  res.status(200).json(pacePlan);
});

export default router;
