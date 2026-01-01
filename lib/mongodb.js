import { MongoClient } from "mongodb";

let clientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalThis._mongoClientPromise) {
      const client = new MongoClient(uri);
      globalThis._mongoClientPromise = client.connect();
    }
    return globalThis._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

export async function getDb() {
  const dbName = process.env.MONGODB_DB || "whatsapp_clone";
  if (!clientPromise) {
    clientPromise = getClientPromise();
  }
  const client = await clientPromise;
  return client.db(dbName);
}
