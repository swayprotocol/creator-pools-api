import '../shared/configs/stagingConfig.json'
import '../shared/configs/productionConfig.json'
import '../shared/configs/dualPoolsConfig.json'

export const getStakingAPY = async (name: string) => {
  const config = await require(`../shared/configs/${name}Config.json`)
  return config.staking.apy
}