import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = {
  personnel: [],
  locations: [],
};

// Get the collection
async function getPersonnelCollection() {
  const db = await connectToMongo();
  return db.collection("personnel");
}

// Initialize the personnel collection with default data if it doesn't exist
async function initializePersonnelCollection() {
  const collection = await getPersonnelCollection();
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertOne(defaultData);
  }
}

// Reset data
export async function resetData() {
  const collection = await getPersonnelCollection();
  await collection.drop();
}

// Get personnel data
export async function getPersonnelData() {
  const collection = await getPersonnelCollection();
  return await collection.findOne({});
}

// Update personnel data
export async function updatePersonnelData(newData) {
  const { _id: _, ...updateFields } = newData; // Exclude the `_id` field from `updateData`
  const collection = await getPersonnelCollection();
  await collection.updateOne({}, { $set: updateFields });
}

// Initialize the collection with default data if empty
initializePersonnelCollection();

export default {
  resetData,
  getPersonnelData,
  updatePersonnelData,
};
