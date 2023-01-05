import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../state'
import BubbleCircle from './components/BubbleCircle'
import InputDiv from './components/inputDiv'
import btn from '../../../asset/image/resource-swp/btn.png'
import { RESOURCE_LIST } from '../../../constants/deepspace'
import QuantityInput from './components/QuantityInput'
import ReceiveInput from './components/ReceiveInput'
import Dropdown from './components/ResourceToDps/dropdown'
import { useDpsResourcesContract, useDpsResourcesSwapContract } from '../../../hooks'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { assetURL, getAmountIn, getAmountOut } from '../../../functions/deepspace'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from "ethers"
import { useDpsPrice, useDPSToken } from '../../../hooks/Tokens'
import { ToastContainer } from 'react-toastr';
import ResourceSwapModal from '../../../components/Modal/ResourceSwapModal'

const PageStyle = styled.div`
  @media(max-device-width:1030px) {

    & {
      .full-txt {
        display: none;
      }
      .style_subtitle {
        font-size: 14px !important;
        top: 12px !important;
        left: calc(50% - 117px) !important;
      }
      .container {
        top: 411px !important;
        left: 93px !important;
        .DivTitle {
          font-size: 14px !important;
          width: 140px;
          text-align: center;
          margin-bottom: 5px;
        }
        .dropdownContent {
          margin-bottom: 0;
          width: 140px;
        }
        .receive-dps {
          margin-top: 10px !important;
          margin-bottom: 15px !important;
        }
        .quantity-input {
          margin-top: 5px !important;
        }
        .middlePosition {
          font-size: 10px !important;
          align-items: center;
          span:last-child {
            margin-left: 0;
          }
        }
        #myDropdown {
          top: 21px !important;
          min-width: 140px !important;
          nav {
            width: 145px !important;
          }
   
          .section .list {
            font-size: 9px;
            span:last-child {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
  @media(max-width:1030px) {
    & {
      .full-txt {
        display: none;
      }
      .style_subtitle {
        font-size: 14px !important;
        top: 12px !important;
        left: calc(50% - 117px) !important;
      }
      .container {
        top: 411px !important;
        left: 93px !important;
        .DivTitle {
          font-size: 14px !important;
          width: 140px;
          text-align: center;
          margin-bottom: 5px;
        }
        .dropdownContent {
          width: 140px;
          margin-bottom: 0;
        }
        .receive-dps {
          margin-bottom: 15px !important;
          margin-top: 10px !important;
          height: 20px !important;
          .dpsIcon {
            top: -21px !important;
            left: calc(100% - 72px) !important;
            &>span {
              width: 20px !important;
            }
          }
        }
        .quantity-input {
          margin-top: 5px !important;
        }
        .middlePosition {
          font-size: 10px !important;
          align-items: center;
          span:last-child {
            margin-left: 0;
          }
        }
        #myDropdown {
          top: 21px !important;
          min-width: 140px !important;
          nav {
            width: 145px !important;
          }
    
          .section .list {
            font-size: 9px;
            span:last-child {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
  .container {
    width: 185px;
    position: absolute;
    top: 90px;
    right: 267px;
    z-index: 10;
    .quantity-input {
      margin-top: 10px;
    }

    .dropdown-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 58px;
    }
    .receive-dps {
      margin-top: 15px;
      margin-bottom: 28px;
      height: 30px;
      .dpsIcon {
        display: inline-block;
        position: relative;
        top: -29px;
        left: calc(100% - 31px);
      }
    }
    .dropdownContent {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 85px;
      margin-bottom: 10px;
    }
    .DivTitle {
      text-align: center;
      margin-bottom: 5px;
      font-size: 18px;
    }
  }
  .middlePosition {
    margin-left: -26px !important;
    span:last-child {
      margin-left: 6px;
    }
  }
  .dropdown-content {
    min-width: 185px !important;
    top: 31px !important;
  }
  #myDropdown>nav {
    width: 190px !important;
  }
  .quantity-input input {
    text-align: center;
  }
  .dropdown {
    cursor: pointer;
  }
`

const TrandeBtn = styled.div`
  margin-top: 20px;
  cursor: pointer;
  & {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    img {
      opacity: 0.85;
    }
  }
  & > div {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }
  @media(max-device-width:1030px) {
    & {
      width: 90px;
      margin-top: 0;
      margin-left: 22px;
      .btnTitle {
        font-size: 12px;
      }
    }
  }
  @media(max-width:1030px) {
    & {
      width: 90px;
      margin-top: 0;
      margin-left: 22px;
      .btnTitle {
        font-size: 12px;
      }
    }
  }
`

