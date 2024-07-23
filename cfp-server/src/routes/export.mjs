import express from "express";
import { exportDB } from "../utils/exportUtil.mjs";
import { resetDB } from "../utils/resetUtil.mjs";
import { validateRequest } from "../middleware/validateRequest.mjs";
const router = express.Router();

// Export endpoint
router.post("/export", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const body = req.body;
  const data = exportDB(body);
  res.setHeader("Content-Type", "application/gzip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="data_export.json.gz"'
  );
  res.setHeader("Content-Length", data.length);
  res.send(data);
});

router.post("/reset", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const body = req.body;
  resetDB(body);
  res.status(200).json({ message: "Database reset successfully" });
});

export default router;
