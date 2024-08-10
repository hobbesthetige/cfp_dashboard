import { validateRequest } from "../middleware/validateRequest.mjs";
import {
  getDeviceBackups,
  addDeviceBackup,
  updateDeviceBackup,
  deleteDeviceBackup,
} from "../models/deviceBackup.mjs";

const router = express.Router();

// Get endpoint
router.get("/deviceBackups", async (req, res) => {
  if (!(await validateRequest(req, res))) {
    return;
  }
  const deviceBackups = await getDeviceBackups();
  res.status(200).json(deviceBackups);
});

// Patch endpoint
router.patch("/deviceBackups/:id", async (req, res) => {
  const { id } = req.params;
  const newBackup = req.body;
  const deviceBackups = await getDeviceBackups();
  const backup = deviceBackups.find((backup) => backup.id === id);
  if (!backup) {
    res.status(404).json({ message: "Backup not found" });
    return;
  }
  Object.assign(backup, newBackup);
  await updateDeviceBackup(id, backup);
  res.status(200).json(backup);
});

// Post endpoint
router.post("/deviceBackup", async (req, res) => {
  const newBackup = req.body;
  await addDeviceBackup(newBackup);
  res.status(201).json(newBackup);
});

// Delete endpoint
router.delete("/deviceBackups/:id", async (req, res) => {
  const { id } = req.params;
  const deviceBackups = await getDeviceBackups();
  const backup = deviceBackups.find((backup) => backup.id === id);
  if (!backup) {
    res.status(404).json({ message: "Backup not found" });
    return;
  }
  await deleteDeviceBackup(id);
  res.status(204).end();
});
