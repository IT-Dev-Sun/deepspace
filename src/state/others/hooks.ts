import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SHIP_SELECT_LIST } from '../../constants'
import { AppState } from '../index'
import {
  addFilterBox,
  addMultiShips,
  addShipCard,
  removeFilterBox,
  removeFilterData,
  updateFilterData,
  updateFirstID,
  updateLastID,
  updateShipSelects
} from './actions'

// returns a function that allows adding a popup
export function useAddFilterBox(): () => void {
  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(addFilterBox())
  }, [dispatch])
}

// returns a function that allows removing a popup via its key
export function useRemoveFilterBox(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(removeFilterBox())
  }, [dispatch])
}

// get the list of active popups
export function useFilterBox(): AppState['others']['filterBox'] {
  const filterBox = useSelector((state: AppState) => state.others.filterBox)
  return useMemo(() => filterBox, [filterBox])
}

export function useAddShipCard(): (shipCard: any) => void {
  const dispatch = useDispatch()
  return useCallback(
    (shipCard) => {
      if (shipCard) {
        dispatch(addShipCard(shipCard))
      }
    },
    [dispatch]
  )
}
export function useShipCard(): AppState['others']['shipCard'] {
  const shipCard = useSelector((state: AppState) => state.others.shipCard)
  return useMemo(() => shipCard, [shipCard])
}
export function useUpdateFilterData():(filterData: any) => void {
  const dispatch = useDispatch();
  return useCallback(
    (filterData)=>{
      if(filterData){
        dispatch(updateFilterData(filterData));
      }
    },
    [dispatch]
  )
}
export function useRemoveFilterData():()=>void{
  const dispatch=useDispatch();
  return useCallback(()=>{
    dispatch(removeFilterData());
  },[dispatch])
}
export function useFilterData():AppState['others']['filterData']{
  const filterData = useSelector((state: AppState) => state.others.filterData);
  return useMemo(() => filterData, [filterData]);
}

export function useUpdateShipSelects():(shipSelects:number) => void{  
  const dispatch = useDispatch();
  return useCallback(
    (shipSelects)=>{
      dispatch(updateShipSelects(shipSelects))
    },
    [dispatch]
  )
}
export function useShipSelects():AppState['others']['shipSelects']{
  let shipSelects = useSelector((state:AppState)=>state.others.shipSelects);
  if(SHIP_SELECT_LIST.indexOf(shipSelects)==-1){
    shipSelects = SHIP_SELECT_LIST[0];
  }
  return useMemo(()=>shipSelects,[shipSelects]);
}

export function useUpdateLastID():(lastID:string) => void{  
  const dispatch = useDispatch();
  return useCallback(
    (lastID)=>{
      dispatch(updateLastID(lastID))
    },
    [dispatch]
  )
}
export function useLastID():AppState['others']['lastID']{
  const lastID = useSelector((state:AppState)=>state.others.lastID);
  return useMemo(()=>lastID,[lastID]);
}

export function useUpdateFirstID():(firstID:string) => void{  
  const dispatch = useDispatch();
  return useCallback(
    (firstID)=>{
      dispatch(updateFirstID(firstID))
    },
    [dispatch]
  )
}
export function useFirstID():AppState['others']['firstID']{
  const firstID = useSelector((state:AppState)=>state.others.firstID);
  return useMemo(()=>firstID,[firstID]);
}
export function useAddMultiShips():(multiShips:any)=>void{
  const dispatch = useDispatch();
  return useCallback(
    (multiShips)=>{
      dispatch(addMultiShips(multiShips))
    },
    [dispatch]
  )
}
export function useMultiShips():AppState['others']['multiShips']{
  const multiShips = useSelector((state:AppState)=>state.others.multiShips);
  return useMemo(()=>multiShips,[multiShips]);
}