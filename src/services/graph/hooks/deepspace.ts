import {
  dpsGraph,
  getBurnedShips,
  getDpsListings,
  getStakingPools,
  getStakingPoolUsers,
  getTotalBurnShips,
  getTotalSoldShipsAmount,
  getDailyCharts,
  getOutPostShipPurchaseListings,
  getPurchaseDetails,
  getGalacticItemsDetails,
} from '../fetchers'
import useSWR, { SWRConfiguration } from 'swr'
import {
  useFilterData,
  useUpdateLastID,
  useLastID,
  useUpdateFirstID,
  useFirstID,
  useShipSelects,
} from '../../../state/others/hooks'
import { useActiveWeb3React } from '../../../hooks'
import timezone from 'moment-timezone'
import {
  ShipCriteria,
  StakingShipCriteria,
  OutPostFilterQuery,
  InventoryFilterQuery,
  useStakingFilterQuery,
  usePoolListQuery,
  useStakingPooluserQuery,
  OutPostShipPurchaseFilterQuery,
} from '../queries'
import gql from 'graphql-tag'
import { GENESIS_STARTED_TIME, ZERO_ADDRESS } from '../../../constants'
import { BigNumber } from 'ethers'
import { arrayify } from '@ethersproject/bytes'
export function useDpsGraph(variables = undefined, query = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const { data } = useSWR(
    chainId ? [chainId, query, JSON.stringify(variables)] : null,
    () => dpsGraph(chainId, query, variables),
    swrConfig
  )
  return data
}

export function useShipListings(
  filterStatus,
  cardCount = 1,
  paginationPrevDirection,
  nextID,
  filterType,
  chainId = undefined,
  variables = {},
  swrConfig: SWRConfiguration = { refreshInterval: 10 * 1000 }
) {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  chainId = chainId ?? chainIdSelected
  let shouldFetch = chainId
  const filterData = useFilterData()
  const firstID = useFirstID()
  const lastID = useLastID()
  const updateLastID = useUpdateLastID()
  const updateFirstID = useUpdateFirstID()
  const params = new ShipCriteria()
  params.isNew = filterData.newItem
  if (
    filterType === 'outpost' ||
    filterType === 'outpostNewListing' ||
    filterType === 'outpostMyListing' ||
    filterType === 'outpostSale' ||
    filterType === 'outpostMySale'
  ) {
    params.isListing = true
    params.isNew = false
    if (filterType === 'outpostNewListing' || filterType === 'outpostMyListing') {
      params.isNewListing = true
      params.isMySale = false
      if (filterType === 'outpostMyListing') {
        params.sellerAddress = account
      }
    } else if (filterType === 'outpostSale') {
      params.isListing = false
      params.isNewListing = false
      params.isMySale = false
    } else if (filterType === 'outpostMySale') {
      params.isListing = false
      params.isNewListing = false
      params.isMySale = true
      params.sellerAddress = account
    }
  } else {
    params.isListing = filterData.listed
    if (params.isListing) {
      params.sellerAddress = account
    } else {
      params.ownerAddress = account
    }
  }
  params.pageSize = cardCount + 1
  params.priceLimit.min = filterData.minPrice ? filterData.minPrice : null
  params.priceLimit.max = filterData.maxPrice ? filterData.maxPrice : null
  params.shipLevelLimit.min = filterData.minShipLevel ? filterData.minShipLevel : null
  params.shipLevelLimit.max = filterData.maxShipLevel ? filterData.maxShipLevel : null
  params.shipType = filterData.shipClass != -1 ? filterData.shipClass : null
  params.coreType = filterData.coreType != -1 ? filterData.coreType : null
  params.shipStat = filterData.shipStatus
  params.shipStatLimit.min = filterData.minStatus ? filterData.minStatus : null
  params.shipStatLimit.max = filterData.maxStatus ? filterData.maxStatus : null
  params.rarityLevel = filterData.star
  params.textureType = filterData.textureType != -1 ? filterData.textureType : null
  params.nextID = filterStatus == false ? nextID : null
  switch (filterData.sortType) {
    case 'priceUp':
      if (filterType == 'inventory') params.priceOrderAsc = null // we don't use price in inventory page non-listed
      if (paginationPrevDirection != 1) {
        params.priceOrderAsc = filterData.priceUp != 1 ? true : false
      } else {
        params.priceOrderAsc = filterData.priceUp == 1 ? true : false
      }
      break
    case 'shipLevelUp':
      if (paginationPrevDirection != 1) {
        params.shipLevelOrderAsc = filterData.shipLevelUp != 1 ? true : false
      } else {
        params.shipLevelOrderAsc = filterData.shipLevelUp == 1 ? true : false
      }
      break
    case 'shipStatsUp':
      if (paginationPrevDirection != 1) {
        params.shipStatOrderAsc = filterData.shipStatsUp != 1 ? true : false
      } else {
        params.shipStatOrderAsc = filterData.shipStatsUp == 1 ? true : false
      }
      break
    case 'starUp':
      if (paginationPrevDirection != 1) {
        params.rarityOrderAsc = filterData.starUp != 1 ? true : false
      } else {
        params.rarityOrderAsc = filterData.starUp == 1 ? true : false
      }
      break
    case 'textureTypeUp':
      if (paginationPrevDirection != 1) {
        params.textureTypeOrderAsc = filterData.textureTypeUp != 1 ? true : false
      } else {
        params.textureTypeOrderAsc = filterData.textureTypeUp == 1 ? true : false
      }
      break
    default:
      if (paginationPrevDirection != 1) {
        params.dateOrderAsc = false
      } else {
        params.dateOrderAsc = true
      }
  }
  let filter, result, data, mutate, error, orderById, query
  if (filterType === 'outpost' || filterType === 'outpostNewListing' || filterType === 'outpostMyListing') {
    filter = OutPostFilterQuery(params)
    orderById = filter.orderById
    query = filter.query
    result = useSWR(
      shouldFetch ? ['shipListings', chainId, query, JSON.stringify(variables)] : null,
      (_, chainId) => getDpsListings(chainId, query, variables),
      swrConfig
    )
    data = result.data
    mutate = result.mutate
    error = result.error
  } else if (filterType === 'inventory') {
    filter = InventoryFilterQuery(params)
    orderById = filter.orderById
    query = filter.query
    result = useSWR(
      account ? ['shipListings', chainId, query, JSON.stringify(variables)] : null,
      (_, chainId) => getDpsListings(chainId, query, variables),
      swrConfig
    )
    data = result.data
    mutate = result.mutate
    error = result.error
  } else if (filterType === 'outpostSale' || filterType === 'outpostMySale') {
    filter = OutPostShipPurchaseFilterQuery(params)
    orderById = filter.orderById
    query = filter.query
    result = useSWR(
      chainId ? ['shipListings', chainId, query, JSON.stringify(variables)] : null,
      (_, chainId) => getOutPostShipPurchaseListings(chainId, query, variables),
      swrConfig
    )

    data = result.data
    mutate = result.mutate
    error = result.error
  }
  if (data && data.length) {
    updateFirstID(data[0][orderById])
    if (params.pageSize == data.length) {
      updateLastID(data[data.length - 2][orderById])
    } else {
      updateLastID(data[data.length - 1][orderById])
    }
  } else if (data && data.length == 0) {
    updateFirstID(null)
    updateLastID(null)
  }
  return { data, mutate, error }
}

