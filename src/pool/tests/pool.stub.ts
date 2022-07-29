import { Pool } from '../entities/pool.entity';

export const poolStub = (): Pool => {
  return {
    _id: '62c6cbc392ecad581023b638',
    creator: 'ig-banks',
    startTime: new Date('2022-05-17T09:35:29.000+00:00'),
    hash: '0x4d88febe322601e072096050f9e15dde847bb742b2e4ee64fbb654ef643ceb0a',
  }
}