const ResouceToDps = () => {

  let container;
  let walletCheck;

  const dispatch = useDispatch<AppDispatch>()
  const [connectCheck, setConnectCheck] = useState(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dpsNum, setDpsNum] = useState<any>(null)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [dpsVal, setDpsVal] = useState<any>(null)
  const [c, setC] = useState(null)
  const [swapData, setSwapData] = useState<any>({})
  const [showModal, setShowModal] = useState(false)

  const dpsResourcesContract = useDpsResourcesContract()
  const dpsResourcesSwapContract = useDpsResourcesSwapContract()
  const { account } = useActiveWeb3React()
  const token = useDPSToken()

  const dpsPrice = useDpsPrice()

  useEffect(() => {
    setC(container);
  }, [container])
  useEffect(() => {
    getDataLoop()
  }, [])
  useEffect(() => {
    setConnectCheck(walletCheck);
  }, [walletCheck])

  const showToastr = (status) => {
    if (c) {
      if (status === 'accountDisconnect') c.error("Please connect wallet", "Error");
      if (status === 'approveSuccess') c.success(`Approve success. Please click confirm.`, 'Success');
    }
  }

  const onChangeQuantity = async (val) => {
    const re = /^[0-9\b]+$/;
    let reVal = val
    if (val === '') reVal = 1
    if (re.test(reVal)) {
      if (selectedItem !== null) {
        let reserve = await dpsResourcesContract.balanceOf(account, selectedItem)
        const hex_dpsReserve = parseInt(reserve._hex, 16)

        if (val <= hex_dpsReserve) {
          let res = await dpsResourcesSwapContract.getReserves(selectedItem)
          const dpsReserve = res.dpsReserve
          const resourceReserve = res.resourceReserve

          const price = getAmountOut(BigNumber.from(Number(val)), resourceReserve, dpsReserve)
          const currentFormattedPrice = ethers.utils.commify(ethers.utils.formatUnits(price, token.decimals).toString())
          const usdString = Number(ethers.utils.formatUnits(price, token.decimals)) * dpsPrice
          setCurrentPrice(usdString)
          setDpsVal(ethers.utils.formatUnits(price, token.decimals).toString())
          setDpsNum(val)
        } else {
          c.error("insufficient resources", "Error");
        }
      } else {
        c.error("Please select resource", "Error");
      }
    } else {
      c.error("Please enter only number", "Error");
    }
  }
  const onChangeReceiveDsp = (val: number) => {
    setDpsVal(val)
    changeCurrencyAndDPS(val)
  }
  const onClickMax = async () => {
    if (account === null) {
      showErrorConnectToastr('disconnect')
    } else {
      if (selectedItem !== null) {
        let reserve = await dpsResourcesContract.balanceOf(account, selectedItem)
        const hex_dpsReserve = parseInt(reserve._hex, 16)

        let res = await dpsResourcesSwapContract.getReserves(selectedItem)
        const dpsReserve = res.dpsReserve
        const resourceReserve = res.resourceReserve

        const price = getAmountOut(BigNumber.from(Number(hex_dpsReserve)), resourceReserve, dpsReserve)
        const currentFormattedPrice = ethers.utils.commify(ethers.utils.formatUnits(price, token.decimals).toString())
        const usdString = Number(ethers.utils.formatUnits(price, token.decimals)) * dpsPrice
        setCurrentPrice(usdString)
        setDpsVal(ethers.utils.formatUnits(price, token.decimals).toString())
        setDpsNum(hex_dpsReserve)
      } else {
        c.error("Please select resource", "Error");
      }
    }
  }
  const getDataLoop = async () => {
    const re = /^[0-9\b]+$/;
    if (dpsNum && selectedItem !== null && re.test(dpsNum)) {
      let res = await dpsResourcesSwapContract.getReserves(selectedItem)
      const dpsReserve = res.dpsReserve
      const resourceReserve = res.resourceReserve
      const price = getAmountOut(BigNumber.from(Number(dpsNum)), resourceReserve, dpsReserve)
      const usdString = Number(ethers.utils.formatUnits(price, token.decimals)) * dpsPrice
      setCurrentPrice(usdString)
    }
    setTimeout(getDataLoop, 10000)
  }
  const selectResource = async (resource: any) => {
    let reserve = await dpsResourcesContract.balanceOf(account, resource.pid)
    const hex_dpsReserve = parseInt(reserve._hex, 16)
    setDpsNum(hex_dpsReserve)
    setSelectedItem(resource.pid)

    let res = await dpsResourcesSwapContract.getReserves(resource.pid)
    const dpsReserve = res.dpsReserve
    const resourceReserve = res.resourceReserve

    const price = getAmountOut(BigNumber.from(Number(hex_dpsReserve)), resourceReserve, dpsReserve)
    const currentFormattedPrice = ethers.utils.commify(ethers.utils.formatUnits(price, token.decimals).toString())
    const usdString = Number(ethers.utils.formatUnits(price, token.decimals)) * dpsPrice
    setCurrentPrice(usdString)
    setDpsVal(ethers.utils.formatUnits(price, token.decimals).toString())
  }
  const changeCurrencyAndDPS = async (val) => {
    const re = /^[0-9\b]+$/;
    if (selectedItem !== null) {
      if (Number(val)) {
        if (re.test(val)) {
          let res = await dpsResourcesSwapContract.getReserves(selectedItem)
          const dpsReserve = res.dpsReserve
          const resourceReserve = res.resourceReserve

          let dpsValue = ethers.utils.parseUnits(val, token.decimals);
          const nums = getAmountIn(BigNumber.from(dpsValue), resourceReserve, dpsReserve)

          let reserve = await dpsResourcesContract.balanceOf(account, selectedItem)
          const hex_dpsReserve = parseInt(reserve._hex, 16)

          if (parseInt(nums._hex, 16) > 0 && parseInt(nums._hex, 16) <= hex_dpsReserve) {
            const price = getAmountOut(nums, resourceReserve, dpsReserve)
            const usdString = Number(ethers.utils.formatUnits(price, token.decimals)) * dpsPrice
            setCurrentPrice(usdString)
            setDpsNum(parseInt(nums._hex, 16))
          } else {
            c.error("insufficient resources", "Error");
          }
        }
      } else {
        setCurrentPrice(0)
        setDpsNum(0)
      }
    } else {
      c.error("Please select resource", "Error");
    }
  }

  const showErrorConnectToastr = (status) => {
    if (connectCheck) {
      if (status === 'disconnect') {
        c.error("Please connect wallet", "Error");
      }
      if (status === 'invalidPid') {
        c.error("Please Select Resource to Swap", "Error");
      }
    }
  }

  const onSwapResourceForExactDps = async () => {
    if (account === null) {
      showErrorConnectToastr('disconnect')
    } else {
      if (selectedItem !== null) {
        if (dpsNum && Number(dpsNum) > 0) {
          let d = new Date();
          const swapData = {
            pid: selectedItem,
            amountInMax: ethers.utils.parseUnits(dpsVal, token.decimals),
            deadline: d.getTime() + 30000,
            quantity: dpsNum
          }
          setSwapData(swapData)
          setShowModal(true)
        } else {
          c.error("Quantity should be selected", "Error");
        }
      } else {
        showErrorConnectToastr('invalidPid')
      }
    }
  }

  const resetData = () => {
    setCurrentPrice(0)
    setDpsNum(0)
    setDpsVal(0)
  }

  return (
    <PageStyle>
      <BubbleCircle left='803px' />
      <div className='container'>
        <div className='style_subtitle'>
          Trade Resources for DPS
        </div>
        <div className='dropdownContent'>
          <Dropdown RESOURCE_LIST={RESOURCE_LIST} selectResource={selectResource} account={account} showErrorConnectToastr={showErrorConnectToastr} />
        </div>
        <div className='DivTitle'>Current Price</div>
        <div>
          <InputDiv value={`$${currentPrice.toFixed(3)}`} />
        </div>
        <div className='quantity-input'>
          <QuantityInput onChange={(e) => onChangeQuantity(e.target.value)} onClick={onClickMax} quantity={dpsNum} type={'resource-dps'}></QuantityInput>
        </div>
        <div className='receive-dps'>
          <ReceiveInput onChange={(e) => onChangeReceiveDsp(e.target.value)} quantity={dpsVal} placeholder="Receive DPS" type={'resource-dps'}></ReceiveInput>
          <div className='dpsIcon'>
            <Image unoptimized={true} src={assetURL("icons/icon-72x72.png")} width="25px" height="25px" alt="dps-logo" />
          </div>
        </div>
        <TrandeBtn onClick={onSwapResourceForExactDps}>
          <Image src={btn} width={'130px'} height={'30px'} />
          <div className='btnTitle'>TRADE</div>
        </TrandeBtn>
      </div>
      <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
      <ToastContainer ref={ref => walletCheck = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
      {account && (
        <ResourceSwapModal show={showModal} onClose={() => setShowModal(false)} shipCardType="resource-dps" showToastr={showToastr} swapData={swapData} resetData={resetData} />
      )}
    </PageStyle >
  )
}

export default ResouceToDps   