import {
  dayDatasQuery,
  ethPriceQuery,
  factoryQuery,
  liquidityPositionsQuery,
  pairsQuery,
  tokenDayDatasQuery,
  tokenPairsQuery,
  tokenPriceQuery,
  tokenQuery,
  tokensQuery,
  tokenSubsetQuery,
  transactionsQuery,
} from '../queries'

import { ChainId } from '@deepspace-game/sdk'
import { GRAPH_HOST } from '../constants'
import { pager } from '.'

export const EXCHANGE = {
  [ChainId.MAINNET]: 'sushiswap/exchange',
  [ChainId.BSC]: 'sushiswap/bsc-exchange',
}

export const exchange = async (chainId = ChainId.MAINNET, query, variables = {}) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${EXCHANGE[chainId]}`, query, variables)

export const getPairs = async (chainId = ChainId.MAINNET, variables = undefined, query = pairsQuery) => {
  const { pairs } = await exchange(chainId, query, variables)
  return pairs
}

export const getTokenSubset = async (chainId = ChainId.MAINNET, variables) => {
  const { tokens } = await exchange(chainId, tokenSubsetQuery, variables)
  return tokens
}

export const getTokens = async (chainId = ChainId.MAINNET, query = tokensQuery, variables) => {
  const { tokens } = await exchange(chainId, query, variables)
  return tokens
}

export const getToken = async (chainId = ChainId.MAINNET, query = tokenQuery, variables) => {
  const { token } = await exchange(chainId, query, variables)
  return token
}

export const getTokenDayData = async (chainId = ChainId.MAINNET, query = tokenDayDatasQuery, variables) => {
  const { tokenDayDatas } = await exchange(chainId, query, variables)
  return tokenDayDatas
}

export const getTokenPrices = async (chainId = ChainId.MAINNET, variables) => {
  const { tokens } = await exchange(chainId, tokensQuery, variables)
  return tokens.map((token) => token?.derivedETH)
}

export const getTokenPrice = async (chainId = ChainId.MAINNET, query, variables) => {
  const nativePrice = await getNativePrice(chainId)

  const { token } = await exchange(chainId, query, variables)
  return token?.derivedETH * nativePrice
}

export const getNativePrice = async (chainId = ChainId.MAINNET, variables = undefined) => {
  const data = await getBundle(chainId, undefined, variables)
  return data?.bundles[0]?.ethPrice
}

export const getEthPrice = async (variables = undefined) => {
  return getNativePrice(ChainId.MAINNET, variables)
}

export const getYggPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x25f8087ead173b73d6e8b84329989a8eea16cf73',
    ...variables,
  })
}

export const getRulerPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x2aeccb42482cc64e087b6d2e5da39f5a7a7001f8',
    ...variables,
  })
}

export const getTruPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x4c19596f5aaff459fa38b0f7ed92f11ae6543784',
    ...variables,
  })
}

export const getCvxPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
    ...variables,
  })
}

export const getAlcxPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
    ...variables,
  })
}

export const getPicklePrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x429881672b9ae42b8eba0e26cd9c73711b891ca5',
    ...variables,
  })
}

export const getMphPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x8888801af4d980682e47f1a9036e589479e835c5',
    ...variables,
  })
}

export const getSushiPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.MAINNET, tokenPriceQuery, {
    id: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    ...variables,
  })
}

export const getDpsPrice = async (variables = {}) => {
  return getTokenPrice(ChainId.BSC, tokenPriceQuery, {
    id: '0xf275e1AC303a4C9D987a2c48b8E555A77FeC3F1C',
    ...variables,
  })
}

export const getBundle = async (
  chainId = ChainId.MAINNET,
  query = ethPriceQuery,
  variables = {
    id: 1,
  }
) => {
  return exchange(chainId, query, variables)
}

export const getLiquidityPositions = async (chainId = ChainId.MAINNET, variables) => {
  const { liquidityPositions } = await exchange(chainId, liquidityPositionsQuery, variables)
  return liquidityPositions
}

export const getDayData = async (chainId = ChainId.MAINNET, query = dayDatasQuery, variables = undefined) => {
  const { dayDatas } = await exchange(chainId, query, variables)
  return dayDatas
}

export const getFactory = async (chainId = ChainId.MAINNET, variables = undefined) => {
  const { factories } = await exchange(chainId, factoryQuery, variables)
  return factories[0]
}

export const getTransactions = async (chainId = ChainId.MAINNET, query = transactionsQuery, variables = undefined) => {
  const { swaps } = await exchange(chainId, query, variables)
  return swaps
}

export const getTokenPairs = async (chainId = ChainId.MAINNET, query = tokenPairsQuery, variables = undefined) => {
  const { pairs0, pairs1 } = await exchange(chainId, query, variables)
  return pairs0 || pairs1 ? [...(pairs0 ? pairs0 : []), ...(pairs1 ? pairs1 : [])] : undefined
}
