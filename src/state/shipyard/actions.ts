import { createAction } from '@reduxjs/toolkit'

export const setAllShips = createAction<any>('SET_ALL_SHIPS')
export const setCurrentShip = createAction<any>('SET_CURRENT_SHIP')

export const setShipYardAvailResources = createAction<any>('SET_AVAIL_RESOURCE')
export const plusAvailCoresBySalvageSuccess = createAction<any>('PLUS_AVAILE_CORES_BY_SALVAGE_SUCCESS')
export const setShipYardAvailCores = createAction<any>('SET_AVAIL_CORES')

export const plusStatByIndex = createAction<any>('UPGRADE_STATE_BYINDEX')
export const minusStatByIndex = createAction<any>('MINUS_STATE_BYINDEX')
export const setLevelIncreases = createAction<any>('SET_LEVELUP_VALUE')

export const setRequiredResources = createAction<any>('SET_REQUIRED_RESOURCES')

export const restartShipyard = createAction<any>('RESTART_SHIPYARD_UPGRADE')
export const upgradeShipNumCores = createAction<any>('UPGRADE_SHIP_CORE_NUMS')
export const reduceAvailCoresNum = createAction<any>('REDUCE_AVAIL_CORES_NUMS')
