import { ChainId } from '@deepspace-game/sdk'
import { assetURL } from '../functions/deepspace'

const Bsc = assetURL('networks/bsc-network.jpg')

export const NETWORK_ICON = {
  [ChainId.BSC]: Bsc,
  [ChainId.BSC_TESTNET]: Bsc,
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.BSC]: 'BSC',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
}
