import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import { getPacePlanData, updatePacePlanData } from "../models/pacePlan.mjs";
const router = express.Router();

// Get endpoint
router.get("/pacePlan", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const pacePlan = await getPacePlanData();
  res.status(200).json(pacePlan);
});

export default router;
