import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import cn from 'classnames'
import config from '../../config'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { BigNumber } from 'ethers'
import LoadingSpinner from '../LoadingSpinner'
import { useDpsShipyardContract, useDpsCoresContract, useActiveWeb3React } from '../../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { detectBrowser } from '../../functions/deepspace'
import { AppDispatch } from '../../state'
import { upgradeShipNumCores, reduceAvailCoresNum } from '../../state/shipyard/actions'
import { SHIP_CORE_TYPES } from '../../constants/deepspace'
import InputNav from '../../pages/outpost/resource-swap/components/inputNav'
import "toastr/build/toastr.css";
import "animate.css/animate.css";


const StyledCard = styled.div`
  z-index: 1001;
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
    text-align: center;
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
  .add-core-modal {
    width: 500px;
  }
  .add-core-input {
    background: #021a22;
    color: #ffffff;
    padding-left: 19px;
    width: 100%;
    height: 25px;
    border: solid 1px #006f98;
    margin-top: 3px;
  }
  .add-core-input::placeholder {
    font-size: 9px !important;
    color: white;
  }
  .add-core-modal-content {
    position: relative;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }

  .dropdown-arrow {
      background: #0187ba;
      padding: 1px 5px 0px 5px;
      width: 11px;
      height: 12px;
      position: absolute;
      right: 7px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .arrow {
    border: solid white;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 2px;
    position: absolute;
    top: calc(50% - 4px);
  }
  .down {
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  .dropdown-content {
    position: absolute;
    background-color: #f1f1f1;
    min-width: 250px;
    overflow: auto;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    background: transparent;
    outline: 1px solid #059bd5;
    font-size: 12px;
  }

  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  #myDropdown {
    padding: 10px 10px;
    section {
      height: 100px;
      overflow: auto;
      position: relative;
      z-index: 10;
      .list {
        display: flex;
        align-items: center;
        cursor: pointer;
        span:last-child {
          margin-left: 10px;
        }
      }
    }
  }
  #myDropdown > nav {
    position: absolute;
    height: 120px;
    width: 255px;
    left: -5px;
    top: 0px;
    background: black;
    opacity: 0.9;
    z-index: 5;
  }
  #myDropdown .section::-webkit-scrollbar {
    width: 3px;
  }
  #myDropdown .section::-webkit-scrollbar-thumb {
    background: #00aeef;
  }
  #myDropdown .section::-webkit-scrollbar-thumb:hover {
    background: #006f98;
  }
  #myDropdown .section::-webkit-scrollbar-button:single-button {
    background: #00aeef;
    height: 2px;
  }
  #myDropdown .section::-webkit-scrollbar-button:single-button:active {
    background: #006f98;
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
  showToastr?: (param) => void
  onClose?: () => void
  modalType?: string
}

export default function AddCoreModal({ show, onClose, showToastr }: ModalCardProps) {

  const dispatch = useDispatch<AppDispatch>()
  const [isApproved, setIsApproved] = useState(false)
  const [loadSpinner, setLoadSpinner] = useState(0);
  const [isBrowser, setIsBrowser] = useState(false);
  const [coresVal, setCoresVal] = useState(null)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectableNumcores, setSelectableNumCores] = useState([])

  const addTransaction = useTransactionAdder()
  const dpsShipyardContract = useDpsShipyardContract()
  const dpsCoresContract = useDpsCoresContract()
  const { account } = useActiveWeb3React();

  const browserType = detectBrowser();
  const { currentShip, avail_cores } = useSelector((state: any) => state.shipyard)

  useEffect(() => {
    const selectable_numcores = 8 - currentShip?.ship?.numCores
    const arr = Array.from({ length: selectable_numcores }, (_, index) => index + 1);
    setSelectableNumCores(arr)
  }, [currentShip])

  const handleCloseClick = (e) => {
    e.preventDefault()
    onClose()
  }

  useEffect(() => {
    setIsBrowser(true)
    checkApprove()
  }, [])

  const checkApprove = async () => {
    let isApproved = await dpsCoresContract.isApprovedForAll(account, config.DPS_SHIPYARD_ADDRESS);
    setIsApproved(isApproved)
  }

  const approve = async () => {
    await dpsCoresContract.setApprovalForAll(config.DPS_SHIPYARD_ADDRESS, true);
    const isApproved = await dpsCoresContract.isApprovedForAll(account, config.DPS_SHIPYARD_ADDRESS);
    setIsApproved(true)
  }

  const checkAvailCores = () => {
    let check = false;
    const coreType = SHIP_CORE_TYPES[currentShip.ship.coreType]
    avail_cores.map((item) => {
      if (item.type === coreType) {
        if (item.quantity < coresVal) {
          check = true
        }
      }
    })
    return check
  }

  const handleApprove = async () => {

    const check = checkAvailCores()

    if (check) {
      showToastr('needCores')
    } else {
      if (coresVal) {
        setLoadSpinner(1);
        try {
          await approve();
          setLoadSpinner(0);
        } catch (e) {
          console.log(e, "Approve Error");
          setLoadSpinner(3);
        }
      } else {
        showToastr('noSelectCores')
      }
    }

  }

  const handleConfirm = async () => {
    const check = checkAvailCores()
    if (check) {
      showToastr('needCores')
    } else {
      if (dpsShipyardContract && coresVal) {
        setLoadSpinner(1);
        try {
          const estimateGas = await dpsShipyardContract.estimateGas.applyCores(BigNumber.from(currentShip.ship.tokenId), coresVal)
          let gasLimit = estimateGas.toNumber() + 100000;
          let tx = await dpsShipyardContract.applyCores(BigNumber.from(currentShip.ship.tokenId), coresVal, { gasLimit: gasLimit })
          addTransaction(tx, {
            summary: `adding cores to a ship ${currentShip.ship.tokenId}`,
          })
          setLoadSpinner(2);
          await tx.wait();
          setLoadSpinner(0);
          onClose()
          refreshData();
        } catch (error) {
          console.error(error)
          setLoadSpinner(3);
          onClose();
        }
      } else {
        showToastr('noSelectCores')
      }
    }
  }

  const refreshData = () => {
    dispatch(upgradeShipNumCores(coresVal))
    dispatch(reduceAvailCoresNum(coresVal))
  }

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const onSetCoresVal = (val) => {
    setCoresVal(Number(val))
    setDropdownOpen(false)
  }


  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <div className={cn('sm:flex sm:flex-row body  text-black p-2 items-center mx-2 relative add-core-modal', {
        'browser-1': browserType !== 'Firefox',
        'browser-2': browserType === 'Firefox',
        "mobile-body-1": window.innerWidth <= 768 && browserType !== 'Firefox',
        "mobile-body-2": window.innerWidth <= 768 && browserType === 'Firefox'
      })}>
        <div className="p-3 pt-5 pb-5 sm:flex sm:flex-row sm:pb-0 modal-container">

          <div className={cn('flex text-base flex-col text-white w-full px-2', {})}>
            <div className='title-container'>

              <span className="font-extrabold goldman-font" style={{ color: '#00ffff' }}>
                ADD CORES
              </span>

            </div>

            <div className='add-core-modal-content'>
              <span>Insert Number for additional cores</span>

              <div className="dropdown" style={{ marginTop: 15 }}>
                <div onClick={() => setDropdownOpen(!dropdownOpen)} className='dropbtn'>
                  <InputNav width={'250px'} height={'30px'}>
                    {coresVal ? (
                      <span className='middlePosition'>
                        <span>{coresVal}</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', position: 'relative', left: '-9px' }}><span className='full-txt'>Select </span>Number of Cores </span>
                    )}
                    <span className='dropdown-arrow'><i className="arrow down"></i></span>
                  </InputNav>
                </div>
                {dropdownOpen && (
                  <div id="myDropdown" className="dropdown-content">
                    <nav></nav>
                    <section className='section'>
                      {selectableNumcores.map((corVal, index) => (
                        <div className='list' key={index} onClick={() => onSetCoresVal(corVal)}>
                          <span>{corVal}</span>
                        </div>
                      ))}
                    </section>
                  </div>
                )}
              </div>

            </div>

            <div className='flex mt-5' style={{ marginLeft: 80 }}>

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
