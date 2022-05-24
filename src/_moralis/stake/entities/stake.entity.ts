export interface Stake {
  _id: string;
  log_index: number,
  transaction_hash: string,
  _created_at: Date,
  _updated_at: Date,
  address: string,
  amount: string,
  amount_decimal: number,
  block_hash: string,
  block_number: number,
  block_timestamp: Date,
  confirmed: boolean,
  planId: number,
  poolHandle: string,
  sender: string,
  transaction_index: number,
}
