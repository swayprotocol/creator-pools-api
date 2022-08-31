import { Claim } from '../entities/claim.entity';
import { poolStub } from '../../pool/tests/pool.stub';

export const claimStub = (): Claim => {
  return {
    _id: '62c6cbf692ecad581023b6ec',
    wallet: '0x39883c7ae6007caec98e14b1b74c7fd3fd7da0b5',
    pool: poolStub(),
    amount: 15000,
    claimDate: new Date('2022-05-17T12:11:11.000+00:00'),
    hash: '0x5d17a37aab13b5999fe6e7fa3198ad41b75d1778baeb9ee22b9a9ec78bafc930',
    unstaked: false,
  }
}