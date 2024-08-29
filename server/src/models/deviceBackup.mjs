import { connectToMongo } from "../services/mongoService.mjs";

// Get the collection
async function getDeviceBackupCollection() {
  const db = await connectToMongo();
  return db.collection("deviceBackups");
}

// Reset data
export async function resetData() {
  const collection = await getDeviceBackupCollection();
  await collection.drop();
}

// Add device backup
export async function addDeviceBackup(backup) {
  const collection = await getDeviceBackupCollection();
  await collection.updateOne(
    {},
    { $push: { deviceBackups: backup } },
    { upsert: true }
  );
}

// Get all device backups
export async function getDeviceBackups() {
  const collection = await getDeviceBackupCollection();
  const data = await collection.findOne({});
  return data ? data.deviceBackups : [];
}

// Update device backup
export async function updateDeviceBackup(id, updateData) {
  const collection = await getDeviceBackupCollection();
  await collection.updateOne(
    { "deviceBackups.id": id },
    { $set: { "deviceBackups.$": updateData } }
  );
}

// Delete device backup
export async function deleteDeviceBackup(id) {
  const collection = await getDeviceBackupCollection();
  await collection.updateOne({}, { $pull: { deviceBackups: { id } } });
}

export default {
  resetData,
  addDeviceBackup,
  getDeviceBackups,
  updateDeviceBackup,
  deleteDeviceBackup,
};
