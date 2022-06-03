import { Pool } from "../../pool/entities/pool.entity";
import { Stake } from "./stake.entity";

export interface ActiveStakesPool {
  token0: TokenDetails,
  token1: TokenDetails,
  poolHandle: string,
  pool: Pool,
  members: string[],
  numberOfStakes: number,
  stakes: Stake[],
}

export interface TokenDetails {
  stakesCount: number,
  totalAmount: number,
  averageAPY: number,
  totalFarmed: number,
  walletTotalAmount: number,
  walletAverageAPY: number,
  walletFarmed: number,
  walletStakesCount: number,
}