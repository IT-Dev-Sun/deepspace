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
import { detectBrowser } from '../../functions/deepspace'
import { RESOURCE_LIST } from '../../constants/deepspace'
import { AppDispatch } from '../../state'
import { setRequiredResources, setLevelIncreases, setShipYardAvailResources } from '../../state/shipyard/actions'

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
    display: flex;
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
`

interface ModalCardProps {
  show?: {}
  onClose?: () => void
  showToastr?: (param) => void
}

export default function ShipyardUpgradeModal({ show, onClose, showToastr }: ModalCardProps) {

  const dispatch = useDispatch<AppDispatch>()
  const [isApproved, setIsApproved] = useState(false)
  const [loadSpinner, setLoadSpinner] = useState(0);
  const [isBrowser, setIsBrowser] = useState(false);
  const addTransaction = useTransactionAdder()
  const dpsShipyardContract = useDpsShipyardContract()
  const dpsResourcesContract = useDpsResourcesContract()
  const { account } = useActiveWeb3React();


  const browserType = detectBrowser();
  const { currentShip, levelIncreases, avail_resources, required_resources } = useSelector((state: any) => state.shipyard)

  const handleCloseClick = (e) => {
    e.preventDefault()
    onClose()
  }

  useEffect(() => {
    setIsBrowser(true)
    checkApprove()
  }, [])

  const initial = () => {
    getInitialResources()
    dispatch(setLevelIncreases([0, 0, 0, 0, 0, 0, 0, 0]))
  }

  const reduceAvailaResources = () => {
    let calAvailResources = []
    avail_resources.map((availResourceItem, index) => {
      required_resources.map((requiredResourceItem, key) => {
        if (index === key) {
          const quantity = availResourceItem.quantity - requiredResourceItem.quantity
          const newItem = { ...availResourceItem, quantity: quantity }
          calAvailResources.push(newItem)
        }
      })
    })
    dispatch(setShipYardAvailResources(calAvailResources))
  }

  const getInitialResources = async () => {
    let require_resources = []
    RESOURCE_LIST.map((item: any, index: number) => {
      const netItem = { ...item, quantity: 0 }
      require_resources.push(netItem)
    })
    dispatch(setRequiredResources(require_resources))
  }

  const handleConfirm = async () => {
    if (dpsShipyardContract) {
      setLoadSpinner(1);
      try {
        const estimateGas = await dpsShipyardContract.estimateGas.upgradeStats(BigNumber.from(currentShip.ship.tokenId), levelIncreases)
        let gasLimit = estimateGas.toNumber() + 100000;
        let tx = await dpsShipyardContract.upgradeStats(BigNumber.from(currentShip.ship.tokenId), levelIncreases, { gasLimit: gasLimit })
        addTransaction(tx, {
          summary: `upgrading a ship ${currentShip.ship.tokenId}`,
        })
        setLoadSpinner(2);
        await tx.wait();
        setLoadSpinner(0);
        onClose()
        initial()
        reduceAvailaResources()
      } catch (error) {
        console.error(error)
        setLoadSpinner(3);
        onClose()
      }
    }
  }

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const checkApprove = async () => {
    let isApproved = await dpsResourcesContract.isApprovedForAll(account, config.DPS_SHIPYARD_ADDRESS);
    setIsApproved(isApproved)
  }

  const approve = async () => {
    await dpsResourcesContract.setApprovalForAll(config.DPS_SHIPYARD_ADDRESS, true);
    await dpsResourcesContract.isApprovedForAll(account, config.DPS_RESOURCE_SWAP_ADDRESS);
    setIsApproved(true)
  }

  const handleApprove = async () => {
    setLoadSpinner(1);
    try {
      await approve();
      setLoadSpinner(0);
    } catch (e) {
      console.log(e, "Approve Error");
      setLoadSpinner(3);
    }
  }

  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <div className={cn('sm:flex sm:flex-row body  text-black p-2 items-center mx-2 relative shipyard-modal', {
        'browser-1': browserType !== 'Firefox',
        'browser-2': browserType === 'Firefox',
        "mobile-body-1": window.innerWidth <= 768 && browserType !== 'Firefox',
        "mobile-body-2": window.innerWidth <= 768 && browserType === 'Firefox'
      })}>
        <div className="items-center p-3 pt-5 pb-5 sm:flex sm:flex-row sm:pb-0 modal-container">

          <div className={cn('flex justify-start items-center text-base flex-col text-white w-full px-2', {})}>
            <div className='title-container'>

              <span className="font-extrabold goldman-font" style={{ color: '#00ffff' }}>
                UPGRADE SHIP
              </span>

            </div>

            <div className='upgrade-modal-content'>

            </div>

            <div className='flex justify-around mt-5'>

              {isApproved ? (
                <button className="px-6 py-1 font-bold text-black bg-white glass-button" onClick={() => { handleConfirm() }}>
                  <span className="glass-button-before"></span>
                  <span>Submit</span>
                </button>
              ) : (
                <button className="px-6 py-1 font-bold text-black bg-white glass-button" onClick={() => { handleApprove() }}>
                  <span className="glass-button-before"></span>
                  <span>Approve</span>
                </button>
              )}

              <button className="px-6 py-1 ml-3 font-bold text-black bg-white glass-button" onClick={(e) => handleCloseClick(e)}>
                <span className="glass-button-before"></span>
                <span>Exit</span>
              </button>
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
