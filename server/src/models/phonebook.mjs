import { connectToMongo } from "../services/mongoService.mjs";

// Default data
const defaultData = {
  entries: [],
  instructions: [],
};

// Get the collection
async function getPhonebookCollection() {
  const db = await connectToMongo();
  return db.collection("phonebook");
}

// Initialize the phonebook collection with default data if it doesn't exist
async function initializePhonebookCollection() {
  const collection = await getPhonebookCollection();
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertOne(defaultData);
  }
}

// Reset data
export async function resetData() {
  const collection = await getPhonebookCollection();
  await collection.drop();
}

// Get phonebook data
export async function getPhonebookData() {
  const collection = await getPhonebookCollection();
  return await collection.findOne({});
}

// Update phonebook data
export async function updatePhonebookData(newData) {
  const { _id: _, ...updateFields } = newData; // Exclude the `_id` field from `updateData`
  const collection = await getPhonebookCollection();
  await collection.updateOne({}, { $set: updateFields });
}

// Initialize the collection with default data if empty
initializePhonebookCollection();

export default {
  resetData,
  getPhonebookData,
  updatePhonebookData,
};
