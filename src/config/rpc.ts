import { ChainId } from '@deepspace-game/sdk'

const rpc = {
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  // [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-1-s2.binance.org:8545',
}

export default rpc
