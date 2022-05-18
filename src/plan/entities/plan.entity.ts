export interface Plan {
  _id: string;
  blockchainIndex: number;
  apy: number;
  availableUntil: Date;
  lockMonths: number;
  createdAt: Date;
}
