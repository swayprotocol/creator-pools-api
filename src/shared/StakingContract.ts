import { Injectable } from '@nestjs/common';
import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import STAKING_ABI from './abis/production/staking-abi.json';
import { STAKING_CONTRACT_ADDRESS, WEB3_HTTP_PROVIDER } from 'src/config';

@Injectable()
export class StakingContract {
  private contract: Contract = new Contract(STAKING_CONTRACT_ADDRESS!, STAKING_ABI, new JsonRpcProvider(WEB3_HTTP_PROVIDER));
  
  public async getStakingContract(name: string): Promise<Contract> {
    try {
      const { staking, network } = require(`./configs/${name}Config.json`)
      const abi = require(`./abis/${name}/staking-abi.json`) 
      return new Contract(staking.address, abi, new JsonRpcProvider(network.web3_provider_url));;
    } catch (error) {
      return this.contract
    }

  }

}

