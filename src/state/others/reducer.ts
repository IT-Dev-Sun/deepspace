import { createReducer } from '@reduxjs/toolkit'
import { FILTER_DATA } from '../../constants'

import {
  addFilterBox,
  removeFilterBox,
  addShipCard,
  updateFilterData,
  removeFilterData,
  updateShipSelects,
  updateLastID,
  updateFirstID,
  addMultiShips
} from './actions'


export interface ApplicationState {
  readonly filterBox: boolean
  readonly shipCard: any
  readonly filterData:any
  readonly shipSelects:number
  readonly lastID:string
  readonly firstID:string
  readonly multiShips:any
}

const initialState: ApplicationState = {
  filterBox: true,
  shipCard:{},
  shipSelects:2,
  filterData:FILTER_DATA,
  lastID:null,
  firstID:null,
  multiShips:[]
}

export default createReducer(initialState, (builder) =>{
  builder
    .addCase(addFilterBox, (state) => {
      state.filterBox = true
    })
    .addCase(removeFilterBox, (state) => {
      state.filterBox = false
    }).addCase(addShipCard, (state, action) => {
      state.shipCard = action.payload;
    }).addCase(updateFilterData, (state, action) => {
      let data =  Object.assign({...state.filterData},{...action.payload});
      state.filterData = {...data };
    }).addCase(removeFilterData, (state, action) => {
      state.filterData = FILTER_DATA;
    }).addCase(updateShipSelects,(state, action)=>{
      state.shipSelects = action.payload;
    }).addCase(updateLastID,(state, action)=>{
      state.lastID = action.payload;
    }).addCase(updateFirstID,(state, action)=>{
      state.firstID = action.payload;
    }).addCase(addMultiShips,(state,action)=>{
      state.multiShips=action.payload;
    })    
}
)
