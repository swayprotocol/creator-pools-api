import { Pool } from '../../pool/entities/pool.entity';
import { Stake } from '../../stake/entities/stake.entity';

export class Claim {
  _id: string;
  wallet: string;
  pool: Pool;
  amount: number;
  claimDate: Date;
  hash: string;
  stakes: Stake[];
  unstaked: boolean;
}
