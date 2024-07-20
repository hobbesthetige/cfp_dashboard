import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import phonebookDB from "../models/phonebook.mjs";

const router = express.Router();

// Get endpoint
router.get("/phonebook", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const phonebook = phonebookDB.data;
  res.status(200).json(phonebook);
});

// Post endpoint
router.post("/phonebook/entries/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const entry = req.body;
  const id = req.params.id;
  phonebookDB.data.entries[id] = entry;
  await phonebookDB.write();
  res.status(200).json(entry);
});

router.post("/phonebook/instructions/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const instruction = req.body;
  const id = req.params.id;
  phonebookDB.data.instructions[id] = instruction;
  await phonebookDB.write();
  res.status(200).json(instruction);
});

// Delete endpoint
router.delete("/phonebook/entries/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = req.params.id;
  delete phonebookDB.data.entries[id];
  await phonebookDB.write();
  res.status(200).json({ id });
});

router.delete("/phonebook/instructions/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = req.params.id;
  delete phonebookDB.data.instructions[id];
  await phonebookDB.write();
  res.status(200).json({ id });
});

// Put endpoint
router.put("/phonebook/entries", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const phonebook = req.body;
  phonebookDB.data.entries = phonebook;
  await phonebookDB.write();
  res.status(200).json(phonebook);
});

router.put("/phonebook/instructions", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const instructions = req.body;
  phonebookDB.data.instructions = instructions;
  await phonebookDB.write();
  res.status(200).json(instructions);
});

export default router;
