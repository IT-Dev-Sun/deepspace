import application from './application/reducer'
import burn from './burn/reducer'
import { combineReducers } from '@reduxjs/toolkit'
import create from './create/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import nfts from './nfts'
import others from './others/reducer'
import shipyard from './shipyard/reducer'
import bridge from './bridge/reducer'

const reducer = combineReducers({
  application,
  user,
  transactions,
  swap,
  mint,
  burn,
  multicall,
  lists,
  create,
  nfts,
  others,
  shipyard,
  bridge,
})

export default reducer
