import { createAction } from '@reduxjs/toolkit'

export const setAvailableShips = createAction<any>('SET_AVAILABLE_SHIPS')
export const setConfirmShip = createAction<any>('SET_CONFIRM_SHIP')

export const reSetConfirmData = createAction<any>('RESET_CONFIRM_BRIDGE')
export const refreshConfirmArea = createAction<any>('REFRESH_CONFIRM_BRIDGE')
export const setAvailableResources = createAction<any>('SET_AVAILABLE_RESOURCES')

export const reSetBridgeIn = createAction<any>('RESET_BRIDGE_In')

export const setResourceConfirm = createAction<any>('SET_RESOURCE_CONFIRM')
export const setResourceConfirmWithNumber = createAction<any>('SET_RESOURCE_CONFIRM_WITH_NUMBER')
export const setConfirmDps = createAction<any>('SET_CONFIRM_DPS')

export const reSetBridgeConfirmData = createAction<any>('RESET_BRIDGEOUT_CONFIRMDATA')
