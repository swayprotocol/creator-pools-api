import { Plan } from "src/plan/entities/plan.entity";
import { Pool } from "src/pool/entities/pool.entity";

export class Stake {
  _id: string;
  plan: Plan;
  pool: Pool;
  stakedAt: Date;
  stakedUntil: Date;
  amount: number;
  wallet: string;
}
