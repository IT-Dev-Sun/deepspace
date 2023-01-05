import gql from 'graphql-tag'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export class LimitValue {
  min: number = null
  max: number = null
}

export class ShipCriteria {
  pageSize: number = 20
  isNew: boolean = false
  isNewListing: boolean = null
  isMySale: boolean = false
  priceLimit: LimitValue = new LimitValue()
  shipLevelLimit: LimitValue = new LimitValue()
  shipType: number = null
  coreType: number = null
  shipStat: number = null
  shipStatLimit: LimitValue = new LimitValue()
  rarityLevel: number = null
  textureType: number = null
  sellerAddress: string = null
  ownerAddress: string = null
  // When one of these are set, it dictacts the order of the result. true for ascending order,
  // false for descending. Keep null to ignore
  priceOrderAsc: boolean = null
  shipLevelOrderAsc: boolean = null
  shipStatOrderAsc: boolean = null
  rarityOrderAsc: boolean = null
  textureTypeOrderAsc: boolean = null
  dateOrderAsc: boolean = null

  // Whether or not we're querying a listing (outpost) or not (ship inventory)
  isListing: boolean = false

  // During pagination, the last ID of the result needs to be feed in as the next ID
  // of the subsequent query. This is that ID. See https://thegraph.com/docs/en/developer/graphql-api/#example-4
  // more details about the approach.

  nextID: string = null
}
export class StakingShipCriteria {
  // if isStaking === true, get staking ships list, else get unstaking ships list
  pageSize: number = 5
  offSet: number = 0
  isStaking: boolean = false
  stakingUser: string = null
  ownerAddress: string = null
  shipType: number = null
  coreType: number = null
  shipStat: number = null
  shipStatLimit: LimitValue = new LimitValue()
  textureType: number = null
  rarityLevel: number = null
  poolId: number = null

  shipStatOrderAsc: boolean = null
  rarityOrderAsc: boolean = null
  textureTypeOrderAsc: boolean = null
}

