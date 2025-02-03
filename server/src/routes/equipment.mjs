import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import {
  addEquipmentItem,
  deleteEquipmentItem,
  getEquipmentItemById,
  getEquipmentItems,
  getEquipmentItemsByGroupId,
  updateEquipmentItem,
} from "../models/equipment.mjs";
const router = express.Router();

// Get endpoint

router.get("/equipmentGroups/equipment", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const equipmentItems = await getEquipmentItems();
  res.status(200).json(equipmentItems);
});

router.get("/equipmentGroups/:id/equipment", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const { id } = req.params;
  const equipmentGroupItems = await getEquipmentItemsByGroupId(id);
  if (!equipmentGroupItems) {
    res.status(200).json([]);
  }
  res.status(200).json(equipmentGroupItems);
});

// Get Equipment Item endpoint
router.get("/equipmentGroups/:id/equipment/:equipmentId", async (req, res) => {
  const { equipmentId } = req.params;
  const equipment = await getEquipmentItemById(equipmentId);
  if (!equipment) {
    res.status(404).json({ message: "Equipment not found" });
    return;
  }
  res.status(200).json(equipment);
});

// Patch endpoint
router.patch(
  "/equipmentGroups/:id/equipment/:equipmentId",
  async (req, res) => {
    const { equipmentId } = req.params;
    await updateEquipmentItem(equipmentId, req.body);
    res.status(200).json(equipment);
  }
);

router.put("/equipmentGroups/:id/equipment/:equipmentId", async (req, res) => {
  const { equipmentId } = req.params;
  await updateEquipmentItem(equipmentId, req.body);
  res.status(200).json(req.body);
});

// Post Item endpoint
router.post("/equipmentGroups/equipment", async (req, res) => {
  await addEquipmentItem(req.body);
  res.status(200).json(req.body);
});

// Delete endpoint
router.delete(
  "/equipmentGroups/:id/equipment/:equipmentId",
  async (req, res) => {
    const { equipmentId } = req.params;
    await deleteEquipmentItem(equipmentId);
    res.status(200).json({ message: "Equipment deleted" });
  }
);

export default router;
