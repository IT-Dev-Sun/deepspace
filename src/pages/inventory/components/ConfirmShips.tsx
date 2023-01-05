import React from 'react'
import { getNFTImageURL, getStarCount } from '../../../functions/deepspace';
import { SHIP_TYPES } from '../../../constants'
import StarRatingComponent from 'react-star-rating-component';
import styled from 'styled-components'
import ChooseShipSkeleton from '../../../components/SkeletonLoading/ChooseShipSkeleton'
import { useSelector } from 'react-redux'


const PageStyle = styled.div`
    width: 100%;
    .choose-ship{
      width: 100%;
      height: 260px;
      background: rgba(3, 58, 78, 0.85);
      border: 2px solid #00aeef;
      padding: 15px 5px 10px 10px;
    }
    .ship-container {
      width: 100%;
      height: 100%;
      padding-right: 5px;
      overflow-y: scroll;
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

const Header = styled.div`
  width: 100%;
  height: 25px;
  border: solid 1px #00AEEE;
  position: relative;
`
const HeaderBg = styled.div`
  width: 100%;
  height: 23px;
  background: black;
  opacity: 0.6;
`
const HeaderTable = styled.div`
  position: absolute;
  top: 0px;
  display: flex;
  align-items: center;
  width:100%;
  font-size: 10px;
`
const Indicator = styled.span`
`
const VeticalLine = styled.span`
  width: 1px;
  background: #00AEEE;
  height: 23px;
`
const ShipItemContainer = styled.div`
  width: 100%;
  height: 40px;
  border: solid 1px #00AEEE;
  position: relative;
  margin-top: 2px;
`

const ShipItemContainerBg = styled.div`
  width: 100%;
  height: 38px;
  background: black;
  opacity: 0.6;
`

const ShipItemVeticalLine = styled.span`
  width: 1px;
  background: #00AEEE;
  height: 38px;
`


const ConfirmShips = () => {

  const { confirmedShips } = useSelector((state: any) => state.bridge)

  return (
    <PageStyle>
      <div className="choose-ship goldman-font">
        <div className="ship-container custom-scrollbar">
          <Header>
            <HeaderBg></HeaderBg>
            <HeaderTable>
              <Indicator style={{ width: 40, textAlign: 'center' }}>ID</Indicator>
              <VeticalLine></VeticalLine>
              <Indicator style={{ width: 60, textAlign: 'center' }}>Type</Indicator>
              <VeticalLine></VeticalLine>
              <Indicator style={{ width: 80, display: 'flex', justifyContent: 'center' }}>Image</Indicator>
              <VeticalLine></VeticalLine>
              <Indicator style={{ width: 100, textAlign: 'center' }}>Star</Indicator>
            </HeaderTable>
          </Header>
          <div className='ships-container'>
            {confirmedShips ? (
              <>
                {confirmedShips?.map((item, key) => {
                  const stars = getStarCount(item.ship.stats)
                  const nftImageURL = getNFTImageURL(item.ship.shipType, item.ship.textureType, item.ship.textureNum)
                  const shipClass = SHIP_TYPES[item.ship.shipType]
                  return (
                    <div className='confirm-ship-lists' key={key}>
                      <ShipItemContainer>
                        <ShipItemContainerBg></ShipItemContainerBg>
                        <HeaderTable>
                          <Indicator style={{ width: 40, textAlign: 'center' }}>{item.ship.tokenId}</Indicator>
                          <ShipItemVeticalLine />
                          <Indicator style={{ width: 60, textAlign: 'center' }}>{shipClass}</Indicator>
                          <ShipItemVeticalLine />
                          <Indicator style={{ width: 80, display: 'flex', justifyContent: 'center' }}><img src={nftImageURL} width={25} height={25} alt={"shipImage"} /></Indicator>
                          <ShipItemVeticalLine />
                          <Indicator style={{ width: 100, textAlign: 'center' }}>
                            <StarRatingComponent
                              name="shipRating"
                              starCount={5}
                              value={stars}
                              emptyStarColor={'#D1D5DB'}
                            />
                          </Indicator>
                        </HeaderTable>
                      </ShipItemContainer>
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

export default ConfirmShips   