import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = {
  equipmentHistory: [],
  equipmentGroups: [],
};

// Get the collection
async function getEquipmentCollection() {
  const db = await connectToMongo();
  return db.collection("equipment");
}

// Reset data
export async function resetData() {
  const collection = await getEquipmentCollection();
  await collection.drop();
}

// Add equipment history entry
export async function addEquipmentHistoryEntry(entry) {
  const collection = await getEquipmentCollection();
  await collection.updateOne(
    {},
    { $push: { equipmentHistory: entry } },
    { upsert: true }
  );
}

// Get all equipment history entries
export async function getEquipmentHistory() {
  const collection = await getEquipmentCollection();
  const data = await collection.findOne({});
  return data ? data.equipmentHistory : [];
}

// Add equipment group
export async function addEquipmentGroup(group) {
  const collection = await getEquipmentCollection();
  await collection.updateOne(
    {},
    { $push: { equipmentGroups: group } },
    { upsert: true }
  );
}

// Get all equipment groups
export async function getEquipmentGroups() {
  const collection = await getEquipmentCollection();
  const data = await collection.findOne({});
  return data ? data.equipmentGroups : [];
}

// Update equipment group
export async function updateEquipmentGroup(id, updateData) {
  const collection = await getEquipmentCollection();
  await collection.updateOne(
    { "equipmentGroups.id": id },
    { $set: { "equipmentGroups.$": updateData } }
  );
}

// Delete equipment group
export async function deleteEquipmentGroup(id) {
  const collection = await getEquipmentCollection();
  await collection.updateOne({}, { $pull: { equipmentGroups: { id: id } } });
}

export default {
  resetData,
  addEquipmentHistoryEntry,
  getEquipmentHistory,
  addEquipmentGroup,
  getEquipmentGroups,
  updateEquipmentGroup,
  deleteEquipmentGroup,
};
