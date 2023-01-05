export interface GSRoute {
  id: string
  name: string
}

export interface GSListing extends GSRoute {
  icon: string
  config: GSItemListConfig
}

export interface GSItemListConfig {
  hasConsumables: boolean
  hasNonConsumables: boolean
}

export const defaultGSItemListConfig: GSItemListConfig = {
  hasConsumables: true,
  hasNonConsumables: true,
}

export const defaultGSConsumablesListConfig: GSItemListConfig = {
  hasConsumables: true,
  hasNonConsumables: false,
}

export const defaultGSNonConsumablesListConfig: GSItemListConfig = {
  hasConsumables: false,
  hasNonConsumables: true,
}
