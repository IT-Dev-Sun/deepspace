import { ENV_TYPES } from '../constants'
import * as dps from './deepspace'

export const ENV_VAR = process.env['NEXT_PUBLIC_ENVIRONMENT']
  ? process.env.NEXT_PUBLIC_ENVIRONMENT.toUpperCase()
  : 'DEVELOPMENT'

export const ENVIRONMENT = ENV_TYPES[ENV_VAR]

function getConfig(envKey: string, defaultValue: any) {
  const varName = 'NEXT_PUBLIC_' + envKey
  if (process.env[varName]) {
    return process.env[varName]
  }
  return defaultValue
}

const ENV_PAGES = {
  [ENV_TYPES.DEVELOPMENT]: [
    'swap',
    'outpost-ships',
    'galactic-store',
    'inventory-ships',
    'shipyard',
    'staking',
    'play',
    'docs',
  ],
  [ENV_TYPES.TEST]: [
    'swap',
    'outpost-ships',
    'galactic-store',
    'inventory-ships',
    'shipyard',
    'staking',
    'play',
    'docs',
  ],
  [ENV_TYPES.PRODUCTION]: ['swap', 'outpost-ships', 'inventory-ships', 'shipyard', 'staking', 'play', 'docs'],
}

const ENV_BUTTONS = {
  [ENV_TYPES.DEVELOPMENT]: ['Lock', 'Unlock', 'Sync Ships', 'Ship Locked'],
  [ENV_TYPES.TEST]: ['Lock', 'Unlock', 'Sync Ships', 'Ship Locked'],
  [ENV_TYPES.PRODUCTION]: ['Lock', 'Unlock', 'Sync Ships', 'Ship Locked'],
}
//    'Due to occasional network congestion, indexing may run behind preventing you from seeing search results immediately. Please be patient', // if you don't to want dispaly set is to undefined,
const ENV_BANNER_ALERT = {
  [ENV_TYPES.DEVELOPMENT]: undefined,
  [ENV_TYPES.TEST]: undefined,
  [ENV_TYPES.PRODUCTION]: undefined, // if you don't to want dispaly set is to undefined,
}

const config = {
  ENVIRONMENT: ENV_TYPES[ENVIRONMENT],
  PAGES: ENV_PAGES[ENVIRONMENT],
  DEFAULT_CHAIN: getConfig('DEFAULT_CHAIN', dps.ENV_DEFAULT_CHAIN[ENVIRONMENT]),
  DPS_TOKEN_ADDRESS: getConfig('DPS_TOKEN_ADDRESS', dps.ENV_DPS_TOKEN_ADDRESS[ENVIRONMENT]),
  DPS_APP_ADDRESS: getConfig('DPS_APP_ADDRESS', dps.ENV_DPS_APP_ADDRESS[ENVIRONMENT]),
  DPS_CORES_ADDRESS: getConfig('DPS_CORES_ADDRESS', dps.ENV_DPS_CORES_ADDRESS[ENVIRONMENT]),
  DPS_SHIPYARD_ADDRESS: getConfig('DPS_SHIPYARD_ADDRESS', dps.ENV_DPS_SHIPYARD_ADDRESS[ENVIRONMENT]),

  DPS_RESOURCE_ADDRESS: getConfig('DPS_RESOURCE_ADDRESS', dps.ENV_DPS_RESOURCE_ADDRESS[ENVIRONMENT]),
  DPS_RESOURCE_SWAP_ADDRESS: getConfig('DPS_RESOURCE_SWAP_ADDRESS', dps.ENV_DPS_RESOURCE_SWAP_ADDRESS[ENVIRONMENT]),
  REFERRAL_ADDRESS: getConfig('REFERRAL_ADDRESS', dps.ENV_REFERRAL_ADDRESS[ENVIRONMENT]),
  SHIPS_ADDRESS: getConfig('SHIPS_ADDRESS', dps.ENV_SHIPS_ADDRESS[ENVIRONMENT]),
  BRIDGE_ADDRESS: getConfig('BRIDGE_ADDRESS', dps.ENV_BRIDGE_ADDRESS[ENVIRONMENT]),
  RESOURCE_BRIDGE_ADDRESS: getConfig('RESOURCE_BRIDGE_ADDRESS', dps.ENV_RESOURCE_BRIDGE_ADDRESS[ENVIRONMENT]),
  DPS_STORE_ADDRESS: getConfig('DPS_STORE_ADDRESS', dps.ENV_DPS_STORE_ADDRESS[ENVIRONMENT]),

  STAKING_ADDRESS: getConfig('STAKING_ADDRESS', dps.ENV_STAKING_ADDRESS[ENVIRONMENT]),
  TOKENPRICE_ADDRESS: getConfig('TOKENPRICE_ADDRESS', dps.ENV_TOKENPRICE_ADDRESS[ENVIRONMENT]),
  ASSETS_BASE_URI: getConfig('ASSETS_BASE_URI', dps.ENV_ASSETS_BASE_URI[ENVIRONMENT]),
  API_URL: getConfig('API_URI', dps.ENV_API_URL[ENVIRONMENT]),
  SUBGRAPH_NFT: getConfig('SUBGRAPH_NFT', dps.ENV_SUBGRAPH_NFT[ENVIRONMENT]),
  BRIDGE_OUT_URI: getConfig('BRIDGE_OUT_URI', dps.ENV_API_URL[ENVIRONMENT] + dps.ENV_BRIDGE_OUT_URI[ENVIRONMENT]),
  SIGNUP_URI: getConfig('SIGNUP_URI', dps.ENV_API_URL[ENVIRONMENT] + dps.ENV_SIGNUP_URI[ENVIRONMENT]),
  PWRECOVERY_URI: getConfig('PWRECOVERY_URI', dps.ENV_API_URL[ENVIRONMENT] + 'PasswordRecovery'),
  DAILYSHIPSALES_URI: getConfig('DAILYSHIPSALES_URI', dps.ENV_API_URL[ENVIRONMENT] + 'DailyShipSales'),
  BUTTONS: ENV_BUTTONS[ENVIRONMENT],
  BANNER_ALERT: ENV_BANNER_ALERT[ENVIRONMENT],
  MARKETPLACE_ADDRESS: getConfig('MARKETPLACE_ADDRESS', dps.ENV_MARKETPLACE_ADDRESS[ENVIRONMENT]),
  BSCSCAN_API_KEY: dps.ENV_BSCSCAN_API_KEY[ENVIRONMENT],
  BRIDGE_OUT_APIURI: getConfig('BRIDGE_OUT_APIURI', dps.BRIDGE_OUT_APIURI[ENVIRONMENT]),
}

export default config
