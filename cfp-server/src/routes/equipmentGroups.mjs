import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import equipmentDB from "../models/equipment.mjs";
import { getEquipmentGroupsNamespace } from "../sockets/socketNamespaces.mjs";
const router = express.Router();

// Get endpoint
router.get("/equipmentGroups", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const equipmentGroups = equipmentDB.data.equipmentGroups;
  res.status(200).json(equipmentGroups);
});

router.get("/equipmentGroups/serviceEnclaves", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const getUniqueEnclaves = (groups) => {
    const enclaves = groups.flatMap((group) =>
      group.services.map((service) => service.enclave)
    );
    return Array.from(new Set(enclaves));
  };
  const enclaves = getUniqueEnclaves(equipmentDB.data.equipmentGroups);
  res.status(200).json(enclaves);
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
  emitEquipmentGroupsUpdate();
  res.status(200).json(equipmentGroup);
});

router.patch(
  "/equipmentGroups/:groupID/services/:serviceID",
  async (req, res) => {
    const { groupID, serviceID } = req.params;
    const newService = req.body;
    const equipmentGroup = equipmentDB.data.equipmentGroups.find(
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
    await equipmentDB.write();
    emitEquipmentGroupsUpdate();
    res.status(200).json(newService);
  }
);

// Post endpoint
router.post("/equipmentGroups", async (req, res) => {
  const newEquipmentGroup = req.body;
  equipmentDB.data.equipmentGroups.push(newEquipmentGroup);
  await equipmentDB.write();
  emitEquipmentGroupsUpdate();
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
  emitEquipmentGroupsUpdate();
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
  emitEquipmentGroupsUpdate();
  res.status(200).json({ message: "Equipment group deleted" });
});

function emitEquipmentGroupsUpdate() {
  const equipmentGroupsNamespace = getEquipmentGroupsNamespace();
  equipmentGroupsNamespace.emit(
    "equipmentGroups",
    equipmentDB.data.equipmentGroups
  );
}

export default router;
