import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import {
  addEquipmentGroup,
  getEquipmentGroups,
  getEquipmentGroupById,
  getEquipmentItemsByGroupId,
  updateEquipmentGroup,
  deleteEquipmentGroup,
} from "../models/equipment.mjs";
import { getEquipmentGroupsNamespace } from "../sockets/socketNamespaces.mjs";
const router = express.Router();

// Get endpoint
router.get("/equipmentGroups", async (req, res) => {
  try {
    const includeItems = req.query.includeItems === "true"; // Convert to boolean

    if (!(await validateRequest(req, res))) {
      return;
    }

    const equipmentGroups = await getEquipmentGroups();

    if (includeItems) {
      // Fetch items for each equipment group in parallel for efficiency
      await Promise.all(
        equipmentGroups.map(async (group) => {
          group.equipment = await getEquipmentItemsByGroupId(group.id);
        })
      );
    }

    res.status(200).json(equipmentGroups);
  } catch (error) {
    console.error("Error fetching equipment groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/equipmentGroups/:id", async (req, res) => {
  console.log(`Received request for equipment group ID: ${req.params.id}`);

  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = decodeURIComponent(req.params.id);
  const equipmentGroup = await getEquipmentGroupById(id);
  if (!equipmentGroup) {
    res.status(404).json({ message: "Equipment group not found" });
    return;
  }
  res.status(200).json(equipmentGroup);
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
