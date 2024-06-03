import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import equipmentDB from "../models/equipment.mjs";
const router = express.Router();

// Get endpoint
router.get("/equipmentGroups", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const equipmentGroups = equipmentDB.data.equipmentGroups;
  res.status(200).json(equipmentGroups);
});

// Patch endpoint
router.patch("/equipmentGroups/:id", async (req, res) => {
  const { id } = req.params;
  const { newEquipmentGroup } = req.body;
  const equipmentGroup = equipmentDB.data.equipmentGroups.find(
    (group) => group.id === id
  );
  if (!equipmentGroup) {
    res.status(404).json({ message: "Equipment group not found" });
    return;
  }
  Object.assign(equipmentGroup, newEquipmentGroup);
  await equipmentDB.write();
  res.status(200).json(equipmentGroup);
});

// Post endpoint
router.post("/equipmentGroups", async (req, res) => {
  const newEquipmentGroup = req.body;
  equipmentDB.data.equipmentGroups.push(newEquipmentGroup);
  await equipmentDB.write();
  res.status(200).json(newEquipmentGroup);
});

// Put endpoint
router.put("/equipmentGroups/:id", async (req, res) => {
  const { id } = req.params;
  const newEquipmentGroup = req.body;
  const index = equipmentDB.data.equipmentGroups.findIndex(
    (group) => group.id === id
  );
  if (index === -1) {
    equipmentDB.data.equipmentGroups.push(newEquipmentGroup);
  } else {
    equipmentDB.data.equipmentGroups[index] = newEquipmentGroup;
  }
  await equipmentDB.write();
  res.status(200).json(newEquipmentGroup);
});

// Delete endpoint
router.delete("/equipmentGroups/:id", async (req, res) => {
  const { id } = req.params;
  const index = equipmentDB.data.equipmentGroups.findIndex(
    (group) => group.id === id
  );
  if (index === -1) {
    res.status(404).json({ message: "Equipment group not found" });
    return;
  }
  equipmentDB.data.equipmentGroups.splice(index, 1);
  await equipmentDB.write();
  res.status(200).json({ message: "Equipment group deleted" });
});

export default router;
