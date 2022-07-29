import { poolStub } from "../../pool/tests/pool.stub";
import { Unstake } from "../entities/unstake.entity";


export const unstakeStub = (): Unstake => {
  return {
    _id: '62cc1ada91bcdafd0452ace3',
    wallet: '0x43948a5b61b841733508c60d2d5c9da5fd2b6a16',
    hash: '0xa244d07eab8f7a347c9122b3bc5a8d372f95d88a1fea1a72a8d5e83ec040072b',
    pool: poolStub(),
    unstakeDate: new Date('2022-05-17T17:24:28.000+00:00'),
    amount: 24000,
  }
}