import { Plan } from "../entities/plan.entity"

export const planStub = (): Plan => {
  return {
    _id: '626134a34b3e6c3496269e5c',
    blockchainIndex: 0,
    apy: 111,
    availableUntil: new Date('2025-04-25T11:58:53.006Z'),
    lockMonths: 6,
    createdAt: new Date('2022-03-11T11:58:53.006Z'),
  }
}