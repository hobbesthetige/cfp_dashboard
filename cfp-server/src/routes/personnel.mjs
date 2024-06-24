import express from "express";
import { validateRequest } from "../middleware/validateRequest.mjs";
import personnelDB from "../models/personnel.mjs";
import { getPersonnelLocationsNamespace } from "../sockets/socketNamespaces.mjs";

const router = express.Router();

// Get endpoint
router.get("/personnel", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const personnel = personnelDB.data.personnel;
  res.status(200).json(personnel);
});

router.post("/personnel", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const newPersonnel = req.body;
  personnelDB.data.personnel.push(newPersonnel);
  personnelDB.write();
  res.status(201).json(newPersonnel);
});

router.put("/personnel/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }

  const updatedPersonnel = req.body;
  const personnelIndex = personnelDB.data.personnel.findIndex(
    (person) => person.id === updatedPersonnel.id
  );
  if (personnelIndex === -1) {
    res.status(404).send("Personnel not found");
    return;
  }
  personnelDB.data.personnel[personnelIndex] = updatedPersonnel;
  personnelDB.write();
  res.status(200).json(updatedPersonnel);
});

router.get("/personnel/locations", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const locations = personnelDB.data.locations;
  res.status(200).json(locations);
});

router.post("/personnel/locations/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = req.params.id;
  const locationIndex = personnelDB.data.locations.findIndex(
    (location) => location.personnelId === id
  );
  if (locationIndex !== -1) {
    const updatedLocation = req.body;
    personnelDB.data.locations[locationIndex] = updatedLocation;
    personnelDB.write();
    res.status(200).json(updatedLocation);
    getPersonnelLocationsNamespace().emit("locationUpdate", updatedLocation);
  } else {
    const newLocation = req.body;
    personnelDB.data.locations.push(newLocation);
    personnelDB.write();
    res.status(201).json(newLocation);
    getPersonnelLocationsNamespace().emit("addLocation", newLocation);
  }
});

router.delete("/personnel/locations/:id", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const id = req.params.id;
  const locationIndex = personnelDB.data.locations.findIndex(
    (location) => location.personnelId === id
  );
  if (locationIndex === -1) {
    res.status(404).send("Location not found");
    return;
  }
  personnelDB.data.locations.splice(locationIndex, 1);
  personnelDB.write();
  res.status(204).send();
  getPersonnelLocationsNamespace().emit("deleteLocation", id);
});

export default router;
