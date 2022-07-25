import { Stake } from '../entities/stake.entity';
import { ActiveStakesPool } from '../entities/activeStakesPool';
import { poolStub } from '../../pool/tests/pool.stub';
import { TopStakedPools } from '../dto/topStakedPools.dto';



export const stakeStub = (): Stake => {
  return {
    _id: '62cc1a0091bcdafd0452a8e9',
    plan: {
      _id: '62c44f59e87c6e62c6370d92',
      blockchainIndex: 7,
      apy: 111,
      availableUntil: new Date('2022-12-31T23:00:00.000+00:00'),
      lockMonths: 6,
      createdAt: new Date('2022-05-26T09:04:02.739+00:00')
    },
    pool: {
      _id: '62c6cbc392ecad581023b638',
      creator: 'ig-banks',
      startTime: new Date('2022-05-17T09:35:29.000+00:00'),
      hash: '0x4d88febe322601e072096050f9e15dde847bb742b2e4ee64fbb654ef643ceb0a'
    },
    stakedAt: new Date('2022-07-04T09:44:05.000+00:00'),
    stakedUntil: new Date('2022-12-31T09:44:05.000+00:00'),
    amount: 1000,
    wallet: '0x606153fed24d005fcfbe3983f643a343516cd0e4',
    collected: false,
    hash: '0x9610dff4b9e0cf8649253714b20a993542088c6c59ef88d9a3746afb93260843',
    farmed: 0
  }
}

export const activeStakesPoolStub = (): ActiveStakesPool => {
  return {
    social: 'ig',
    poolHandle: 'banksy',
    pool: poolStub(),
    walletTotalAmount: 0,
    walletAverageAPY: 0,
    walletFarmed: 0,
    walletStakesCount: 0,
    totalAmount: 0,
    totalFarmed: 0,
    averageAPY: 0,
    members: ['0x606153fed24d005fcfbe3983f643a343516cd0e4'],
    numberOfStakes: 1,
    stakes: [stakeStub()]
  }
}

export const topStakedPoolStub = (): TopStakedPools => {
  return {
    pool: poolStub(),
    totalAmount: 1000
  }
}

interface distribution {
  channel: string,
  distribution: string
}

export const distributionStub = (): distribution[] => {
  return [
    {channel:'ig', distribution: '96.0'},
    {channel:'w', distribution: '4.0'},
  ]
}