function createCriteria(criteria: ShipCriteria) {
  let orderById = 'tokenId'
  let orderByDirection = 'asc'
  let pageSizeClause = `first: ${criteria.pageSize}`
  let compareType = '_gt'
  let whereClauses = []
  let orderClause = ''
  if (criteria.isNew) {
    const dateProperty = criteria.isListing ? 'listingDate_gte' : 'mintDate_gte'
    // Within last 2 days
    const currentDate = new Date()
    const timeCutoff = Math.floor(currentDate.getTime() / 1000 - 24 * 60 * 60 * 2)
    whereClauses.push(`${dateProperty}: ${timeCutoff}`)
  }
  if (criteria.isNewListing) {
    const dateProperty = 'listingDate_gte'
    dayjs.extend(utc)
    var timeDuration = dayjs.utc().subtract(100, 'days').valueOf() / 1000
    const timeCutoff = timeDuration.toFixed(0)
    whereClauses.push(`${dateProperty}: ${timeCutoff}`)
  }
  if (criteria.shipType !== null) {
    whereClauses.push(`shipType: ${criteria.shipType}`)
  }
  if (criteria.coreType !== null) {
    whereClauses.push(`coreType: ${criteria.coreType}`)
  }

  if (criteria.isListing) {
    // Listing filters
    if (criteria.sellerAddress !== null) {
      whereClauses.push(`listingSeller: "${criteria.sellerAddress}"`)
    }

    if (criteria.priceLimit.min !== null || criteria.priceLimit.max !== null) {
      if (criteria.priceLimit.min !== null) {
        whereClauses.push(`listingPrice_gte: ${criteria.priceLimit.min}000000000`)
      }
      if (criteria.priceLimit.max !== null) {
        whereClauses.push(`listingPrice_lte: ${criteria.priceLimit.max}000000000`)
      }
    } else {
      // If no price limit defined, at least check that a price has been set
      whereClauses.push(`listingPrice_not: null`)
    }
  } else if (!criteria.isListing && criteria.isNewListing == null) {
    // Non-listing filters
    if (criteria.ownerAddress !== null) {
      whereClauses.push(`owner: "${criteria.ownerAddress}"`)
    }
  } else if (criteria.isNewListing == false && !criteria.isMySale) {
    if (criteria.priceLimit.min !== null) {
      whereClauses.push(`purchasePrice_gte: ${criteria.priceLimit.min}000000000`)
    }
    if (criteria.priceLimit.max !== null) {
      whereClauses.push(`purchasePrice_lte: ${criteria.priceLimit.max}000000000`)
    }
  } else if (criteria.isNewListing == false && criteria.isMySale) {
    whereClauses.push(`purchaseSeller: "${criteria.sellerAddress}"`)
    if (criteria.priceLimit.min !== null) {
      whereClauses.push(`purchasePrice_gte: ${criteria.priceLimit.min}000000000`)
    }
    if (criteria.priceLimit.max !== null) {
      whereClauses.push(`purchasePrice_lte: ${criteria.priceLimit.max}000000000`)
    }
  }
  if (criteria.shipLevelLimit.min != null || criteria.shipLevelLimit.max != null) {
    if (criteria.shipLevelLimit.min != null) {
      whereClauses.push(`level_gte: ${criteria.shipLevelLimit.min}`)
    }
    if (criteria.shipLevelLimit.max != null) {
      whereClauses.push(`level_lte: ${criteria.shipLevelLimit.max}`)
    }
  }
  if (criteria.shipStat !== null && criteria.shipStatLimit) {
    if (criteria.shipStatLimit.min !== null) {
      whereClauses.push(`stat${criteria.shipStat}_gte: ${criteria.shipStatLimit.min}`)
    }
    if (criteria.shipStatLimit.max !== null) {
      whereClauses.push(`stat${criteria.shipStat}_lte: ${criteria.shipStatLimit.max}`)
    }
  }

  if (criteria.rarityLevel) {
    // whereClauses.push(`rating_gte: ${criteria.rarityLevel}`)
    whereClauses.push(`rating: ${criteria.rarityLevel}`)
  }
  if (criteria.textureType) {
    whereClauses.push(`textureType: ${criteria.textureType}`)
  }

  if (criteria.priceOrderAsc !== null) {
    orderByDirection = criteria.priceOrderAsc ? 'asc' : 'desc'
    if (criteria.isNewListing == false) {
      orderById = 'purchasePriceSortId'
    } else {
      orderById = 'listingPriceSortId'
    }
    compareType = criteria.priceOrderAsc ? '_gt' : '_lt'
  } else if (criteria.shipLevelOrderAsc !== null) {
    orderByDirection = criteria.shipLevelOrderAsc ? 'asc' : 'desc'
    orderById = 'levelSortId'
    compareType = criteria.shipLevelOrderAsc ? '_gt' : '_lt'
  } else if (criteria.rarityOrderAsc !== null) {
    orderByDirection = criteria.rarityOrderAsc ? 'asc' : 'desc'
    orderById = 'ratingSortId'
    compareType = criteria.rarityOrderAsc ? '_gt' : '_lt'
  } else if (criteria.textureTypeOrderAsc !== null) {
    orderByDirection = criteria.textureTypeOrderAsc ? 'asc' : 'desc'
    orderById = 'textureTypeSortId'
    compareType = criteria.textureTypeOrderAsc ? '_gt' : '_lt'
  } else if (criteria.shipStatOrderAsc !== null && criteria.shipStat !== null) {
    orderByDirection = criteria.shipStatOrderAsc ? 'asc' : 'desc'
    orderById = `stat${criteria.shipStat}SortId`
    compareType = criteria.shipStatOrderAsc ? '_gt' : '_lt'
  } else if (criteria.dateOrderAsc !== null) {
    orderByDirection = criteria.dateOrderAsc ? 'desc' : 'asc'
    if (!criteria.isListing && criteria.isNewListing == null) {
      orderById = 'mintDateSortId'
    } else if (criteria.isListing) {
      orderById = 'listingDateSortId'
    } else if (criteria.isNewListing == false && !criteria.isMySale) {
      orderById = 'purchaseDateSortId'
    }
    compareType = criteria.dateOrderAsc ? '_lt' : '_gt'
  }
  if (criteria.nextID) {
    whereClauses.push(`${orderById + compareType}: ${`"` + criteria.nextID + `"`}`)
  }

  orderClause = `orderBy: ${orderById}, orderDirection: ${orderByDirection}`

  const whereClause = 'where:{' + whereClauses.join(', ') + '}'
  const filters = [pageSizeClause, whereClause, orderClause].join(', ')
  return { orderById, filters }
}

