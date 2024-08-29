import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import { getPersonnelData, updatePersonnelData } from "../models/personnel.mjs";
import { getPersonnelLocationsNamespace } from "../sockets/socketNamespaces.mjs";

const router = express.Router();

// Get endpoint
router.get("/personnel", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const personnel = await getPersonnelData();
  res.status(200).json(personnel.personnel);
});

router.post("/personnel", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const newPersonnel = req.body;
  const personnel = await getPersonnelData();
  personnel.personnel.push(newPersonnel);
  await updatePersonnelData(personnel);
  res.status(201).json(newPersonnel);
});

router.put("/personnel/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }

  const updatedPersonnel = req.body;
  const personnelDB = await getPersonnelData();
  const personnelIndex = personnelDB.personnel.findIndex(
    (person) => person.id === updatedPersonnel.id
  );
  if (personnelIndex === -1) {
    res.status(404).send("Personnel not found");
    return;
  }
  personnelDB.personnel[personnelIndex] = updatedPersonnel;
  await updatePersonnelData(personnelDB);
  res.status(200).json(updatedPersonnel);
});

router.get("/personnel/locations", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const personnelDB = await getPersonnelData();
  const locations = personnelDB.locations;
  res.status(200).json(locations);
});

router.post("/personnel/locations/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = req.params.id;
  const personnelDB = await getPersonnelData();
  const locationIndex = personnelDB.locations.findIndex(
    (location) => location.personnelId === id
  );
  if (locationIndex !== -1) {
    const updatedLocation = req.body;
    personnelDB.locations[locationIndex] = updatedLocation;
    await updatePersonnelData(personnelDB);
    res.status(200).json(updatedLocation);
    getPersonnelLocationsNamespace().emit("locationUpdate", updatedLocation);
  } else {
    const newLocation = req.body;
    personnelDB.locations.push(newLocation);
    await updatePersonnelData(personnelDB);
    res.status(201).json(newLocation);
    getPersonnelLocationsNamespace().emit("addLocation", newLocation);
  }
});

router.delete("/personnel/locations/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = req.params.id;
  const personnelDB = await getPersonnelData();
  const locationIndex = personnelDB.locations.findIndex(
    (location) => location.personnelId === id
  );
  if (locationIndex === -1) {
    res.status(404).send("Location not found");
    return;
  }
  personnelDB.locations.splice(locationIndex, 1);
  await updatePersonnelData(personnelDB);
  res.status(204).send();
  getPersonnelLocationsNamespace().emit("deleteLocation", id);
});

export default router;
