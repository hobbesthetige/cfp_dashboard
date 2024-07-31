import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import { getPhonebookData, updatePhonebookData } from "../models/phonebook.mjs";

const router = express.Router();

// Get endpoint
router.get("/phonebook", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const phonebook = await getPhonebookData();
  res.status(200).json(phonebook);
});

// Post endpoint for entries
router.post("/phonebook/entries/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const entry = req.body;
  const id = req.params.id;
  const phonebook = await getPhonebookData();
  phonebook.entries[id] = entry;
  await updatePhonebookData(phonebook);
  res.status(200).json(entry);
});

// Post endpoint for instructions
router.post("/phonebook/instructions/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const instruction = req.body;
  const id = req.params.id;
  const phonebook = await getPhonebookData();
  phonebook.instructions[id] = instruction;
  await updatePhonebookData(phonebook);
  res.status(200).json(instruction);
});

// Delete endpoint for entries
router.delete("/phonebook/entries/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = req.params.id;
  const phonebook = await getPhonebookData();
  phonebook.entries = phonebook.entries.filter((_, index) => index != id);
  await updatePhonebookData(phonebook);
  res.status(200).json({ id });
});

// Delete endpoint for instructions
router.delete("/phonebook/instructions/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = req.params.id;
  const phonebook = await getPhonebookData();
  phonebook.instructions = phonebook.instructions.filter(
    (_, index) => index != id
  );
  await updatePhonebookData(phonebook);
  res.status(200).json({ id });
});

// Put endpoint for entries
router.put("/phonebook/entries", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const entries = req.body;
  const phonebook = await getPhonebookData();
  phonebook.entries = entries;
  await updatePhonebookData(phonebook);
  res.status(200).json(phonebook);
});

// Put endpoint for instructions
router.put("/phonebook/instructions", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const instructions = req.body;
  const phonebook = await getPhonebookData();
  phonebook.instructions = instructions;
  await updatePhonebookData(phonebook);
  res.status(200).json(instructions);
});

export default router;
