export interface Pool {
  _id: string;
  log_index: number,
  transaction_hash: string,
  _created_at: Date,
  _updated_at: Date,
  address: string,
  block_hash: string,
  block_number: number,
  block_timestamp: Date,
  confirmed: boolean,
  poolHandle: string,
  sender: string,
  transaction_index: number,
}
