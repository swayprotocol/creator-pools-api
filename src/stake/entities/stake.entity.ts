import { Pool } from '../../pool/entities/pool.entity';

export class Stake {
  _id: string;
  pool: Pool;
  stakedAt: Date;
  token: string;
  amount: number;
  wallet: string;
  collected: boolean;
  collectedDate: Date;
  hash: string;
  farmed?: number;
}
