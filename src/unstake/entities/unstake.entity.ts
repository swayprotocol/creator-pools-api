import { Pool } from '../../pool/entities/pool.entity';
import { Stake } from '../../stake/entities/stake.entity';
import { Claim } from '../../claim/entities/claim.entity';


export class Unstake {
  _id: string;
  wallet: string;
  hash: string;
  pool: Pool;
  unclaimDate: Date;
  stakes: Stake[];
  claims: Claim[];
}
