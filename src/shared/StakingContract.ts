import { Injectable } from '@nestjs/common';
import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import sanitize from 'sanitize-filename';

@Injectable()
export class StakingContract {
  
  public async getStakingContract(name: string): Promise<Contract> {
    try {
      name = sanitize(name)
      const { staking, network } = require(`./configs/${name}Config.json`)
      const abi = require(`./abis/${name}/staking-abi.json`) 
      return new Contract(staking.address, abi, new JsonRpcProvider(network.web3_provider_url));;
    } catch (error) {
      return null
    }
  }

  public async calculateReward(config:string,poolHandle: string, wallet: string) {
    const contract = await this.getStakingContract(config)
    return contract.calculateReward(poolHandle,wallet)
  }

}

