import { Pool } from "src/pool/entities/pool.entity";

export class TopStakedPools {
  pool: Pool;
  token: string;
  tokenPrice: number;
  totalAmount: number;
  totalPrice: number;
}