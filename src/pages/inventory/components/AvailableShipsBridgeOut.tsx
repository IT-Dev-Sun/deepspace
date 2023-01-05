import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { getNFTImageURL, getStarCount, nftURL } from '../../../functions/deepspace';
import { SHIP_TYPES } from '../../../constants'
import cn from 'classnames'
import StarRatingComponent from 'react-star-rating-component';
import styled from 'styled-components'
import ChooseShipSkeleton from '../../../components/SkeletonLoading/ChooseShipSkeleton'
import { AiOutlineSearch } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../state'
import { setAvailableShips, setConfirmShip } from '../../../state/bridge/actions'
import { shipDataByAccount } from '../../../services/graph/hooks/deepspace'
import { ToastContainer } from 'react-toastr';


const PageStyle = styled.div`
    width: 100%;
    .choose-ship{
      width: 100%;
      height: 200px;
      background: rgba(3, 58, 78, 0.85);
      border: 2px solid #00aeef;
      padding: 10px 10px 10px 10px;
    }
    .ship-container {
      width: 100%;
      height: 100%;
      padding-right: 10px;
      flex-wrap: wrap;
      overflow-y: scroll;
    }
    .ships-container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .cursor-pointer {
      width: 85px;
    }
    .dv-star-rating-star {
      font-size: 15px;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #00aeef; 
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #006f98; 
    }
    .custom-scrollbar::-webkit-scrollbar-button:single-button {
      background: #00aeef; 
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-button:single-button:active {
      background: #006f98;
    }
    .ship-search {
      position: relative;
      width: 110px;
      input::-webkit-input-placeholder { /* WebKit browsers */
        font-size: 12px;
      }
    }
    .serch-input {
      background: #021a22;
      color: #ffffff;
      padding-left: 24px;
      width: 100%;
      height: 35px;
      border: solid 1px #006f98;
    }
    .search-icon {
      position: absolute;
      top: 11px;
      left: 7px;
    }
    .ship-detail {
      padding: 2px;
      font-size: 11px;
    }
    .ship-img{
      margin-top:10px;
      transition:.5s;
      background-color: rgba(0, 0, 0, 0.5);
      border: solid 2px #00aeef;
      width: 85px;
      height: 85px;
    }
    .ship-img:hover, .ship-img.active{
        background-color:#0279a5;
    }
    .choose-ship-rating{
        line-height:0.87;

        .dv-star-rating-star.dv-star-rating-full-star {
          color: #F9FF00 !important;
        }
    }
    .choose-ship-rating .dv-star-rating{
        font-size:21px;
        display:flex!important;
        align-items:center;
        flex-direction: row-reverse;
        justify-content: flex-end;
    }
    .core-type-section{
      top: 5px;
      right: 5px;
    }
  }
`

const AvailableShipsBridgeOut = (props) => {

  let container;
  const [c, setC] = useState(null)

  const dispatch = useDispatch<AppDispatch>()
  const [chooseShip, setChooseShip] = useState(0);
  const [shipList, setShipList] = useState<any>([]);
  const [tempList, setTempList] = useState<any>([])
  const { availableShips } = useSelector((state: any) => state.bridge)
  const { data: shipData } = shipDataByAccount();
  const [refuelingShips, setRefuelingShips] = useState([])

  useEffect(() => {
    setC(container);
  }, [container])

  useEffect(() => {
    setRefuelingShips(props.refuelShips)
  }, [props.refuelShips])

  useEffect(() => {
    if (shipData?.length > 0) {
      dispatch(setAvailableShips(shipData))
    }
  }, [shipData])

  useEffect(() => {
    if ((props.bridgeOutShipIds.length > 0) && (availableShips.length > 0)) {
      let lockedShips = []
      props.bridgeOutShipIds.map((shipId) => {
        availableShips.map((shipData) => {
          const finalShipId = 'SHIP-' + shipId
          if (finalShipId === shipData.ship.id && shipData.ship.shipLocked) {
            lockedShips.push(shipData)
          }
        })
      })
      setShipList(lockedShips)
      setTempList(lockedShips)
    }

  }, [availableShips, props.bridgeOutShipIds])

  const showToastr = (status, time) => {
    if (c) {
      if (status === 'needFullReFuel') c.error("Ship not available for bridge-out until refueling completes at " + time, "Error");
    }
  }

  const selectShip = (singleShip, key) => {
    if (refuelingShips.length > 0) {
      refuelingShips.map((item) => {
        if (item.shipId === Number(singleShip.ship.tokenId)) {
          const date = new Date(item.fullRefuelAt);
          showToastr('needFullReFuel', `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
        } else {
          setChooseShip(key);
          dispatch(setConfirmShip(singleShip))
        }
      })
    } else {
      setChooseShip(key);
      dispatch(setConfirmShip(singleShip))
    }
  }

  const onFilterShipByID = (e: any) => {
    const filteredShips = tempList.filter((item) => item.ship.id.includes(e.target.value))
    setShipList(filteredShips)
  }

  return (
    <PageStyle>
      <div className="choose-ship goldman-font">
        <div className="ship-container custom-scrollbar">
          <div className='ship-search'>
            <span className='search-icon'>
              <AiOutlineSearch />
            </span>
            <input type="text" className="serch-input" placeholder="ID SEARCH" onChange={(e) => onFilterShipByID(e)} />
          </div>
          <div className='ships-container'>

            {shipList ? (
              <>
                {shipList?.map((item, key) => {
                  const stars = getStarCount(item.ship.stats)
                  const nftImageURL = getNFTImageURL(item.ship.shipType, item.ship.textureType, item.ship.textureNum)
                  const shipClass = SHIP_TYPES[item.ship.shipType]
                  const coreTypeImage = nftURL(`1/${item.ship.coreType}/0.svg`)
                  return (
                    <div className={cn('cursor-pointer')} key={key} onClick={() => selectShip(item, key)}>
                      <div className='relative ship-item'>
                        <div className={cn('ship-img', { 'active': key === chooseShip })} >
                          <img src={nftImageURL} width={70} height={70} alt={"shipImage"} />
                        </div>
                        <div className='ship-detail'>
                          <div>{shipClass}</div>
                          <div className='choose-ship-rating'>
                            <StarRatingComponent
                              name="shipRating"
                              starCount={5}
                              value={stars}
                              emptyStarColor={'#D1D5DB'}
                            />
                          </div>
                          <div style={{ fontSize: '10px' }}>SHIP-ID: {item.ship.tokenId}</div>
                        </div>
                        <div className='absolute core-type-section'>
                          <Image src={coreTypeImage} width={'15px'} height={'15px'} alt={'Core Type Image'} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              <ChooseShipSkeleton />
            )}
          </div>

        </div>
      </div>
      <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
    </PageStyle >
  )
}

export default AvailableShipsBridgeOut   