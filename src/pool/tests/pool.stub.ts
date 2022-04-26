import { Pool } from '../entities/pool.entity';

export const poolStub = (): Pool => {
  return {
    _id: "6266aedc1db7579c55fa7b44",
    creator: "Artist Test",
    startTime: 300,
    totalAmount: 12000,
    numberOfStakes: 15,
  }
}