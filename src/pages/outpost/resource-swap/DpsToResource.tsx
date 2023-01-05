import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import styled from 'styled-components'
import BubbleCircle from './components/BubbleCircle'
import QuantityInput from './components/QuantityInput'
import ReceiveInput from './components/ReceiveInput'
import InputDiv from './components/inputDiv'
import btn from '../../../asset/image/resource-swp/btn.png'
import { RESOURCE_LIST } from '../../../constants/deepspace'
import { useDpsResourcesContract, useDpsResourcesSwapContract } from '../../../hooks'
import { assetURL, getAmountIn, getAmountOut } from '../../../functions/deepspace'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from "ethers"
import { useDpsPrice, useDPSToken } from '../../../hooks/Tokens'
import { useActiveWeb3React } from '../../../hooks/useActiveWeb3React'
import { useTokenBalance } from '../../../state/wallet/hooks'
import ResourceSwapModal from '../../../components/Modal/ResourceSwapModal'
import { ToastContainer } from 'react-toastr';
import Dropdown from './components/ResourceToDps/dropdownLeft'

const PageStyle = styled.div`

  .quantity-input.mobileMarginTop {
    .dpsIcon {
      display: inline-block;
      position: absolute;
      top: 181px;
      left: calc(100% - 70px);
    }
  }
  @media(max-device-width:1030px) {
    & {
      .style_subtitle_dps {
        font-size: 14px !important;
        top: 295px !important;
        left: calc(50% - 115px) !important;
      }
      .container {
        top: 0px !important;
        left: 93px !important;
        .DivTitle {
          font-size: 14px !important;
          width: 140px;
        }
        .quantity-input.mobileMarginTop {
          margin-top: 5px !important;
          .dpsIcon {
            top: 147px !important;
            left: calc(100% - 92px) !important;
            z-index: 10;
            &>span {
              width: 20px;
            }
          }
        }
        .mobileMarginTop {
          margin-top: 10px !important;
        }
        .middlePosition {
          font-size: 10px !important;
          align-items: center;
        }
        .fixPositionFirst {
          font-size: 7px !important;
        }
        #myDropdown {
          top: 21px !important;
          min-width: 140px !important;
          nav {
            width: 145px !important;
          }
        }
      }
    }
  }
  @media(max-width:1030px) {
    & {
      .style_subtitle_dps {
        font-size: 14px !important;
        top: 295px  !important;
        left: calc(50% - 115px) !important;
      }
      .container {
        top: 0px !important;
        left: 93px !important;
        .DivTitle {
          font-size: 14px !important;
          width: 140px;
        }
        .quantity-input.mobileMarginTop {
          margin-top: 5px !important;
        }
        .mobileMarginTop {
          margin-top: 10px !important;
          .dpsIcon {
            top: 147px !important;
            left: calc(100% - 92px) !important;
            z-index: 10;
            &>span {
              width: 20px !important;
            }
          }
        }
        .middlePosition {
          font-size: 10px !important;
          align-items: center;
        }
        .fixPositionFirst {
          font-size: 7px !important;
        }
        #myDropdown {
          top: 21px !important;
          min-width: 140px !important;
          nav {
            width: 145px !important;
          }
        }
      }
    }
  }
  .container {
    width: 185px;
    position: absolute;
    top: 90px;
    left: 267px;
    z-index: 10;
    .quantity-input {
      margin-top: 10px;
    }
  }
  .dropdown {
    cursor: pointer;
  }
  .DivTitle {
    font-size: 20px;
    margin-bottom: 3px;
    text-align: center;
  }
`
const TopTile = styled.div`
  margin-top: 60px;
  color: white !important;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  img {
    width: 30px;
    display: inline-block;
  }
  span {
    font-size: 26px;
    font-weight: 900;
    margin-left: 5px;
  }
  @media(max-device-width:1030px) {
    & {
      width: 140px;
      margin-top: 52px;
    }
  }
  @media(max-width:1030px) {
    & {
      width: 140px;
      margin-top: 52px;
    }
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
      margin-top: 5px;
      margin-left: 22px;
      .btnTitle {
        font-size: 12px;
      }
    }
  }
  @media(max-width:1030px) {
    & {
      width: 90px;
      margin-top: 5px;
      margin-left: 22px;
      .btnTitle {
        font-size: 12px;
      }
    }
  }
`

