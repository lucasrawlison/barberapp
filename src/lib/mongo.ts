// app/lib/mongo.ts
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL!;
const globalForMongo = global as unknown as {
  mongoClient: MongoClient | undefined;
};

const client = globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

export async function getMongoDb() {
  await client.connect(); // ✅ seguro mesmo se já estiver conectado
  return client.db();     // retorna o banco padrão da connection string
}
