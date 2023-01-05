import { createReducer } from '@reduxjs/toolkit'
import {
  setAvailableShips,
  setConfirmShip,
  reSetConfirmData,
  refreshConfirmArea,
  setAvailableResources,
  setResourceConfirm,
  setResourceConfirmWithNumber,
  setConfirmDps,
  reSetBridgeConfirmData,
  reSetBridgeIn,
} from './actions'

const initialState: any = {
  availableShips: [],
  confirmedShips: [],
  availableResources: [],
  confirmResources: [],
  error: null,
  loading: false,
  confirmDpsValue: 'Confirm DPS',
}

export default createReducer<any>(initialState, (builder) =>
  builder
    .addCase(setAvailableShips, (state, { payload }) => {
      return {
        ...state,
        availableShips: payload,
      }
    })
    .addCase(setConfirmShip, (state, { payload }) => {
      state.confirmedShips.push(payload)
      state.availableShips = state.availableShips.filter((item, index) => item.ship.id !== payload.ship.id)
    })
    .addCase(reSetConfirmData, (state, { payload }) => {
      state.confirmDpsValue = initialState.confirmDpsValue
      state.availableShips = [...state.availableShips, ...payload.confirmedShips]
      state.confirmedShips = []
      if (payload.confirmResources.length > 0) {
        payload.confirmResources.map((confirmItem) => {
          state.availableResources.map((availItem) => {
            if (confirmItem.pid === availItem.pid) {
              availItem.quantity = availItem.quantity + confirmItem.quantity
            }
          })
        })
      }
      state.confirmResources = []
    })
    .addCase(refreshConfirmArea, (state, { payload }) => {
      state.confirmDpsValue = initialState.confirmDpsValue
      state.confirmedShips = []
      state.confirmResources = []
    })

    .addCase(reSetBridgeIn, (state, { payload }) => {
      state.confirmDpsValue = initialState.confirmDpsValue
      state.confirmedShips = []
      state.confirmResources = []
    })

    .addCase(setAvailableResources, (state, { payload }) => {
      state.availableResources = payload
    })
    .addCase(reSetBridgeConfirmData, (state, { payload }) => {
      state.confirmedShips = initialState.confirmedShips
      state.confirmResources = initialState.confirmResources
      state.confirmDpsValue = initialState.confirmDpsValue
    })
    .addCase(setConfirmDps, (state, { payload }) => {
      state.confirmDpsValue = payload
    })
    .addCase(setResourceConfirm, (state, { payload }) => {
      if (state.confirmResources !== undefined && state.confirmResources.length > 0) {
        const confrimedPids = state.confirmResources.map((item) => {
          return item.pid
        })
        if (confrimedPids.includes(payload.pid)) {
          state.confirmResources.map((item) => {
            if (item.pid === payload.pid) {
              item.quantity = item.quantity + 1
              state.availableResources.map((availItem) => {
                if (availItem.pid === payload.pid) {
                  availItem.quantity = availItem.quantity - 1
                }
              })
            }
          })
        } else {
          const newConfirmResourceItem = { ...payload, quantity: 1 }
          state.confirmResources.push(newConfirmResourceItem)
          state.availableResources.map((availItem) => {
            if (availItem.pid === newConfirmResourceItem.pid) {
              availItem.quantity = availItem.quantity - 1
            }
          })
        }
      } else {
        const newConfirmResourceItem = { ...payload, quantity: 1 }
        state.confirmResources.push(newConfirmResourceItem)
        state.availableResources.map((availItem) => {
          if (availItem.pid === newConfirmResourceItem.pid) {
            availItem.quantity = availItem.quantity - 1
          }
        })
      }
    })
    .addCase(setResourceConfirmWithNumber, (state, { payload }) => {
      if (state.confirmResources !== undefined && state.confirmResources.length > 0) {
        const confrimedPids = state.confirmResources.map((item) => {
          return item.pid
        })
        if (confrimedPids.includes(payload.item.pid)) {
          state.confirmResources.map((item) => {
            if (item.pid === payload.item.pid) {
              item.quantity = item.quantity + payload.resouceNum
              state.availableResources.map((availItem) => {
                if (availItem.pid === payload.item.pid) {
                  availItem.quantity = availItem.quantity - payload.resouceNum
                }
              })
            }
          })
        } else {
          const newConfirmResourceItem = { ...payload.item, quantity: payload.resouceNum }
          state.confirmResources.push(newConfirmResourceItem)
          state.availableResources.map((availItem) => {
            if (availItem.pid === newConfirmResourceItem.pid) {
              availItem.quantity = availItem.quantity - payload.resouceNum
            }
          })
        }
      } else {
        const newConfirmResourceItem = { ...payload.item, quantity: payload.resouceNum }
        state.confirmResources.push(newConfirmResourceItem)
        state.availableResources.map((availItem) => {
          if (availItem.pid === newConfirmResourceItem.pid) {
            availItem.quantity = availItem.quantity - payload.resouceNum
          }
        })
      }
    })
)
