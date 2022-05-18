import { Injectable } from '@nestjs/common';
import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import STAKING_ABI from './abis/staking-abi.json';
import { STAKING_CONTRACT_ADDRESS, WEB3_HTTP_PROVIDER } from 'src/config';

@Injectable()
export class StakingContract {
  private contract: Contract = new Contract(STAKING_CONTRACT_ADDRESS!, STAKING_ABI, new JsonRpcProvider(WEB3_HTTP_PROVIDER));
  
  public async getStakingContract(): Promise<Contract> {
    return this.contract;
  }

}

