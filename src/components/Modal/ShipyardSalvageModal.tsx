import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import cn from 'classnames'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import config from '../../config'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { BigNumber } from 'ethers'
import LoadingSpinner from '../LoadingSpinner'
import { useDpsShipyardContract, useDpsResourcesContract } from '../../hooks'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { detectBrowser, nftURL, getNFTImageURL, getStarCount } from '../../functions/deepspace'
import StarRatingComponent from 'react-star-rating-component';
import { ethers } from 'ethers'
import DPS_SHIPYARD_ABI from '../../constants/abis/DPS_Shipyard.json'
import { SHIP_CORE_TYPES } from '../../constants/deepspace'
import { AppDispatch } from '../../state'
import { setShipYardAvailResources, plusAvailCoresBySalvageSuccess } from '../../state/shipyard/actions'

import "toastr/build/toastr.css";
import "animate.css/animate.css";


const StyledCard = styled.div`
  z-index: 1002;
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
  overflow: auto;
  font-size:14px;
  .body {
    justify-content: center;
    width: auto;
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
  .body .card-container{
    padding-right:2px!important;
  }
  .mintAmount{
    width:30px;
    margin-left:12px;
    font-size:18px;
    background-color:transparent;
    border-bottom:2px solid white;
    text-align:center;
    color:cyan;
    font-weight:bold;
    -o-appearance: none;
   -ms-appearance: none;
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   padding-right:6px;
   cursor:pointer;

  }
  .mintAmount option{
    background-color:white;
    cursor:pointer;
    color:#333;
    font-size:14px;
  }
  .mintAmount:focus-visible{
    outline:unset!important;
  }

  .total-mint-value span{
      color:cyan;
      font-weight:bold
  }
  .bridge-font-title {
    font-size: 15px;
  }

  .bridge-font {
    font-size: 16px;
  }
  .modal-container {
    width: 400px;
    height: 300px;
  }
  .title-container {
    margin-bottom: 20px;
  }
  .staking-table table{
    width:100%;
    border-collapse:collapse;
    max-height:300px;
    overflow:auto;
    min-width:420px;
  }
  .staking-table table tr td,th{
      font-size:14px;
      padding:3px 12px;
      border:1px solid gray;
      border-collapse:collapse;
  }
  .shipyard-modal {
    width: 500px;
  }

  @media(max-width:500px){
    .staking-table table{
        min-width:initial;
    }
    .staking-table table tr,td,th{
        font-size:12px!important;
        padding:3px 6px;
    }
  }

  @media(max-device-width:1030px) {
    .resource-swap-modal{
      width: 350px;
      display: flex;
      
    }
  }

  @media(max-width:1030px) {
    .resource-swap-modal {
      width: 350px;
      display: flex;
    }
  }

  table.showCoretypeTable {
    min-width: 300px !important;
    width: 300px !important;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  table.showResourceTable {
    width: 400px;
    margin: 0 auto;
  }
`

interface ModalCardProps {
  show?: {}
  onClose?: () => void
  showToastr?: (param) => void
}

