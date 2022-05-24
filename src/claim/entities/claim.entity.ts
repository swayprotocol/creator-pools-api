import { Pool } from '../../pool/entities/pool.entity';

export class Claim {
  _id: string;
  wallet: string;
  pool: Pool;
  amount: number;
  claimDate: Date;
  hash: string;
  unstaked: boolean;
}
