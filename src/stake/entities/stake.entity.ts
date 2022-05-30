import { Plan } from '../../plan/entities/plan.entity';
import { Pool } from '../../pool/entities/pool.entity';

export class Stake {
  _id: string;
  plan: Plan;
  pool: Pool;
  stakedAt: Date;
  stakedUntil: Date;
  amount: number;
  wallet: string;
  collected: boolean;
  hash: string;
  farmed?: number;
}
