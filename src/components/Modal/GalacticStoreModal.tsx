import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import cn from 'classnames'
import { useApproveCallback } from '../../hooks'
import { useTokenAllowanceAmount } from '../../hooks/useTokenAllowance'
import { MaxUint256 } from '@ethersproject/constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { CurrencyAmount } from '@deepspace-game/sdk'
import config from '../../config'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useDPSToken } from '../../hooks/Tokens'
import { BigNumber } from 'ethers'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import LoadingSpinner from '../LoadingSpinner'
import { useDpsStoreContract, useDpsResourcesContract } from '../../hooks'
import { ethers } from "ethers"
import { bnb_decimal } from '../../constants/index'


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
  storeItem: any
}

export default function GalacticStoreModal({ show, onClose, showToastr, storeItem }: ModalCardProps) {

  const [loadSpinner, setLoadSpinner] = useState(0);
  const [isBrowser, setIsBrowser] = useState(false);
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from('0'))

  const { account } = useActiveWeb3React();
  const addTransaction = useTransactionAdder()
  const dpsStoreContract = useDpsStoreContract()

  const price = storeItem?.price ? BigNumber.from(storeItem.price) : BigNumber.from("0")
  const browserType = detectBrowser();

  const handleCloseClick = (e) => {
    e.preventDefault()
    onClose()
  }

  useEffect(() => {
    setIsBrowser(true)
  }, [])
  useEffect(() => {
    if (account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.getBalance(account).then((balance) => {
        setBalance(balance)
      })
    }
  }, [account])

  const handleConfirm = async () => {
    if (balance.gte(price)) {
      setLoadSpinner(1);
      try {
        if (storeItem.category === "consumable") {
          let tx = await dpsStoreContract.purchaseConsumable(storeItem.id, 1, { value: price })
          addTransaction(tx, {
            summary: `buy galactic store items`,
          })
          setLoadSpinner(2);
          await tx.wait()
          setLoadSpinner(0);
          onClose()
        }

        if (storeItem.category === "nonConsumable") {
          let tx = await dpsStoreContract.purchaseNonConsumable(storeItem.id, 1, { value: price })
          addTransaction(tx, {
            summary: `buy galactic store nonConsumable item`,
          })
          setLoadSpinner(2);
          await tx.wait()
          setLoadSpinner(0);
          onClose()
        }

      } catch (error) {
        console.error(error)
        setLoadSpinner(3);
      }
    } else {
      showToastr('lessBalance')
    }

  }

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <div className={cn('sm:flex sm:flex-row body  text-black p-2 items-center mx-2 relative resource-swap-modal', {
        'browser-1': browserType !== 'Firefox',
        'browser-2': browserType === 'Firefox',
        "mobile-body-1": window.innerWidth <= 768 && browserType !== 'Firefox',
        "mobile-body-2": window.innerWidth <= 768 && browserType === 'Firefox'
      })}>
        <div className="items-center p-3 pt-5 pb-5 sm:flex sm:flex-row sm:pb-0 modal-container">

          <div className={cn('flex justify-start items-center text-base flex-col text-white w-full px-2', {})}>
            <div className='title-container'>
              <span>
                Are you sure you want <br /> to buy ?
              </span>
            </div>

            <div className='flex items-center justify-center button-container'>
              <div className={cn('flex flex-row  w-full')}>
                <button onClick={handleCloseClick} className={cn("glass-button bg-white px-4 py-1 text-black font-bold")}>
                  <span className="glass-button-before"></span>
                  <span>Cancel</span>
                </button>
              </div>

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
