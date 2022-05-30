import { Pool } from "../../pool/entities/pool.entity";
import { Stake } from "./stake.entity";

export interface ActiveStakesPool {
  poolHandle: string,
  social: string,
  pool: Pool,
  totalAmount: number,
  totalFarmed: number,
  averageAPY: number,
  members: string[],
  numberOfStakes: number,
  stakes: Stake[],
}