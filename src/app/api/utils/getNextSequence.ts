// app/utils/getNextSequence.ts
import { getMongoDb } from "@/lib/mongo";

interface CounterDocument {
  _id: string;
  count: number;
  
}

export async function getNextSequence(sequenceName: string): Promise<number> {
  const db = await getMongoDb();
  const counters = db.collection<CounterDocument>("counters"); // tipagem correta aqui

  const result = await counters.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: "after" }
  );

  return result?.count ?? 1;
}
