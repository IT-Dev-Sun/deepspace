import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Image from 'next/image'
import cn from 'classnames'
import { usePurchaseDetails } from '../../services/graph/hooks/deepspace'
import { assetURL, detectBrowser, getDateDifferent, getNFTImageURL } from '../../functions/deepspace';
import { PAYMENT_DECIMALS } from '../../constants';
import { ethers } from 'ethers';
import { useShipCard } from '../../state/others/hooks';
import { AiFillCloseCircle } from 'react-icons/ai'
import config from '../../config'

const ComponentStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  max-height: 100vh;
  .modal-body{
    width:600px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .browser-1{
    background-image:url(${config.ASSETS_BASE_URI}app/modals/modal-6.png);
  }
  .browser-2{
    background-image:url(../images/modal_1.png);
  }
  
  .mobile-body-1{
    background-image:url(../images/sign_card.png);
  }
  .mobile-body-2{
    background-image:url(../images/sign_card_1.png);
  }
  .ship-image{
    width:65px;
    height:55px;
    overflow:hidden;
    border-radius:6px;
    background-color:gray;
  }
  .modal-content{

  }
  .purchase-header{
    font-size:21px;
  }
  .ship-id{
    font-size:13px;
  }
  .purchase-list{
    min-height:100px;
    max-height:300px;
    overflow:auto;
    padding-bottom:6px;
    font-size:14px;
  }
  .purchase-list::-webkit-scrollbar {
    width: 9px;
    }
  .purchase-list::-webkit-scrollbar-track {
      background-color:transparent;
      border-radius:6px;
      border:1px solid gray;
      overflow:hidden;
  }
  .purchase-list::-webkit-scrollbar-thumb {
      background-color:#0A1014;
      border-radius:6px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  .ship-item{
    background-color: #1fd9aa52;
    box-shadow: 0px 0px 4px 1px rgb(44 37 24);
    border-radius:3px;
    margin-top:12px;
    padding:6px 12px;
  }
  @media(max-width:640px){
    .purchase-header{
      font-size:16px;
    }
    .ship-id{
      font-size:11px;
      margin-top:3px;
    }
  }
  @media(max-width:630px){
    .modal-body{
      width:320px;
    }
    .purchase-list{
      font-size:12px;
      max-height:200px;
    }
  }
`
interface ComponentProps {
  show: boolean
  shipId: number
  onClose: () => void
}

export default function PurchaseDetailModal({ show, shipId, onClose }: ComponentProps) {
  const [isBrowser, setIsBrowser] = useState(false);
  const shipCard = useShipCard();
  const [shipImage, setShipImage] = useState(null);
  const browserType = detectBrowser();
  useEffect(() => {
    setIsBrowser(true);
  }, [])
  useEffect(() => {
    if (shipCard) {
      setShipImage(getNFTImageURL(shipCard.shipType, shipCard.textureType, shipCard.textureNum));
    }
  }, [shipCard])
  const { data: shipData, mutate, error } = usePurchaseDetails(shipId);
  const modalContent = show ? (
    <ComponentStyle className="z-50 Modal">
      <div className='flex justify-content-center'>
        <div className={cn('px-3 py-2 modal-body', {
          'browser-1': browserType !== 'Firefox',
          'browser-2': browserType === 'Firefox',
          "mobile-body-1": window.innerWidth <= 768 && browserType !== 'Firefox',
          "mobile-body-2": window.innerWidth <= 768 && browserType === 'Firefox'
        })}>
          <div className='modal-content relative w-full py-3 sm:px-3'>
            <div className='absolute right-1 top-2 cursor-pointer z-1'>
              <AiFillCloseCircle fontSize={18} onClick={() => onClose()} />
            </div>
            <div className='absolute left-0 top-0 w-full h-full' style={{ zIndex: -1 }}>
              <div className='flex justify-center items-center w-full h-full'>
                <div>
                  <Image src={shipImage} width={'200px'} height={'150px'} alt={'Ship Image'} />
                </div>
              </div>
            </div>
            <div className='relative'>
              <div className='text-center goldman-font purchase-header mt-7 mb-2' style={{ color: 'cyan' }}>Purchase Details-<small>{shipCard ? shipCard.tokenId : ''}</small></div>
            </div>
            <div className='flex justify-between items-center goldman-font'>
            </div>
            <div className='w-full purchase-list '>
              {
                shipData && shipData.length && shipData.map((ship, key) => {
                  let fullBuyer, fullSeller, len, buyer, seller, purchaseDate, formattedPrice, shipImage;
                  const id = ship.tokenId;
                  fullBuyer = ship.buyer;
                  fullSeller = ship.seller;
                  len = fullBuyer.length;
                  buyer = "0x" + fullBuyer.charAt(2) + "..." + ship.buyer.slice(len - 2);
                  seller = "0x" + fullSeller.charAt(2) + "..." + ship.seller.slice(len - 2);
                  formattedPrice = ethers.utils.commify(+ethers.utils.formatUnits(ship.price, PAYMENT_DECIMALS).toString())
                  purchaseDate = getDateDifferent(ship.purchaseDate);
                  return (
                    <div key={key} className="flex justify-between w-full ship-item items-center py-2">
                      <div style={{ width: '32px' }}>{key + 1}</div>
                      <div title={fullSeller} style={{ width: '52px' }}>{seller}</div>
                      <div title={fullBuyer} style={{ width: '52px' }}>{buyer}</div>
                      <div style={{ width: '70px' }} className='flex items-center justify-end'>
                        <div>{formattedPrice}</div>
                        <div className='pl-1 mt-1'>
                          <Image
                            unoptimized={true}
                            src={assetURL("DPS-icon-96x96-1.png")}
                            alt="DEEPSPACE"
                            width="15px"
                            height="15px"
                            objectFit="contain"
                            className=""
                          />
                        </div>
                      </div>
                      <div className='text-right' style={{ width: '100px' }}>{purchaseDate}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </ComponentStyle>
  ) : null
  if (!isBrowser) return null;
  else {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'))
  }
}