import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://mongo:27017/cfp-dashboard";
const client = new MongoClient(mongoUrl, {});

let db;

async function connectToMongo() {
  if (!db) {
    await client.connect();
    db = client.db("cfp-dashboard");
    console.log("Connected to CFP Dashboard Database");
  }
  return db;
}

export { connectToMongo };
