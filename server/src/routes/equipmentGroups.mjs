import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import {
  addEquipmentGroup,
  getEquipmentGroups,
  updateEquipmentGroup,
  deleteEquipmentGroup,
} from "../models/equipment.mjs";
import { getEquipmentGroupsNamespace } from "../sockets/socketNamespaces.mjs";
import { get } from "http";
const router = express.Router();

// Get endpoint
router.get("/equipmentGroups", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const equipmentGroups = await getEquipmentGroups();
  res.status(200).json(equipmentGroups);
});

router.get("/equipmentGroups/serviceEnclaves", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const equipmentGroups = await getEquipmentGroups();
  const getUniqueEnclaves = (groups) => {
    const enclaves = groups.flatMap((group) =>
      group.services.map((service) => service.enclave)
    );
    return Array.from(new Set(enclaves));
  };
  const enclaves = getUniqueEnclaves(equipmentGroups);
  res.status(200).json(enclaves);
});

// Patch endpoint
router.patch("/equipmentGroups/:id", async (req, res) => {
  const { id } = req.params;
  const { newEquipmentGroup } = req.body;
  const equipmentGroups = await getEquipmentGroups();
  const equipmentGroup = equipmentGroups.find((group) => group.id === id);
  if (!equipmentGroup) {
    res.status(404).json({ message: "Equipment group not found" });
    return;
  }
  Object.assign(equipmentGroup, newEquipmentGroup);
  await updateEquipmentGroup(id, equipmentGroup);
  emitEquipmentGroupsUpdate();
  res.status(200).json(equipmentGroup);
});

router.patch(
  "/equipmentGroups/:groupID/services/:serviceID",
  async (req, res) => {
    const { groupID, serviceID } = req.params;
    const newService = req.body;
    const equipmentGroups = await getEquipmentGroups();
    const equipmentGroup = equipmentGroups.find(
      (group) => group.id === groupID
    );
    if (!equipmentGroup) {
      res.status(404).json({ message: "Equipment group not found" });
      return;
    }
    const service = equipmentGroup.services.find(
      (service) => service.id === serviceID
    );
    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }
    Object.assign(service, newService);
    await updateEquipmentGroup(groupID, equipmentGroup);
    emitEquipmentGroupsUpdate();
    res.status(200).json(newService);
  }
);

// Post endpoint
router.post("/equipmentGroups", async (req, res) => {
  const newEquipmentGroup = req.body;
  await addEquipmentGroup(newEquipmentGroup);
  emitEquipmentGroupsUpdate();
  res.status(200).json(newEquipmentGroup);
});

// Put endpoint
router.put("/equipmentGroups/:id", async (req, res) => {
  const { id } = req.params;
  const newEquipmentGroup = req.body;
  const equipmentGroups = await getEquipmentGroups();
  const equipmentGroup = equipmentGroups.find((group) => group.id === id);
  if (!equipmentGroup) {
    await addEquipmentGroup(newEquipmentGroup);
  } else {
    await updateEquipmentGroup(id, newEquipmentGroup);
  }
  emitEquipmentGroupsUpdate();
  res.status(200).json(newEquipmentGroup);
});

// Delete endpoint
router.delete("/equipmentGroups/:id", async (req, res) => {
  const { id } = req.params;
  await deleteEquipmentGroup(id);
  emitEquipmentGroupsUpdate();
  res.status(200).json({ message: "Equipment group deleted" });
});

async function emitEquipmentGroupsUpdate() {
  const equipmentGroupsNamespace = getEquipmentGroupsNamespace();
  const equipmentGroups = await getEquipmentGroups();
  equipmentGroupsNamespace.emit("equipmentGroups", equipmentGroups);
}

export default router;