const DpsToResource = (props) => {
  let container;
  let walletCheck;
  const token = useDPSToken()
  const { account } = useActiveWeb3React()
  const dpsResourcesSwapContract = useDpsResourcesSwapContract()
  const dpsResourcesContract = useDpsResourcesContract()

  const dpsBalance = useTokenBalance(account, token);

  const [c, setC] = useState(null)
  const [connectCheck, setConnectCheck] = useState(null)

  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [usdPrice, setUsdPrice] = useState('')
  const [finalBalance, setFinalBalance] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [swapData, setSwapData] = useState<any>({})

  const dpsPrice = useDpsPrice()

  useEffect(() => {
    setC(container);
  }, [container])

  useEffect(() => {
    setConnectCheck(walletCheck);
  }, [walletCheck])

  useEffect(() => {
    getDataLoop()
  }, [])

  const showToastr = (status) => {
    if (c) {
      if (status === 'accountDisconnect') c.error("Please connect wallet", "Error");
      if (status === 'approveSuccess') c.success(`Approve success. Please click confirm.`, 'Success');
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
      if (status === 'noSelectResource') {
        c.error("Please Select Resource what you want to buy", "Error");
      }
      if (status === 'overQuantity') {
        c.error("Quantity should be less than max Quantity", "Error");
      }
      if (status === 'noSelectQuantity') {
        c.error("Quantity should be selected", "Error");
      }
    }
  }


  const selectResource = async (resource: any) => {
    if (account === null) {
      showErrorConnectToastr('disconnect');
    } else {
      let reserve = await dpsResourcesSwapContract.getReserves(resource.pid)
      const dpsReserve = reserve.dpsReserve
      const resourceReserve = reserve.resourceReserve

      if (quantity !== '' && quantity !== '0') {
        let dpsValue = ethers.utils.parseUnits(dpsBalance.toSignificant(), token.decimals);

        const count = getAmountOut(BigNumber.from(Number(dpsValue)), dpsReserve, resourceReserve)


        if (Number(quantity) > Number(count)) {
          setQuantity(Number(count).toString())
          const currentPrice = getAmountIn(BigNumber.from(Number(count)), dpsReserve, resourceReserve)
          const currentFormattedPrice = ethers.utils.formatUnits(currentPrice, token.decimals)
          const usdString = Number(ethers.utils.formatUnits(currentPrice, token.decimals)) * dpsPrice
          setCurrentPrice(currentFormattedPrice)
          setFinalBalance(currentFormattedPrice)
          setUsdPrice(usdString.toString())
        } else {
          const currentPrice = getAmountIn(BigNumber.from(Number(quantity)), dpsReserve, resourceReserve)
          const currentFormattedPrice = ethers.utils.formatUnits(currentPrice, token.decimals)
          const usdString = Number(ethers.utils.formatUnits(currentPrice, token.decimals)) * dpsPrice
          setCurrentPrice(currentFormattedPrice)
          setFinalBalance(currentFormattedPrice)
          setUsdPrice(usdString.toString())
        }

      } else {
        let dpsValue = ethers.utils.parseUnits(dpsBalance.toSignificant(), token.decimals);
        const count = getAmountOut(BigNumber.from(Number(dpsValue)), dpsReserve, resourceReserve)


        setQuantity(Number(count).toString())
        const currentPrice = getAmountIn(BigNumber.from(Number(count)), dpsReserve, resourceReserve)
        const currentFormattedPrice = ethers.utils.formatUnits(currentPrice, token.decimals).toString()
        const usdString = Number(ethers.utils.formatUnits(currentPrice, token.decimals)) * dpsPrice

        setCurrentPrice(currentFormattedPrice)
        setFinalBalance(currentFormattedPrice)
        setUsdPrice(usdString.toString())
      }
      setSelectedItem({ img: resource.img, type: resource.type, pid: resource.pid })
      setDropdownOpen(false)
    }

  }

  const onChangeReceiveQuantity = async (e: any) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '') {
      setUsdPrice('')
      setCurrentPrice('')
      setFinalBalance('')
      setQuantity(e.target.value)
    } else {
      if (re.test(e.target.value)) {
        if (selectedItem) {
          setQuantity(e.target.value)
          let reserve = await dpsResourcesSwapContract.getReserves(selectedItem.pid)
          const dpsReserve = reserve.dpsReserve
          const resourceReserve = reserve.resourceReserve

          let dpsValue = ethers.utils.parseUnits(dpsBalance.toSignificant(), token.decimals);

          const count = getAmountOut(BigNumber.from(Number(dpsValue)), dpsReserve, resourceReserve)


          if (Number(e.target.value) > Number(count)) {
            showErrorConnectToastr('overQuantity')
            setQuantity(Number(count).toString())
            const price = getAmountIn(BigNumber.from(Number(count)), dpsReserve, resourceReserve)
            const usdString = Number(ethers.utils.formatUnits(price, token.decimals)) * dpsPrice
            const finalBalance = ethers.utils.formatUnits(price, token.decimals)
            setUsdPrice(usdString.toString())
            setCurrentPrice(finalBalance)
            setFinalBalance(finalBalance)
          } else {
            const price = getAmountIn(BigNumber.from(Number(e.target.value)), dpsReserve, resourceReserve)
            const usdString = Number(ethers.utils.formatUnits(price, token.decimals)) * dpsPrice
            const finalBalance = ethers.utils.formatUnits(price, token.decimals)
            setUsdPrice(usdString.toString())
            setCurrentPrice(finalBalance)
            setFinalBalance(finalBalance)
          }
        } else {
          showErrorConnectToastr('noSelectResource')
        }
      }
    }

  }

  const onChangeDpsQuantity = async (e: any) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value && e.target.value !== '0') {
      if (re.test(e.target.value)) {
        if (selectedItem) {

          setCurrentPrice(e.target.value)
          const usdString = Number(e.target.value) * dpsPrice
          setUsdPrice(usdString.toString())

          if (Number(e.target.value) > Number(dpsBalance.toSignificant())) {
            setCurrentPrice(dpsBalance.toSignificant())
            const usdString = Number(dpsBalance.toSignificant()) * dpsPrice
            setUsdPrice(usdString.toString())

            let reserve = await dpsResourcesSwapContract.getReserves(selectedItem.pid)
            const dpsReserve = reserve.dpsReserve
            const resourceReserve = reserve.resourceReserve
            let dpsValue = ethers.utils.parseUnits(dpsBalance.toSignificant(), token.decimals);

            const count = getAmountOut(BigNumber.from(Number(dpsValue)), dpsReserve, resourceReserve)

            setQuantity(Number(count).toString())

            const finalAmount = getAmountIn(BigNumber.from(Number(count)), dpsReserve, resourceReserve)
            const finalAmountPrice = ethers.utils.formatUnits(finalAmount, token.decimals).toString()
            setFinalBalance(finalAmountPrice)

          } else {
            let reserve = await dpsResourcesSwapContract.getReserves(selectedItem.pid)
            const dpsReserve = reserve.dpsReserve
            const resourceReserve = reserve.resourceReserve


            if (e.target.value && e.target.value !== '0') {
              let dpsValue = ethers.utils.parseUnits(e.target.value.toString(), token.decimals);

              const count = getAmountOut(BigNumber.from(Number(dpsValue)), dpsReserve, resourceReserve)

              setQuantity(Number(count).toString())

              const finalAmount = getAmountIn(BigNumber.from(Number(count)), dpsReserve, resourceReserve)
              const finalAmountPrice = ethers.utils.formatUnits(finalAmount, token.decimals).toString()
              setFinalBalance(finalAmountPrice)
            }
          }
        } else {
          setCurrentPrice(e.target.value)
          const usdString = Number(e.target.value) * dpsPrice
          setUsdPrice(usdString.toString())
          if (Number(e.target.value) > Number(dpsBalance.toSignificant())) {
            setCurrentPrice(dpsBalance.toSignificant())
            const usdString = Number(dpsBalance.toSignificant()) * dpsPrice
            setUsdPrice(usdString.toString())
          }
        }
      }
    } else {
      setUsdPrice('')
      setQuantity('0')
      setCurrentPrice(e.target.value)
      setFinalBalance('')
    }
  }

  const onClickMax = async () => {
    if (account === null) {
      showErrorConnectToastr('disconnect');
    } else {

      if (selectedItem) {
        let reserve = await dpsResourcesSwapContract.getReserves(selectedItem.pid)
        const dpsReserve = reserve.dpsReserve
        const resourceReserve = reserve.resourceReserve

        const usdString = Number(dpsBalance.toSignificant()) * dpsPrice
        setUsdPrice(usdString.toString())
        setCurrentPrice(dpsBalance.toSignificant())

        let dpsValue = ethers.utils.parseUnits(dpsBalance.toSignificant(), token.decimals);
        const count = getAmountOut(BigNumber.from(Number(dpsValue)), dpsReserve, resourceReserve)

        setQuantity(Number(count).toString())

        const finalPrice = getAmountIn(BigNumber.from(Number(count)), dpsReserve, resourceReserve)
        const finalBalance = ethers.utils.formatUnits(finalPrice, token.decimals)
        setFinalBalance(finalBalance)
      } else {
        showErrorConnectToastr('invalidPid')
      }
    }
  }

  const onSwapDPSForExactResource = async () => {
    if (account === null) {
      showErrorConnectToastr('disconnect')
    } else {
      if (selectedItem) {
        if (Number(quantity) < 1) {
          showErrorConnectToastr('noSelectQuantity')
        } else {
          let d = new Date();
          const swapData = {
            pid: selectedItem.pid,
            amountInMax: ethers.utils.parseUnits(finalBalance, token.decimals),
            deadline: d.getTime() + 30000,
            quantity: quantity
          }
          setSwapData(swapData)
          setShowModal(true)
        }
      } else {
        showErrorConnectToastr('invalidPid')
      }
    }
  }

  const resetData = () => {
    setShowModal(false)
    setUsdPrice('')
    setCurrentPrice('')
    setFinalBalance('')
    setQuantity('')
  }
  const getDataLoop = async () => {
    const re = /^[0-9\b]+$/;
    if (quantity && selectedItem !== null && re.test(quantity)) {
      let reserve = await dpsResourcesSwapContract.getReserves(selectedItem.pid)
      const dpsReserve = reserve.dpsReserve
      const resourceReserve = reserve.resourceReserve
      let dpsValue = ethers.utils.parseUnits(currentPrice, token.decimals);
      const count = getAmountOut(BigNumber.from(Number(dpsValue)), dpsReserve, resourceReserve)

      const finalAmount = getAmountIn(BigNumber.from(count), dpsReserve, resourceReserve)
      const finalAmountPrice = ethers.utils.formatUnits(finalAmount, token.decimals).toString()
      setUsdPrice(finalAmountPrice)
    }
    setTimeout(getDataLoop, 10000)
  }
  return (
    <div onClick={(e) => { e.stopPropagation(); }}>
      <PageStyle>

        <BubbleCircle left='156px' />

        <div className='container'>
          <div className='style_subtitle_dps'>
            Trade DPS for Resources
          </div>
          <TopTile>
            <Image unoptimized={true} src={assetURL("icons/icon-72x72.png")} width="35px" height="35px" alt="dps-logo" />
            <span>DPS</span>
          </TopTile>
          <div className='DivTitle'>Current Price</div>
          <div>
            <InputDiv value={'$' + Number(usdPrice).toFixed(3)} />
          </div>

          <div className='quantity-input mobileMarginTop'>
            <QuantityInput onClick={onClickMax} quantity={currentPrice} onChange={onChangeDpsQuantity} type={'dps-resource'}></QuantityInput>
            <div className='dpsIcon'>
              <Image unoptimized={true} src={assetURL("icons/icon-72x72.png")} width="25px" height="25px" alt="dps-logo" />
            </div>
          </div>

          <div className='mt-4 mobileMarginTop'>
            <ReceiveInput onChange={onChangeReceiveQuantity} quantity={quantity} placeholder="Receive Qty" type={'dps-resource'}></ReceiveInput>

          </div>

          <div className='mt-4 mobileMarginTop'>
            <Dropdown RESOURCE_LIST={RESOURCE_LIST} selectResource={selectResource} account={account} showErrorConnectToastr={showErrorConnectToastr} />

          </div>
          <TrandeBtn onClick={onSwapDPSForExactResource}>
            <Image src={btn} width={'130px'} height={'30px'} />
            <div className='btnTitle'>TRADE</div>
          </TrandeBtn>
        </div>

        <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
        <ToastContainer ref={ref => walletCheck = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
        {account && (
          <ResourceSwapModal show={showModal} onClose={() => setShowModal(false)} shipCardType="dps-resource" showToastr={showToastr} swapData={swapData} resetData={resetData} />
        )}
      </PageStyle >
    </div>

  )
}

export default DpsToResource   