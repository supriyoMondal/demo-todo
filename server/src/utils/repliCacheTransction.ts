// replicacheTransactionLoader.ts
import type {
  ReplicacheTransaction as ReplicacheTransactionType,
  Storage,
} from "replicache-transaction";

let ReplicacheTransaction: typeof ReplicacheTransactionType | undefined;

export async function loadReplicacheTransaction(storage: Storage) {
  if (!ReplicacheTransaction) {
    const module = await import("replicache-transaction");
    ReplicacheTransaction = module.ReplicacheTransaction;
  }
  return new ReplicacheTransaction(storage);
}
