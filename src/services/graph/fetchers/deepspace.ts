import { ChainId } from '@deepspace-game/sdk'
import { GRAPH_HOST } from '../constants'
import { pager } from '.'
import config from '../../../config'

export const dpsGraph = async (chainId = ChainId.BSC, query, variables = {}) =>
  pager(`${GRAPH_HOST[chainId]}/subgraphs/name/${config.SUBGRAPH_NFT}`, query, variables)

export const getDpsShips = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const { ships } = await dpsGraph(chainId, query, variables)
  return ships
}

export const getBurnedShips = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const { shipLostUsers } = await dpsGraph(chainId, query, variables)
  return shipLostUsers
}
export const getTotalSoldShipsAmount = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const { stat } = await dpsGraph(chainId, query, variables)
  return stat
}
export const getDpsListings = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const { shipFilters } = await dpsGraph(chainId, query, variables)
  return shipFilters
}

export const getOutPostShipPurchaseListings = async (
  chainId = ChainId.BSC,
  query = undefined,
  variables = undefined
) => {
  const { shipPurchaseFilters } = await dpsGraph(chainId, query, variables)
  return shipPurchaseFilters
}
export const getDailyCharts = async (dayInterval) => {
  const res = await fetch(`${config.DAILYSHIPSALES_URI}/${dayInterval}`)
  return await res.json()
}
export const getStakingPools = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const { stakingPools } = await dpsGraph(chainId, query, variables)
  return stakingPools
}
export const getStakingPoolUsers = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const { stakingPoolUsers } = await dpsGraph(chainId, query, variables)
  return stakingPoolUsers
}
export const getTotalBurnShips = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const { stat } = await dpsGraph(chainId, query, variables)
  return stat
}
export const getPurchaseDetails = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const { purchaseDetails } = await dpsGraph(chainId, query, variables)
  return purchaseDetails
}

export const getGalacticItemsDetails = async (chainId = ChainId.BSC, query = undefined, variables = undefined) => {
  const response = await dpsGraph(chainId, query, variables)
  return response
}
