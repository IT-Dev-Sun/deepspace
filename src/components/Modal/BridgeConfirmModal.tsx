import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import cn from 'classnames'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import config from '../../config'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useDPSToken } from '../../hooks/Tokens'
import LoadingSpinner from '../LoadingSpinner'
import { useDpsResourceBridgeContract, useDpsResourcesContract } from '../../hooks'
import { BigNumber } from 'ethers'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { CurrencyAmount } from '@deepspace-game/sdk'
import { MaxUint256 } from '@ethersproject/constants'
import { useApproveCallback } from '../../hooks'
import { useTokenAllowanceAmount } from '../../hooks/useTokenAllowance'

import "toastr/build/toastr.css";
import "animate.css/animate.css";

import { detectBrowser } from '../../functions/deepspace'

const StyledCard = styled.div`
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
`

interface ModalCardProps {
  show?: {}
  onClose?: () => void
  onReset?: () => void
  showToastr?: (param) => void
  onOpen?: () => void
  bridgeData?: any
}

export default function BridgeConfirmModal({ show, onClose, onOpen, showToastr, bridgeData, onReset }: ModalCardProps) {
  const [loadSpinner, setLoadSpinner] = useState(0);
  const [isBrowser, setIsBrowser] = useState(false);
  const [isBridgeInApproved, setIsBridgeInApproved] = useState(false)
  const { account } = useActiveWeb3React();
  const addTransaction = useTransactionAdder()
  const resourceBridgeContract = useDpsResourceBridgeContract()
  const dpsResourcesContract = useDpsResourcesContract()
  const token = useDPSToken()

  const currencyAmount = CurrencyAmount.fromRawAmount(token, BigNumber.from(MaxUint256).toString());
  const [approveState, approve] = useApproveCallback(currencyAmount, config.RESOURCE_BRIDGE_ADDRESS);
  const allowanceString = useTokenAllowanceAmount(token, account, config.RESOURCE_BRIDGE_ADDRESS);
  const allowance = isBigNumberish(allowanceString) ? BigNumber.from(allowanceString) : BigNumber.from(0)

  const browserType = detectBrowser();

  const handleCloseClick = (e) => {
    e.preventDefault()
    onClose()
  }

  useEffect(() => {
    setIsBrowser(true)
    checkIsBridgeInApproved()
  }, [])


  const checkIsBridgeInApproved = async () => {
    let isBridgeInApproved = await dpsResourcesContract.isApprovedForAll(account, config.RESOURCE_BRIDGE_ADDRESS);
    setIsBridgeInApproved(isBridgeInApproved)
  }

  const handleApprove = async () => {
    setLoadSpinner(1);
    try {
      await approve();
      setLoadSpinner(0);
      await dpsResourcesContract.setApprovalForAll(config.RESOURCE_BRIDGE_ADDRESS, true);
      setLoadSpinner(1);
      await dpsResourcesContract.isApprovedForAll(account, config.RESOURCE_BRIDGE_ADDRESS);
      setIsBridgeInApproved(true)
      setLoadSpinner(0);
    } catch (e) {
      setLoadSpinner(3);
    }
  }

  const handleConfirm = async () => {
    if (resourceBridgeContract) {
      setLoadSpinner(1);
      try {
        const estimateGas = await resourceBridgeContract.estimateGas.bridgeIn(bridgeData.shipIds, bridgeData.resourceIds, bridgeData.resourceAmounts, BigNumber.from(bridgeData.dpsAmount));
        let gasLimit = estimateGas.toNumber() + 100000;

        let tx = await resourceBridgeContract.bridgeIn(bridgeData.shipIds, bridgeData.resourceIds, bridgeData.resourceAmounts, BigNumber.from(bridgeData.dpsAmount), { gasLimit: gasLimit })

        addTransaction(tx, {
          summary: `bridged items into game`,
        })
        setLoadSpinner(2);
        await tx.wait()
        setLoadSpinner(0);
        onClose()
        onReset()
      } catch (error) {
        setLoadSpinner(3);
      }
    }
  }

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <div className={cn('sm:flex sm:flex-row body  text-black p-2 items-center mx-2 relative', {
        'browser-1': browserType !== 'Firefox',
        'browser-2': browserType === 'Firefox',
        "mobile-body-1": window.innerWidth <= 768 && browserType !== 'Firefox',
        "mobile-body-2": window.innerWidth <= 768 && browserType === 'Firefox'
      })}>
        <div className="items-center p-3 pt-5 pb-5 sm:flex sm:flex-row sm:pb-0 modal-container">

          <div className={cn('flex justify-start items-center text-base flex-col text-white w-full px-2', {})}>
            <div className='title-container'>
              <span className="font-extrabold goldman-font" style={{ color: '#00ffff' }}>
                Bridge Into Game
              </span>
            </div>
            <div className='title-container'>
              <span>
                Are you sure you want <br /> to bridge these items into game?
              </span>
            </div>

            <div className='flex items-center justify-center button-container'>
              <div className={cn('flex flex-row  w-full')}>
                <button onClick={handleCloseClick} className={cn("glass-button bg-white px-4 py-1 text-black font-bold")}>
                  <span className="glass-button-before"></span>
                  <span>Cancel</span>
                </button>
              </div>

              {isBridgeInApproved ? (
                <div className={cn('flex flex-row  w-full')}>
                  <button
                    onClick={() => { handleConfirm() }}
                    className={cn('glass-button bg-white px-4 py-1 text-black font-bold ml-2')}
                    style={!account ? { cursor: "not-allowed", 'pointerEvents': 'all' } : {}}
                    disabled={!account ? true : false}
                  >
                    <span className="glass-button-before"></span>
                    <span>Confirm</span>
                  </button>
                </div>

              ) : (
                <div className={cn('flex flex-row  w-full')}>
                  <button
                    onClick={() => { handleApprove() }}
                    className={cn('glass-button bg-white px-4 py-1 text-black font-bold ml-2')}
                    style={!account ? { cursor: "not-allowed", 'pointerEvents': 'all' } : {}}
                    disabled={!account ? true : false}
                  >
                    <span className="glass-button-before"></span>
                    <span>Approve</span>
                  </button>
                </div>
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
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root-next'))
  }

}
