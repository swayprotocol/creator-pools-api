import '../shared/configs/stagingConfig.json'
import '../shared/configs/productionConfig.json'
import '../shared/configs/dualPoolsConfig.json'

export const getStakingAPY = (name: string): number => {
  const config = require(`../shared/configs/${name}Config.json`)
  return config.staking.apy
}