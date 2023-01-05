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
import { setLevelIncreases, setCurrentShip, setRequiredResources } from '../../../state/shipyard/actions'
import { RESOURCE_LIST } from '../../../constants/deepspace'


const PageStyle = styled.div`
    width: 113px;
    height: 595px;
    @media(max-device-width:820px) {
      width: 370px;
      height: 210px;
      margin: 0 auto;
      float: none !important;
      margin-bottom: 20px;
      .choose-ship.goldman-font {
        height: 210px;
        .ships-container {
          .cursor-pointer {
            width: 26%;
            float: left;
            margin-right: 7%;
          }
        }
      }
    }
    .choose-ship{
      width: 100%;
      background: rgba(3, 58, 78, 0.85);
      border: 2px solid #00aeef;
      padding: 5px 10px 5px 5px;
      height: 595px;
      
    }
    .ship-container {
      display: flex;
      width: 100%;
      height: 100%;
      padding-right: 8px;
      flex-direction: column;
      overflow-y: scroll;
      overflow-x: hidden;
     
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
    .ships-title {
      margin: 7px 0px 0px;
      border-bottom: 2.5px solid #006f98;
      h3 {
        font-size: 12px;
        margin-bottom: 2px;
      }

    }
    .ship-search {
      position: relative;
      margin-top: 8px;
      width: 100%;

      input::-webkit-input-placeholder { /* WebKit browsers */
        font-size: 12px;
      }
    }
    .serch-input {
      background: #021a22;
      color: #ffffff;
      padding-left: 19px;
      width: 100%;
      height: 25px;
      border: solid 1px #006f98;
    }
    .serch-input::placeholder {
      font-size: 9px !important;
      color: white;
    }
    .search-icon {
      position: absolute;
      top: 5px;
      left: 4px;
      color: #b9b6b6;
    }
 
    .ship-img {
      background-color: rgba(0, 0, 0, 0.5);
      border: solid 2px #00aeef;
    }
    .ship-detail {
      padding: 2px;
      font-size: 11px;
      &>div:first-child {
        font-size: 9px !important;
        line-height: 10px;
        margin-top: 1px;
      }
      &>div:last-child {
        font-size: 9px !important;
        line-height: 10px;
        margin-top: 1px;
        margin-bottom: 10px;
      }
    }
    .ship-img{
        margin-top:6px;
        transition:.5s;
    }
    .ship-img:hover, .ship-img.active{
        background-color:#0279a5;
    }
    .choose-ship-rating{
        line-height:0.8em;
        margin-top: 1px;
        .dv-star-rating-star.dv-star-rating-full-star {
          color: #F9FF00 !important;
        }
        label>i {
          font-size: 0.8em;
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

const ChooseShip = (props) => {

  const dispatch = useDispatch<AppDispatch>()

  const [chooseShip, setChooseShip] = useState(0);
  const { allShips, currentShip } = useSelector((state: any) => state.shipyard)
  const [shipList, setShipList] = useState<any>([]);

  useEffect(() => {
    setShipList(allShips)
  }, [allShips])

  const selectShip = (singleShip, key) => {
    setChooseShip(key);
    dispatch(setCurrentShip(singleShip))
    getInitialResources()
    dispatch(setLevelIncreases([0, 0, 0, 0, 0, 0, 0, 0]))
  }

  const getInitialResources = async () => {
    let require_resources = []
    RESOURCE_LIST.map((item: any, index: number) => {
      const netItem = { ...item, quantity: 0 }
      require_resources.push(netItem)
    })
    dispatch(setRequiredResources(require_resources))
  }

  const onFilterShipByID = (e: any) => {
    const filteredShips = allShips.filter((item) => item.ship.id.includes(e.target.value))
    setShipList(filteredShips)
  }

  return (
    <PageStyle>
      <div className="choose-ship goldman-font">
        <div className="ship-container custom-scrollbar">
          <div className='ships-title'>
            <h3>SHIPS</h3>
          </div>
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
                          <img src={nftImageURL} width={'100%'} height={'100%'} alt={"shipImage"} />
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

    </PageStyle >
  )
}

export default ChooseShip   