export default function ShipyardSalvageModal({ show, onClose, showToastr }: ModalCardProps) {

  const dispatch = useDispatch<AppDispatch>()

  const [salvageItem, setSalvageItem] = useState([])
  const [loadSpinner, setLoadSpinner] = useState(0);
  const [isBrowser, setIsBrowser] = useState(false);
  const addTransaction = useTransactionAdder()
  const dpsShipyardContract = useDpsShipyardContract()
  const browserType = detectBrowser();
  const { currentShip, avail_resources } = useSelector((state: any) => state.shipyard)

  const handleCloseWithCal = (e) => {
    e.preventDefault();
    resetAvailResources();
    resetAvailCores();
    setSalvageItem([]);
    onClose()
  }

  const resetAvailResources = () => {
    let arr = [];
    avail_resources.map((item: any, index: number) => {
      salvageItem[0].salvageResources.map((salItem, key) => {
        if (key === index) {
          const netItem = { ...item, quantity: item.quantity + salItem.toNumber() }
          arr.push(netItem)
        }
      })
    })
    dispatch(setShipYardAvailResources(arr))
  }

  const resetAvailCores = () => {
    dispatch(plusAvailCoresBySalvageSuccess({ coreType: salvageItem[0].coreType, coreNums: salvageItem[0].coresReceived }))
  }


  const handleCloseClick = (e) => {
    e.preventDefault()
    setSalvageItem([]);
    onClose()
  }

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const handleClose = () => {
    setSalvageItem([]);
    onClose();
  }

  const handleConfirm = async () => {
    const shipyardInterface = new ethers.utils.Interface(DPS_SHIPYARD_ABI)

    if (dpsShipyardContract) {
      setLoadSpinner(1);
      try {
        const estimateGas = await dpsShipyardContract.estimateGas.salvageShip(BigNumber.from(currentShip.ship.tokenId))
        let gasLimit = estimateGas.toNumber() + 100000;
        let tx = await dpsShipyardContract.salvageShip(BigNumber.from(currentShip.ship.tokenId), { gasLimit: gasLimit })
        addTransaction(tx, {
          summary: `Salvaging a ship ${currentShip.ship.tokenId}`,
        })
        setLoadSpinner(2);
        let receipt = await tx.wait();

        let salvageEvents = receipt.logs.filter((log) => {
          return log.address.toUpperCase() == config.DPS_SHIPYARD_ADDRESS.toUpperCase()
        }).map((log) => {
          return shipyardInterface.parseLog(log);
        });

        let arr = [];
        const salvageData = salvageEvents.filter((event) => {
          return event.name === 'ShipSalvaged';
        }).map((event) => {
          const salvageItem = {
            tokenId: event.args.tokenId,
            coreType: event.args.coreType,
            coresReceived: event.args.coresReceived,
            salvageResources: event.args.salvageResources
          }
          arr.push(salvageItem)
        });

        setSalvageItem([...arr]);
        if (!arr.length) {
          handleClose();
        }
        setLoadSpinner(0);
      } catch (error) {
        console.error(error)
        setLoadSpinner(3);
        handleClose();
      }
    }
  }

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <div className={cn('sm:flex sm:flex-row body  text-black p-2 items-center mx-2 relative shipyard-modal', {
        'browser-1': browserType !== 'Firefox',
        'browser-2': browserType === 'Firefox',
        "mobile-body-1": window.innerWidth <= 768 && browserType !== 'Firefox',
        "mobile-body-2": window.innerWidth <= 768 && browserType === 'Firefox'
      })}>
        <div style={{ height: 'auto', display: 'flex' }} className="items-center p-3 pt-5 pb-5 sm:flex sm:flex-row sm:pb-0 modal-container">

          <div className={cn('flex justify-start items-center text-base flex-col text-white w-full px-2', {})}>
            <div className='title-container'>
              {(salvageItem.length === 0) && (
                <span className="font-extrabold goldman-font" style={{ color: '#00ffff' }}>
                  SALVAGE SHIP
                </span>
              )}

              {(salvageItem.length > 0) && (
                <span className="font-extrabold goldman-font" style={{ color: '#00ffff' }}>
                  RECEIVED ITEMS
                </span>
              )}

            </div>
            <div className='modal-shipyard-content'>
              {(salvageItem.length === 0) && (
                <div className='flex justify-center pt-3 staking-table'>
                  <table className='text-center'>
                    <thead>
                      <tr>
                        <th>Ship ID</th>
                        <th>Ship Image</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>SHIP-ID: {currentShip?.ship?.tokenId}</td>
                        <td><Image src={getNFTImageURL(currentShip?.ship?.shipType, currentShip?.ship?.textureType, currentShip?.ship?.textureNum)} width='50px' height='40px' /></td>
                        <td>
                          <StarRatingComponent
                            name="shipRating"
                            starCount={5}
                            value={getStarCount(currentShip?.ship?.stats)}
                            emptyStarColor={'#D1D5DB'}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {(salvageItem.length > 0) && (
                <div className='flex justify-center pt-3 staking-table'>
                  <div className=' staking-table'>
                    <table className='text-center showCoretypeTable'>
                      <thead>
                        <tr>
                          <th>Token ID</th>
                          <th>Core Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>tokenID: {salvageItem[0].tokenId.toNumber()}</td>
                          <td><Image src={nftURL(`1/${salvageItem[0].coreType}/0.svg`)} width={40} height={40} alt="coretype image" /><span>{salvageItem[0].coresReceived}</span></td>
                        </tr>
                      </tbody>
                    </table>

                    <table className='text-center showResourceTable'>
                      <thead>
                        <tr>
                          <th>Iron</th>
                          <th>Seplium</th>
                          <th>Hydrogen</th>
                          <th>Fenna</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <Image src='/images/resource/Iron.png' width='40px' height='40px' />
                            <span>{salvageItem[0]?.salvageResources[0].toNumber()}</span>
                          </td>
                          <td>
                            <Image src='/images/resource/Seplium.png' width='40px' height='40px' />
                            <span>{salvageItem[0]?.salvageResources[1].toNumber()}</span>
                          </td>
                          <td>
                            <Image src='/images/resource/Hydrogen.png' width='40px' height='40px' />
                            <span>{salvageItem[0]?.salvageResources[2].toNumber()}</span>
                          </td>
                          <td>
                            <Image src='/images/resource/Fenna.png' width='40px' height='40px' />
                            <span>{salvageItem[0]?.salvageResources[3].toNumber()}</span>
                          </td>
                        </tr>
                        <tr>
                          <th>Bedasine</th>
                          <th>Netherite</th>
                          <th>Xanifarium</th>
                          <th>Promethium</th>
                        </tr>
                        <tr>
                          <td>
                            <Image src='/images/resource/Bedasine.png' width='40px' height='40px' />
                            <span>{salvageItem[0]?.salvageResources[4].toNumber()}</span>
                          </td>
                          <td>
                            <Image src='/images/resource/Netherite.png' width='40px' height='40px' />
                            <span>{salvageItem[0]?.salvageResources[5].toNumber()}</span>
                          </td>
                          <td>
                            <Image src='/images/resource/Xanifarium.png' width='40px' height='40px' />
                            <span>{salvageItem[0]?.salvageResources[6].toNumber()}</span>
                          </td>
                          <td>
                            <Image src='/images/resource/Promethium.png' width='40px' height='40px' />
                            <span>{salvageItem[0]?.salvageResources[7].toNumber()}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* salvageResources:  */}
                </div>
              )}

            </div>

            <div className='mt-5 '>

              {(salvageItem.length === 0) && (
                <>
                  <button className="px-6 py-1 font-bold text-black bg-white glass-button" onClick={() => { handleConfirm() }}>
                    <span className="glass-button-before"></span>
                    <span>Submit</span>
                  </button>
                  <button className="px-6 py-1 ml-3 font-bold text-black bg-white glass-button" onClick={(e) => handleCloseClick(e)} style={{ marginBottom: 20 }}>
                    <span className="glass-button-before"></span>
                    <span>Exit</span>
                  </button>
                </>
              )}

              {(salvageItem.length > 0) && (
                <button className="px-6 py-1 ml-3 font-bold text-black bg-white glass-button" onClick={(e) => handleCloseWithCal(e)} style={{ marginBottom: 20 }}>
                  <span className="glass-button-before"></span>
                  <span>Exit</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </div>
      {loadSpinner ? <LoadingSpinner status={loadSpinner} handleLoading={handleLoading} /> : ''}
    </StyledCard >

  ) : null

  if (!isBrowser) {
    return null
  } else {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'))
  }

}
