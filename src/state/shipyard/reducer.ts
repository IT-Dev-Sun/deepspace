import { createReducer } from '@reduxjs/toolkit'
import { SHIP_CORE_TYPES } from '../../constants'
import {
  setAllShips,
  setCurrentShip,
  setShipYardAvailResources,
  setShipYardAvailCores,
  plusStatByIndex,
  setLevelIncreases,
  setRequiredResources,
  upgradeShipNumCores,
  reduceAvailCoresNum,
  minusStatByIndex,
  plusAvailCoresBySalvageSuccess,
} from './actions'

const initialState: any = {
  allShips: [],
  currentShip: null,
  avail_resources: [],
  avail_cores: [],
  levelIncreases: [],
  required_resources: [],
  error: null,
  loading: false,
}

export default createReducer<any>(initialState, (builder) =>
  builder
    .addCase(setAllShips, (state, { payload }) => {
      return {
        ...state,
        allShips: payload,
      }
    })
    .addCase(setCurrentShip, (state, { payload }) => {
      return {
        ...state,
        currentShip: payload,
      }
    })
    .addCase(setShipYardAvailResources, (state, { payload }) => {
      return {
        ...state,
        avail_resources: payload,
      }
    })
    .addCase(setShipYardAvailCores, (state, { payload }) => {
      return {
        ...state,
        avail_cores: payload,
      }
    })
    .addCase(plusStatByIndex, (state, { payload }) => {
      let shipData = { ...state.currentShip }
      shipData.ship = { ...shipData.ship }
      shipData.ship.stats = [...shipData.ship.stats]
      shipData.ship.stats.map((item, key) => {
        if (key === payload) shipData.ship.stats[key] = item + 1
      })
      return {
        ...state,
        currentShip: {
          ...shipData,
        },
      }
    })
    .addCase(minusStatByIndex, (state, { payload }) => {
      let shipData = { ...state.currentShip }
      shipData.ship = { ...shipData.ship }
      shipData.ship.stats = [...shipData.ship.stats]
      shipData.ship.stats.map((item, key) => {
        if (key === payload) shipData.ship.stats[key] = item - 1
      })
      return {
        ...state,
        currentShip: {
          ...shipData,
        },
      }
    })

    .addCase(setLevelIncreases, (state, { payload }) => {
      return {
        ...state,
        levelIncreases: payload,
      }
    })
    .addCase(setRequiredResources, (state, { payload }) => {
      return {
        ...state,
        required_resources: payload,
      }
    })
    .addCase(upgradeShipNumCores, (state, { payload }) => {
      state.currentShip.ship.numCores = state.currentShip.ship.numCores + payload
    })
    .addCase(reduceAvailCoresNum, (state, { payload }) => {
      let currentCoreType = SHIP_CORE_TYPES[state.currentShip.ship.coreType]
      state.avail_cores.map((item) => {
        if (item.type === currentCoreType) {
          item.quantity = item.quantity - payload
        }
      })
    })
    .addCase(plusAvailCoresBySalvageSuccess, (state, { payload }) => {
      let currentCoreType = SHIP_CORE_TYPES[payload.coreType]
      state.avail_cores.map((item) => {
        if (item.type === currentCoreType) {
          item.quantity = item.quantity + payload.coreNums
        }
      })
    })
)
