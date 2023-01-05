import { ChainId, JSBI, Percent, AddressMap } from '@deepspace-game/sdk'

export * from './deepspace'

export const POOL_DENY = ['14', '29', '45', '30']
export const UNSTAKING_FEE = 15

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 4

export const MERKLE_ROOT =
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-19/merkle-10959148-11824101.json'

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 1000
// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1800), BIPS_BASE) // 18%

// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(2000), BIPS_BASE) // 20%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
]

export const EIP_1559_ACTIVATION_BLOCK: { [chainId in ChainId]?: number } = {}
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const filter_max_value = 10000000000000
export const CARD_WIDTH = 260
export const SHIP_SELECT_LIST = [5, 10, 20, 50]
export const FILTER_DATA = {
  hint: '',
  newItem: 0,
  newListing: 0,
  mySale: 0,
  myListing: 0,
  listed: 0,
  minPrice: '',
  maxPrice: '',
  coreType: -1,
  shipClass: -1,
  shipStatus: 0,
  minStatus: '',
  maxStatus: '',
  star: 0,
  textureType: -1,
  priceUp: 1,
  shipStatsUp: 1,
  shipLevelUp: 1,
  minShipLevel: '',
  maxShipLevel: '',
  starUp: 1,
  textureTypeUp: 1,
  sortType: 'initial',
}
export const TextureColors = ['#ededed', '#7fc766', '#00bdff', '#ff9a54', '#ff00d2']
export const GENESIS_STARTED_TIME = '2022-03-11'
export const handleCardDisplay = () => {
  let width = Number(window.innerWidth)
  if (width >= 1920) return 5
}

export const SERVICE_API_URL = 'https://status.deepspace.game/api'
export const bnb_decimal = 18