export function useUserBurnedShips() {
  const { chainId, account } = useActiveWeb3React()
  const query = gql`
  {
    shipLostUsers(where:{
      user:"${account}"
    }) {
      id
      user
      numShips
    }
  }
  `
  let { data, mutate, error } = useSWR(
    account ? ['shipListings', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getBurnedShips(chainId, query, undefined),
    undefined
  )
  return { data, mutate, error }
}

export function useTotalSoldShipsAmount() {
  const { chainId, account } = useActiveWeb3React()
  const query = gql`
    {
      stat(id: "ALL") {
        shipsSold
      }
    }
  `
  let { data, mutate, error } = useSWR(
    chainId ? ['shipListings', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getTotalSoldShipsAmount(chainId, query, undefined),
    undefined
  )
  return { data, mutate, error }
}

export function useStakingList(isStaking: boolean, pagination: any, PoolId: any) {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  const chainId = chainIdSelected
  const filterData = useFilterData()
  const shipSelects = useShipSelects()

  const params = new StakingShipCriteria()
  if (isStaking) {
    params.isStaking = true
    params.stakingUser = account
    params.poolId = Number(PoolId)
  } else {
    params.ownerAddress = account
  }

  params.shipType = filterData.shipClass != -1 ? filterData.shipClass : null
  params.coreType = filterData.coreType != -1 ? filterData.coreType : null
  params.shipStatLimit.min = filterData.minStatus ? filterData.minStatus : null
  params.shipStatLimit.max = filterData.maxStatus ? filterData.maxStatus : null
  params.shipStat = filterData.shipStatus
  params.textureType = filterData.textureType != -1 ? filterData.textureType : null
  params.rarityLevel = filterData.star != 0 ? filterData.star : null
  params.pageSize = shipSelects + 1
  params.offSet = pagination * shipSelects
  switch (filterData.sortType) {
    case 'shipStatsUp':
      params.shipStatOrderAsc = filterData.shipStatsUp != 1 ? true : false
      break
    case 'starUp':
      params.rarityOrderAsc = filterData.starUp != 1 ? true : false
      break
    case 'textureTypeUp':
      params.textureTypeOrderAsc = filterData.textureTypeUp != 1 ? true : false
      break
  }
  const { query } = useStakingFilterQuery(params)
  let { data, mutate, error } = useSWR(
    chainId && account ? ['shipListings', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getDpsListings(chainId, query, undefined),
    undefined
  )
  return { data, mutate, error }
}

export function usePoolList() {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  const chainId = chainIdSelected
  const { query } = usePoolListQuery()
  let { data, mutate, error } = useSWR(
    chainId ? ['stakingPools', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getStakingPools(chainId, query, undefined),
    undefined
  )
  return { data, mutate, error }
}
export function useStakingPoolUser(swrConfig: SWRConfiguration = { refreshInterval: 5 * 1000 }) {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  const chainId = chainIdSelected
  const { query } = useStakingPooluserQuery(account)
  let { data, mutate, error } = useSWR(
    chainId && account ? ['stakingPoolUsers', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getStakingPoolUsers(chainId, query, undefined),
    swrConfig
  )
  return { data, mutate, error }
}
export function useLostShips() {
  const { chainId } = useActiveWeb3React()
  const query = gql`
    {
      stat(id: "ALL") {
        shipsLost
      }
    }
  `
  const { data, mutate, error } = useSWR(
    chainId ? ['totalBurnShips', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getTotalBurnShips(chainId, query, undefined),
    undefined
  )

  return { data, mutate }
}
export function useSingleShip(shipId) {
  const query = `
  {
    shipFilters(where:{tokenId:${shipId}}) {
      ship {
        id
        tokenId
        mintDate
        minter
        owner
        name
        stats
        cosmetics
        shipType
        coreType
        numCores
        textureNum
        textureType
        rating
        shipLocked
      }
      listing {
        id
        tokenAddress
        seller
        price
        listDate
        token {
          tokenId
          name
          owner
          shipType
          coreType
          textureNum
          textureType
          rating
          stats
          cosmetics
          shipLocked
        }
      }
    }
  }
  `
  const { chainId } = useActiveWeb3React()

  let { data, mutate, error } = useSWR(
    chainId ? ['shipListings', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getDpsListings(chainId, query, undefined),
    undefined
  )
  return data
}

export function useSoldShipChartData(chartValue: number) {
  let momentTime = timezone.utc()
  let dayStart
  const { chainId } = useActiveWeb3React()
  if (chartValue === 0) {
    dayStart = 1
    momentTime = momentTime.subtract(dayStart, 'years')
  } else if (chartValue == -1) {
    momentTime = timezone.utc(GENESIS_STARTED_TIME)
    // dayStart = 1000
    // momentTime = momentTime.subtract(dayStart, 'days')
  } else {
    dayStart = chartValue
    momentTime = momentTime.subtract(dayStart, 'days')
  }

  let dayInterval = BigNumber.from(momentTime.valueOf()).div(10000).mul(10).toNumber()

  let { data, mutate, error } = useSWR(
    chainId ? ['SoldShipChartData', chainId, dayInterval, JSON.stringify(undefined)] : null,
    async (_, chainId) => await getDailyCharts(dayInterval),
    undefined
  )
  let arr = []

  for (var i = 0; i < data?.length; i++) {
    let d = BigNumber.from(data[i].floorPrice).div(Math.pow(10, 9))
    let numShipsSold = Number(data[i].numShipsSold)
    let floorPrice = Number(d.toString())
    let name = timezone(data[i].dayStart * 1000)
      .utc()
      .format('MM/DD/YY')
    arr.push({
      name: name,
      floorPrice: floorPrice,
      numShipsSold: numShipsSold,
    })
  }
  data = arr

  return { data, mutate, error }
}

export function usePurchaseDetails(shipId: number, swrConfig: SWRConfiguration = { refreshInterval: 60 * 1000 }) {
  const { chainId } = useActiveWeb3React()
  const query = gql`
    {
      purchaseDetails(where:{tokenId:${shipId}}){
        id
        buyer
        seller
        price
        tokenId
        purchaseDate
      }
    }
  `
  let { data, mutate, error } = useSWR(
    chainId && shipId != null ? ['PurchaseDetails', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getPurchaseDetails(chainId, query, undefined),
    swrConfig
  )
  return { data, mutate, error }
}

export function shipDataByAccount() {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  const chainId = chainIdSelected

  const query = gql`
    {
      shipFilters(orderBy: mintDateSortId, orderDirection: desc, first: 999, where:{owner:"${account}"}) {
        mintDateSortId
        ship {
          id
          tokenId
          mintDate
          minter
          owner
          name
          stats
          cosmetics
          shipType
          coreType
          numCores
          textureNum
          textureType
          rating
          shipLocked
        }
      }
    }
  `
  let { data, mutate, error } = useSWR(
    account ? ['shipListings', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getDpsListings(chainId, query, undefined),
    undefined
  )
  return { data, mutate, error }
}

export function getGalacticItems() {
  const { chainId: chainIdSelected, account } = useActiveWeb3React()
  const chainId = chainIdSelected

  const query = gql`
    {
      consumables {
        id
        enabled
        numLimit
        price
        timeLimit
        timeStart
        salePrice
        saleStarts
        saleEnds
      }
      nonConsumables {
        id
        enabled
        numLimit
        price
        timeLimit
        timeStart
        salePrice
        saleStarts
        saleEnds
      }
    }
  `
  let { data, mutate, error } = useSWR(
    chainId ? ['galacticItems', chainId, query, JSON.stringify(undefined)] : null,
    (_, chainId) => getGalacticItemsDetails(chainId, query, undefined),
    undefined
  )
  return { data, mutate, error }
}
