import { Injectable } from '@nestjs/common';
import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

@Injectable()
export class StakingContract {
  
  public async getStakingContract(name: string): Promise<Contract> {
    try {
      const { staking, network } = require(`./configs/${name}Config.json`)
      const abi = require(`./abis/${name}/staking-abi.json`) 
      return new Contract(staking.address, abi, new JsonRpcProvider(network.web3_provider_url));;
    } catch (error) {
      return null
    }

  }

}

