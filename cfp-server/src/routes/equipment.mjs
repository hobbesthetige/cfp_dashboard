import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import equipmentDB from "../models/equipment.mjs";
const router = express.Router();

// Get endpoint
router.get("/equipmentGroups/:id/equipment", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const { id } = req.params;
  const equipmentGroup = equipmentDB.data.equipmentGroups.find(
    (group) => group.id === id
  );
  if (!equipmentGroup) {
    res.status(404).json({ message: "Equipment group not found" });
    return;
  }
  res.status(200).json(equipmentGroup.equipment);
});

// Patch endpoint
router.patch(
  "/equipmentGroups/:id/equipment/:equipmentId",
  async (req, res) => {
    const { id, equipmentId } = req.params;
    const newEquipment = req.body;
    const equipmentGroup = equipmentDB.data.equipmentGroups.find(
      (group) => group.id === id
    );
    if (!equipmentGroup) {
      res.status(404).json({ message: "Equipment group not found" });
      return;
    }
    const equipment = equipmentGroup.equipment.find(
      (item) => item.id === equipmentId
    );
    if (!equipment) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }
    Object.assign(equipment, newEquipment);
    await equipmentDB.write();
    res.status(200).json(equipment);
  }
);

// Post endpoint
router.post("/equipmentGroups/:id/equipment", async (req, res) => {
  const { id } = req.params;
  const newEquipment = req.body;
  const equipmentGroup = equipmentDB.data.equipmentGroups.find(
    (group) => group.id === id
  );
  if (!equipmentGroup) {
    res.status(404).json({ message: "Equipment group not found" });
    return;
  }

  equipmentGroup.equipment.push(newEquipment);
  await equipmentDB.write();
  res.status(200).json(newEquipment);
});

// Delete endpoint
router.delete(
  "/equipmentGroups/:id/equipment/:equipmentId",
  async (req, res) => {
    const { id, equipmentId } = req.params;
    const equipmentGroup = equipmentDB.data.equipmentGroups.find(
      (group) => group.id === id
    );
    if (!equipmentGroup) {
      res.status(404).json({ message: "Equipment group not found" });
      return;
    }
    const equipmentIndex = equipmentGroup.equipment.findIndex(
      (item) => item.id === equipmentId
    );
    if (equipmentIndex === -1) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }
    equipmentGroup.equipment.splice(equipmentIndex, 1);
    await equipmentDB.write();
    res.status(200).json({ message: "Equipment deleted" });
  }
);

export default router;
