import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = {
  equipmentHistory: [],
  equipmentGroups: [],
  equipmentItems: [],
};

// Get the collection
async function getEquipmentCollection() {
  const db = await connectToMongo();
  return db.collection("equipment");
}

async function getEquipmentItemsCollection() {
  const db = await connectToMongo();
  return db.collection("equipmentItems");
}

// Reset data
export async function resetData() {
  const groupCollection = await getEquipmentCollection();
  await groupCollection.drop();
  const itemCollection = await getEquipmentItemsCollection();
  await itemCollection.drop();
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

// Add equipment item
export async function addEquipmentItem(item) {
  const collection = await getEquipmentItemsCollection();
  await collection.updateOne(
    {},
    { $push: { equipmentItems: item } },
    { upsert: true }
  );
}

// Get all equipment history entries
export async function getEquipmentHistory() {
  const collection = await getEquipmentCollection();
  const data = await collection.findOne({});
  return data ? data.equipmentHistory : [];
}

// Get all equipment items
export async function getEquipmentItems() {
  const collection = await getEquipmentItemsCollection();
  const data = await collection.findOne({});
  return data ? data.equipmentItems : [];
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

// Get equipment group by ID
export async function getEquipmentGroupById(id) {
  const collection = await getEquipmentCollection();
  const data = await collection.findOne({});
  return data ? data.equipmentGroups.find((group) => group.id === id) : null;
}

export async function getEquipmentItemById(id) {
  const collection = await getEquipmentItemsCollection();

  const data = await collection.findOne(
    { "equipmentItems.id": id }, // Filter documents where at least one item matches
    { projection: { equipmentItems: { $elemMatch: { id } } } } // Return only the matching item
  );

  return data?.equipmentItems?.[0] || null;
}

export async function getEquipmentItemsByGroupId(groupId) {
  const collection = await getEquipmentItemsCollection();
  const data = await collection.findOne({});
  return data
    ? data.equipmentItems.filter((item) => item.groupID === groupId)
    : [];
}

// Update equipment group
export async function updateEquipmentGroup(id, updateData) {
  const collection = await getEquipmentCollection();
  await collection.updateOne(
    { "equipmentGroups.id": id },
    { $set: { "equipmentGroups.$": updateData } }
  );
}

// Update equipment item
export async function updateEquipmentItem(id, updateData) {
  const collection = await getEquipmentItemsCollection();
  await collection.updateOne(
    { "equipmentItems.id": id },
    { $set: { "equipmentItems.$": updateData } }
  );
}

// Delete equipment group
export async function deleteEquipmentGroup(id) {
  const collection = await getEquipmentCollection();
  await collection.updateOne({}, { $pull: { equipmentGroups: { id: id } } });
}

// Delete equipment item
export async function deleteEquipmentItem(id) {
  const collection = await getEquipmentItemsCollection();
  await collection.updateOne({}, { $pull: { equipmentItems: { id: id } } });
}

export default {
  resetData,
  addEquipmentHistoryEntry,
  getEquipmentHistory,
  addEquipmentGroup,
  getEquipmentGroups,
  getEquipmentGroupById,
  updateEquipmentGroup,
  deleteEquipmentGroup,
  addEquipmentItem,
  getEquipmentItemById,
  getEquipmentItemsByGroupId,
  getEquipmentItems,
  updateEquipmentItem,
  deleteEquipmentItem,
};
