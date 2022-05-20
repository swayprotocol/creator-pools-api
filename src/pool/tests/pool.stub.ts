import { Pool } from '../entities/pool.entity';

export const poolStub = (): Pool => {
  return {
    _id: '6266aedc1db7579c55fa7b44',
    creator: 'Artist Test',
    startTime: new Date('2022-05-05T10:21:53.180+00:00'),
    hash: '0x0fedab360937a92136b53a2790bcde2aecd5a2cf7a0bba6219e4883a70fac1fc',
  }
}