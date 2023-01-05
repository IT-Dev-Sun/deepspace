import BSC from './mappings/bsc'
import { ChainId } from '@deepspace-game/sdk'

export type ChainlinkPriceFeedMap = {
  readonly [address: string]: {
    from: string
    to: string
    decimals: number
    fromDecimals: number
    toDecimals: number
    warning?: string
    address?: string
  }
}

export const CHAINLINK_PRICE_FEED_MAP: {
  [chainId in ChainId]?: ChainlinkPriceFeedMap
} = {
  [ChainId.BSC]: BSC
}