export const OutPostFilterQuery = (criteria: ShipCriteria) => {
  const { orderById, filters } = createCriteria(criteria)

  const query = gql`
  {
    shipFilters(${filters}) {
      ${orderById}
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
          numCores
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

  return { orderById, query }
}

export const InventoryFilterQuery = (criteria: ShipCriteria) => {
  const { orderById, filters } = createCriteria(criteria)
  const query = gql`
  {
    shipFilters(${filters}) {
      ${orderById}
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
          numCores
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
  return { orderById, query }
}

export const OutPostShipPurchaseFilterQuery = (criteria: ShipCriteria) => {
  const { orderById, filters } = createCriteria(criteria)
  const query = gql`
  {
    shipPurchaseFilters(${filters}) {
      ${orderById}
      purchasePrice
      purchaseDate
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
      purchaseDetail{
        buyer
        seller
      }
    }
  }
`
  return { orderById, query }
}

export function useStakingFilterQuery(params: StakingShipCriteria) {
  let pageSizeClause = `first: ${params.pageSize}`
  let whereClauses = []
  if (params.isStaking) {
    whereClauses.push(`stakingPoolId:${params.poolId}`)
    whereClauses.push(`stakingUser: "${params.stakingUser}"`)
  } else {
    whereClauses.push(`stakingPoolId:null`)
    whereClauses.push(`owner: "${params.ownerAddress}"`)
  }

  if (params.coreType != null) {
    whereClauses.push(`coreType: ${params.coreType}`)
  }
  if (params.shipType != null) {
    whereClauses.push(`shipType: ${params.shipType}`)
  }
  if (params.shipStat !== null && params.shipStatLimit) {
    if (params.shipStatLimit.min !== null) {
      whereClauses.push(`stat${params.shipStat}_gte: ${params.shipStatLimit.min}`)
    }
    if (params.shipStatLimit.max !== null) {
      whereClauses.push(`stat${params.shipStat}_lte: ${params.shipStatLimit.max}`)
    }
  }
  if (params.rarityLevel != null) {
    whereClauses.push(`rating: ${params.rarityLevel}`)
  }
  if (params.textureType != null) {
    whereClauses.push(`textureType: ${params.textureType}`)
  }
  var orderById = 'mintDateSortId'
  var orderByDirection = 'desc'
  if (params.textureTypeOrderAsc != null) {
    orderById = 'textureTypeSortId'
    orderByDirection = params.textureTypeOrderAsc ? 'desc' : 'asc'
  } else if (params.shipStatOrderAsc !== null && params.shipStat !== null) {
    orderByDirection = params.shipStatOrderAsc ? 'desc' : 'asc'
    orderById = `stat${params.shipStat}SortId`
  } else if (params.rarityOrderAsc != null) {
    orderById = 'ratingSortId'
    orderByDirection = params.rarityOrderAsc ? 'desc' : 'asc'
  }
  var orderClause = `orderBy: ${orderById}, orderDirection: ${orderByDirection}`

  const whereClause = `where:{ ${whereClauses.join(' , ')} }`
  const skipClause = `skip: ${params.offSet}`
  const filters = [pageSizeClause, whereClause, skipClause, orderClause].join(' , ')
  const query = gql`{
    shipFilters(${filters}){
      stakingPoolId
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
  }`
  return { query }
}

export function usePoolListQuery() {
  const query = gql`
    {
      stakingPools {
        id
        minStars
        maxStars
        lossBaseChance
        luckFactor
        entryFee
        exitFee
        numShips
        ships {
          ship {
            id
          }
        }
      }
    }
  `
  return { query }
}

export function useStakingPooluserQuery(user) {
  const query = gql`{
    stakingPoolUsers (where:{user:"${user}"}) {
      id
      stakingPoolId
      user
      numShips
    }
  }`
  return { query }
}
