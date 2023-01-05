import React, { useEffect, useState } from 'react';
import { assetURL, getDateDifferent, getNFTImageURL, getStarCount, getStarLevel } from '../../functions/deepspace';
import styled from 'styled-components'
import Image from 'next/image';
import cn from 'classnames'
import StarRatingComponent from 'react-star-rating-component';
import { MdShoppingCart, MdOutlinePublishedWithChanges } from 'react-icons/md';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { TextureColors, PAYMENT_DECIMALS } from '../../constants';
import { ethers } from 'ethers'
import { useShipSelects } from '../../state/others/hooks';
import CustomModal from '../../components/Modal/CustomModal'
import { useAddShipCard } from '../../state/others/hooks';
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import { ToastContainer } from 'react-toastr';

const ComponentStyle = styled.div`
    .sold-ship-card{
        border:2px solid cyan;
        padding:3px 12px;
        background-color:rgba(0,0,0,0.4);
        font-size:14px;
    }
    .sold-ship-image{
        width:60px;
    }
    .sold-ship-image > div{
        width:60px;
        height:55px;
        padding:3px;
        background-color:#000000b0;
        border-radius:9px;
    }
    .ship-status{
        width:105px;
    }
    .ship-id{
        width:120px;
        padding:0px 6px;
        cursor:pointer;
    }
    .ship-id > div{
        border-radius:6px;
        color:white;
        border:1px solid cyan;
        padding:0px 6px;
        width:100%;
        text-align:center;
        overflow:hidden;
        transition:.4s;
    }
    .ship-id > div:hover{
        background-color:rgb(255, 0, 210);
        color:white;
    }
    .ship-level{
        width:75px;
        text-align:center;
    }
    .ship-rating{
        width:90px;
    }
    .ship-price{
        width:150px;
        overflow:hidden;
    }
    .from-address, .to-address{
        width:70px;
        text-align:center;
        overflow:hidden;
        padding:0px 3px;
    }
    .transaction-time{
        width:120px;
        text-align:center;
    }
    .sold-ship-card .dv-star-rating{
        font-size:18px;
        display:flex!important;
        flex-direction: row-reverse;
        align-items:center;
        justify-content:center;
    }
`
export default function SoldShipCardDeskTop({ listingData, filterType }) {
  const { account } = useActiveWeb3React();
  let container;
  const [c, setC] = useState(null)
  const shipSelects = useShipSelects();
  const [showUnListModal, setShowUnListModal] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const addShipCard = useAddShipCard();
  useEffect(() => {
    if (container) {
      setC(container);
    }
  }, [container])
  const showToastr = (status) => {
    if (c) {
      let msg_type = "";
      switch (filterType) {
        case 'outpostNewListing':
          msg_type = 'buy this ship';
          break;
        case 'outpostMyListing':
          msg_type = 'unlist this ship';
          break;
      }
      if (status === 'accountDisconnect') c.error("Please connect wallet");
      if (status === 'aprroveReady') c.info("A one-time Approve request is required before getting started", "Message");
      if (status === 'approveSuccess') c.success(`Approve success. You can ${msg_type}. Please click confirm.`, 'Success');
      if (status === 'listPriceError') c.error("List price is not valid.", "Error");
      if (status === 'balanceNotEnough') c.error("Balance is not enough", "Error");
    }
  }
  const handleClick = (fType, ship) => {
    addShipCard(ship);
    if (fType === 'outpostNewListing') {
      if (account?.toLowerCase() === ship.seller) {
        setShowUnListModal(true);
      } else {
        setShowBuyModal(true);
      }
    }
    if (fType === 'outpostMyListing') {
      setShowUnListModal(true);
    }
  }
  const handleGoShipLink = (shipId) => (event) => {
    window.open(
      window.location.origin + "/shipLink/" + shipId,
      "_blank"
    );
    event.stopPropagation();

  }
  return (
    <>
      <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
      <ComponentStyle className='w-full sold-ship-card'>

        {
          (listingData && listingData.length) ? (
            <div className="flex justify-between text-center goldman-font" style={{ padding: "3px 12px", fontSize: "14px" }}>
              <div className="ship-status">

              </div>
              <div className="sold-ship-image">

              </div>
              <div className="ship-id">Ship Id</div>
              <div className="ship-rating">Ship Star</div>
              <div className="ship-level">Ship Level</div>
              <div className="ship-price">Price</div>
              {
                (filterType === 'outpostMySale' || filterType === 'outpostSale') && (
                  <>
                    <div className="from-address">From</div>
                    <div className="to-address">To</div>
                  </>
                )
              }
              <div className="transaction-time">Time</div>
            </div>
          ) : ('')
        }
        {
          (listingData && listingData.length) ? listingData.map((list, key) => {
            if (key == shipSelects) return;
            let ship, imageURL, shipId, rating, textureType, currentLevel, maxLevel, dateTime, price, displayStatus, m_buyer, m_seller, buyer, seller, len, fullBuyer, fullSeller;
            if (filterType === 'outpostNewListing') {
              displayStatus = "Listing";
            } else if (filterType === 'outpostMyListing') {
              displayStatus = "My Listing";
            } else if (filterType === 'outpostSale') {
              displayStatus = "Sale";
            } else if (filterType === 'outpostMySale') {
              displayStatus = "My Sale";
            }

            if ((filterType === 'outpostNewListing' || filterType === 'outpostMyListing') && list['listing']) {
              ship = list['listing'];
              imageURL = getNFTImageURL(ship.token.shipType, ship.token.textureType, ship.token.textureNum);
              shipId = ship.token.tokenId;
              rating = getStarCount(ship.token.stats);
              textureType = ship.token.textureType;
              currentLevel = getStarLevel(ship.token.stats).currentLevel;
              maxLevel = getStarLevel(ship.token.stats).maxLevel;
              price = ethers.utils.commify(+ethers.utils.formatUnits(ship.price, PAYMENT_DECIMALS).toString());
              dateTime = getDateDifferent(ship.listDate);
            } else if ((filterType === 'outpostSale' || filterType === 'outpostMySale') && list['ship']) {
              ship = list['ship'];
              imageURL = getNFTImageURL(ship.shipType, ship.textureType, ship.textureNum);
              shipId = ship.tokenId;
              rating = getStarCount(ship.stats);
              textureType = ship.textureType;
              currentLevel = getStarLevel(ship.stats).currentLevel;
              maxLevel = getStarLevel(ship.stats).maxLevel;
              price = ethers.utils.commify(+ethers.utils.formatUnits(list.purchasePrice, PAYMENT_DECIMALS).toString());
              dateTime = getDateDifferent(list.purchaseDate);
              fullBuyer = list.purchaseDetail.buyer;
              fullSeller = list.purchaseDetail.seller;
              len = fullBuyer.length;
              buyer = "0x" + fullBuyer.charAt(2) + "..." + list.purchaseDetail.buyer.slice(len - 2);
              m_buyer = fullBuyer.slice(0, 6) + "..." + list.purchaseDetail.buyer.slice(len - 4);
              seller = "0x" + fullSeller.charAt(2) + "..." + list.purchaseDetail.seller.slice(len - 2);
              m_seller = fullSeller.slice(0, 6) + "..." + list.purchaseDetail.seller.slice(len - 4);
            } else {
              return;
            }
            return (
              <div className={cn('sold-ship-card flex justify-between items-center w-full goldman-font mb-3 cursor-pointer', {
                'cursor-pointer': (filterType === 'outpostNewListing' || filterType === 'outpostMyListing')
              })} key={key} style={{ borderColor: `${TextureColors[textureType]}` }} onClick={() => handleClick(filterType, ship)}>
                <div className='flex items-center justify-between ship-status'>
                  <div className='mr-2'>
                    {
                      filterType === 'outpostNewListing' ? (
                        <MdOutlinePublishedWithChanges fontSize={18} />
                      ) : (
                        <MdShoppingCart fontSize={18} />
                      )
                    }
                  </div>
                  <div>{displayStatus}</div>
                </div>
                <div className='sold-ship-image'>
                  <div>
                    <Image src={imageURL} width={60} height={55} alt='' />
                  </div>
                </div>
                <div className='ship-id' onClick={handleGoShipLink(shipId)}><div>{shipId}</div></div>
                <div className='flex items-center justify-center ship-rating'>
                  <StarRatingComponent
                    name="shipRating"
                    starCount={5}
                    value={Number(rating)}
                    emptyStarColor={'#D1D5DB'}
                  />
                </div>
                <div className="ship-level">{currentLevel}/{maxLevel}</div>
                {/* <div>{ship.shipLevel}</div> */}
                {/* <div style={{ color: `${TextureColors[ship.textureRarity]}` }}>{TextureType[ship.textureRarity]}</div> */}
                <div className='flex items-center justify-center ship-price'>
                  <div className='pr-2'>{price}</div>
                  <Image
                    unoptimized={true}
                    src={assetURL("DPS-icon-96x96-1.png")}
                    alt="DEEPSPACE"
                    width="21px"
                    height="21px"
                    objectFit="contain"
                    className=""
                  />
                </div>
                {
                  filterType != 'outpostNewListing' && filterType != 'outpostMyListing' ? (
                    <>
                      <div className='cursor-pointer from-address' title={fullSeller}>{seller}</div>
                      <div className='cursor-pointer to-address' title={fullBuyer}>{buyer}</div>
                    </>
                  ) : (
                    ''
                  )

                }
                <div className='transaction-time'>{dateTime}</div>

              </div>
            )
          }) : ('')
        }
        <CustomModal show={showUnListModal} onClose={() => { setShowUnListModal(false); }} shipCardType="unlist-ship" showToastr={showToastr} />
        <CustomModal show={showBuyModal} onClose={() => { setShowBuyModal(false); }} shipCardType="buy-ship" showToastr={showToastr} />
      </ComponentStyle>
    </>

  )
}