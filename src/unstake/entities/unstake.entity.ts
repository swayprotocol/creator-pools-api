import { Pool } from '../../pool/entities/pool.entity';
export class Unstake {
  _id: string;
  wallet: string;
  hash: string;
  pool: Pool;
  unstakeDate: Date;
  amount: Number;
  token: string;
}
