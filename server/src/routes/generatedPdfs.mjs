import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import {
  getGeneratedPdf,
  getGeneratedPdfs,
  addGeneratedPdf,
} from "../models/generatedPdfs.mjs";
import { generatePDF } from "../services/pdfGenerators/mslService.mjs";
const router = express.Router();

// Get endpoint
router.post("/makeMSL", async (req, res) => {
  const params = req.body;
  const entry = { params: params, status: "submitted" };
  const id = await addGeneratedPdf(entry);
  if (!id) {
    res.status(500).json({ message: "Error creating MSL PDF" });
    return;
  }
  console.log("MSL PDF generation started", id);
  generatePDF(id, params);
  res.status(200).json({
    message: "MSL PDF generation started",
    id: id,
    status: "submitted",
  });
});

router.get("/generatedPdfs", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const generatedPdfs = await getGeneratedPdfs();
  res.status(200).json(generatedPdfs);
});

router.get("/generatedPdfs/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const { id } = req.params;
  const pdf = await getGeneratedPdf(id);
  if (!pdf) {
    res.status(404).json({ message: "Generated PDF not found" });
    return;
  }
  res.status(200).json(pdf);
});

router.get("/generatedPdfs/:id/download", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const { id } = req.params;
  const pdfs = await getGeneratedPdfs();
  const pdf = await getGeneratedPdf(id);
  console.log("Downloading PDF", id, pdf, pdfs);
  if (!pdf) {
    res.status(404).json({ message: "Generated PDF not found" });
    return;
  }
  res.download(pdf.filepath);
});

// Post endpoint
router.post("/generatedPdf", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const params = req.body;
  const id = addGeneratedPdf();
  res.status(201).json({ id: id, status: "submitted" });
});

export default router;
