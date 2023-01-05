import { createAction } from '@reduxjs/toolkit'

export const addFilterBox = createAction('others/addFilterBox')
export const removeFilterBox = createAction('others/removeFilterBox')
export const addShipCard = createAction<{ ship: any }>('others/addShipCard');
export const updateFilterData = createAction<{ ship: any }>('others/updateFilterData');
export const removeFilterData = createAction('others/removeFilterData');
export const updateShipSelects = createAction<number>('others/updateShipSelects');
export const updateLastID = createAction<string>('others/updateLastID');
export const updateFirstID = createAction<string>('others/updateFirstID');
export const addMultiShips = createAction<any>('others/addmultiShips');

