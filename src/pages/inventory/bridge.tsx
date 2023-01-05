import React, { useEffect, useState } from 'react'
import axios from "axios";
import MobileFooter from '../../components/MobileFooter'
import styled from 'styled-components';
import Head from 'next/head'
import Image from 'next/image';
import background from '../../asset/image/bridge/base_bridge.png'
import BridgeTab from './components/BridgeTab'
import QuantityInputBridgeIn from './components/QuantityInputBridgeIn'
import QuantityInputBridgeOut from './components/QuantityInputBridgeOut'
import ConfirmResoureList from './components/ConfirmResoureList'
import ResourceList from './components/ResourceList'
import AvailableShips from './components/AvailableShips'
import AvailableShipsBridgeOut from './components/AvailableShipsBridgeOut'
import ConfirmShips from './components/ConfirmShips'
import { assetURL } from '../../functions/deepspace'
import confirmBtn from '../../asset/image/bridge/confirm_btn.png'
import resetBtn from '../../asset/image/bridge/reset_btn.png'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../state'
import {
  refreshConfirmArea,
  reSetBridgeConfirmData,
  reSetBridgeIn,
  reSetConfirmData,
  setAvailableResources,
  setConfirmDps,
  setResourceConfirmWithNumber
} from '../../state/bridge/actions'
import { useActiveWeb3React, useDpsResourceBridgeContract, useDpsResourcesContract } from '../../hooks'
import { RESOURCE_LIST } from '../../constants/deepspace'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useDPSToken } from '../../hooks/Tokens'
import { BigNumber, ethers } from "ethers"
import { ToastContainer } from 'react-toastr';
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import BridgeConfirmModal from '../../components/Modal/BridgeConfirmModal'
import config from '../../config'
import InventoryLayout from '../../layouts/InventoryLayout'
import InventoryMobileFooter from './Footer'
import { sign, SignOpts } from 'web3-token'
import { useTransactionAdder } from '../../state/transactions/hooks'
import LoadingSpinner from '../../components/LoadingSpinner'

const BridgeStyle = styled.div`

  @media(max-device-width:390px) {
    display: flex;
    justify-content: center;
  }

  .bridge-container 
    justify-content: center;
  }

  .bridge-left {
    position: absolute;
    top: 0px;
    width: 483px;
    align-items: center;
    justify-content: center;
    margin-right: 452px;
    margin-top: 57px;
    .left-content {
      padding: 20px;
      .available-dps {
        display: flex;
        align-items: center;

      }
      .resource {
        margin-top: 5px;
      } 
      .ships {
        margin-top: 33px;
      }
    }
  }
  .bridge-right {
    position: absolute;
    margin-left: 583px;
    top: 57px;
    .right-content {
      padding: 20px;
      width: 365px;
      .confirm-resource {
        margin-top: 20px;
      }
      .confirm-ships {
        margin-top: 10px;
      }
      .confirm-btngroup {
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
      }
    }
  }
`
const BridgeWrapper = styled.div`
  margin-top: 80px;
  position: relative;
`
const BackGroundWapper = styled.div`
  min-width: 1102px !important;
  min-height: 664px !important;
  display: flex;
  justify-content: center;
  @media(max-device-width:1030px) {
    & {
      min-width: 100% !important;
      min-height: 1024px !important;
      padding-bottom: 150px;

      .bridge-left {
        margin-right: 0 !important;
        .tab-container>div {
          margin-top: 20px;
          &>div {
            width: 75%;
            height: 30px;
          }
        }
        .left-content {
          padding-top: 10px !important;
          &>span {
            margin-left: 57px;
            font-size: 14px;
          }
          .available-dps {
            display: flex;
            justify-content: center;

            &>div:first-child {
              width: 130px;
              &>div {
                width: 128px;
              }
            }
            &>div:last-child {
              width: 140px;
              &>button {
                width: 30px;
                font-size: 12px;
                position: relative;
                left: -23px;
                height: 17px;
              }
            }
          }
          .resource {
            margin-top: 10px;
            &>span {
              margin-left: 57px;
              font-size: 14px;
            }
            .available-resource>div {
              margin: 0 auto;
              width: 75%;
              height: 50px;
              &>div {
                height: 48px;
                padding: 0px 2px;
                &>div {
                  width: 36px;
                  height: 36px;
                }
              }
            }
          }
        }
        .ships {
          margin-top: 10px !important;
          &>span {
            margin-left: 57px;
            font-size: 14px;
          }
          .available-ships>div {
            margin: 0 auto;
            width: 75%;
            .choose-ship.goldman-font {
              padding: 5px;
              padding-top: 7px;
              height: 150px !important;
              .ship-search {
                .search-icon {
                  top: 5px;
                }
                .serch-input {
                  height: 25px;
                }
              }
            }
          }
          .ships-container {
            .cursor-pointer {
              width: 62px;
              .ship-img {
                width: 60px;
                height: 58px;
              }
            }
          }
        }
      }
      .bridge-right {
        margin-left: 0 !important;
        top: 558px;
        .right-content {
          padding-top: 0;
          .confirm-resource {
            margin-top: 10px;
            &>span {
              font-size: 14px;
            }
          }
          .confirm-ships {
            &>span {
              font-size: 14px;
            }
            &>div {
              .choose-ship.goldman-font {
                height: 160px;
              }
            }
          }
        }
      }
    }
  }
  @media(max-device-width:478px) {
    & {
      min-width: 100% !important;
      min-height: 1024px !important;
      padding-bottom: 150px;

      .bridge-left {
        width: auto !important;
        .tab-container>div {
          margin-top: 20px;
          &>div {
            width: 87% !important;
            height: 30px !important;
          }
        }
        .left-content {
          padding-top: 10px !important;
          &>span {
            margin-left: 0 !important;
          }
          .available-dps {
            display: flex;
            justify-content: center;

            &>div:first-child {
              width: 130px;
              &>div {
                width: 128px;
              }
            }
            &>div:last-child {
              width: 140px;
              &>button {
                width: 30px;
                font-size: 12px;
                position: relative;
                left: -23px;
                height: 17px;
              }
            }
          }
          .resource {
            margin-top: 10px;
            &>span {
              margin-left: 0  !important;
              font-size: 14px;
            }
            .available-resource>div {
              margin: 0 auto;
              width: 99% !important;
              height: 50px;
              &>div {
                height: 48px;
                padding: 0px 2px;
                &>div {
                  width: 36px;
                  height: 36px;
                }
              }
            }
          }
        }
        .ships {
          margin-top: 10px !important;
          &>span {
            margin-left: 0 !important;
            font-size: 14px;
          }
          .available-ships>div {
            margin: 0 auto;
            width: 99% !important;
            .choose-ship.goldman-font {
              padding: 5px;
              padding-top: 7px;
              height: 150px !important;
              .ship-search {
                .search-icon {
                  top: 5px;
                }
                .serch-input {
                  height: 25px;
                }
              }
            }
          }
          .ships-container {
            .cursor-pointer {
              width: 62px;
              .ship-img {
                width: 60px;
                height: 58px;
              }
            }
          }
        }
      }
      
    }
  }
  @media(max-width:1030px) {
    & {
      min-width: 100% !important;
      min-height: 1024px !important;
      padding-bottom: 150px;
      .arrow-img {
        display: none;
      }
      .bridge-left {
        margin-right: 0 !important;
        .tab-container>div {
          margin-top: 20px;
          &>div {
            width: 75%;
            height: 30px;
          }
        }
        .left-content {
          padding-top: 10px !important;
          &>span {
            margin-left: 57px;
            font-size: 14px;
          }
          .available-dps {
            display: flex;
            justify-content: center;

            &>div:first-child {
              width: 130px;
              &>div {
                width: 128px;
              }
            }
            &>div:last-child {
              width: 140px;
              &>button {
                width: 30px;
                font-size: 12px;
                position: relative;
                left: -23px;
                height: 17px;
              }
            }
          }
          .resource {
            &>span {
              margin-left: 57px;
              font-size: 14px;
            }
            .available-resource>div {
              margin: 0 auto;
              width: 75%;
              height: 50px;
              &>div {
                height: 41px;
                padding: 0px 2px;
                &>div {
                  width: 36px;
                  height: 36px;
                }
              }
            }
          }
        }
        .ships {
          margin-top: 24px !important;
          &>span {
            margin-left: 57px;
            font-size: 14px;
          }
          .available-ships>div {
            margin: 0 auto;
            width: 75%;
            .choose-ship.goldman-font {
              padding: 5px;
              padding-top: 7px;
              height: 150px !important;
              .ship-search {
                .search-icon {
                  top: 5px;
                }
                .serch-input {
                  height: 25px;
                }
              }
            }
          }
          .ships-container {
            .cursor-pointer {
              width: 62px;
              .ship-img {
                width: 60px;
                height: 58px;
              }
            }
          }
        }
      }
      .bridge-right {
        margin-left: 0 !important;
        top: 558px;
        .right-content {
          padding-top: 0;
          .confirm-resource {
            margin-top: 10px;
            &>span {
              font-size: 14px;
            }
          }
          .confirm-ships {
            &>span {
              font-size: 14px;
            }
            &>div {
              .choose-ship.goldman-font {
                height: 160px;
              }
            }
          }
        }
      }
    }
  }
`

const Title = styled.div`
  text-align: center;
  font-size: 18px;
`
const AmountTitle = styled.span`
  font-size: 18px;
`
const AmountContainer = styled.div`
  width: 190px;
  height: 30px;
  border: solid 2px #00AEEE;
  position: relative;
`
const Amount = styled.div`
  width: 188px;
  height: 28px;
  background: #00AEEE;
  opacity: 0.6;
`
const AmountValue = styled.span`
  position: absolute;
  top: 2px;
  color: white;
  left: 3px;
`

const Spancer = styled.div`
 width: 60px;
 height: 1px;
 background: #00AEEE;
`

const ConfirmDpaWapper = styled.div`
 width: 100%;
 height: 30px;
 border: solid 1px #00AEEE;
 margin-top: 25px;
 position: relative;
`
const ShdowConfirmDps = styled.div`
 width: 100%;
 height: 30px;
 background: black;
 opacity: 0.3; 
`
const DpsValueContainer = styled.div`
  position: absolute;
  top: 0px;
  display: flex;
  align-items: center;
  padding-top: 2px;
`

const DpsTitle = styled.span`
 
`
const DpsIcon = styled.span`
  display: flex;
  align-items: center;  
  width: 80px;
  justify-content: space-between;
  margin-left: 10px;
  margin-right: 40px;
`

const TrandeBtn = styled.div`
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
    &>div {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
    }
`
const ComImage = styled.div`
  & {
    @media(max-device-width:1030px) {
      display: none;
    }
  }
  & {
    @media(max-width:1030px) {
      display: none;
    }
  }
`

const MobileImage = styled.div`
  display: none;
  width: 478px;
  height: 1040px;
  background-image: url('/images/bridge_mobile_bg.png');
  background-repeat: no-repeat;
  background-position: center, center;
  & {
    @media(max-device-width:478px) {
      display: block;
      width: 375px;
    }
  }
  & {
    @media(max-width:1030px) {
      display: block;
    }
  }

`
export default function Bridge() {

  let container;

  const dispatch = useDispatch<AppDispatch>()
  const dpsResourcesContract = useDpsResourcesContract()
  const resourceBridgeContract = useDpsResourceBridgeContract()
  const addTransaction = useTransactionAdder()

  const { account } = useActiveWeb3React()
  const token = useDPSToken()
  const dpsBalance = useTokenBalance(account, token);

  const [loadSpinner, setLoadSpinner] = useState(0);
  const [brigeInto, setBrigeInto] = useState(true)
  const [brigeOut, setBrigeOut] = useState(false)
  const [availDps, setAvailDps] = useState(0)
  const [bridgeInDps, setBridgeInDps] = useState('')
  const [c, setC] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [bridgeData, setBridgeData] = useState<any>({})

  //bridgeout
  const [bridgeOutAvailDps, setBridgeOutAvailDps] = useState(0)
  const [tempBridgeOutAvailDps, setTempBridgeOutAvailDps] = useState(0)
  const [bridgeOutDps, setBridgeOutDps] = useState('');
  const [bridgeOutResources, setBridgeOutResources] = useState([])
  const [bridgeOutShipIds, setBridgeOutShipIds] = useState([])
  const [showBridgeContent, setShowBridgeContent] = useState(null)
  const [bridgeOutMessage, setBridgeOutMessage] = useState('')
  const [refuelShips, setRefuelShips] = useState([])

  const { confirmedShips, availableResources, confirmResources, confirmDpsValue } = useSelector((state: any) => state.bridge)

  useEffect(() => {
    setC(container);
  }, [container])

  useEffect(() => {
    if (account !== null && account !== undefined) {
      getAvailableResources()
      refreshConfirmData();
    }
  }, [account])

  const refreshConfirmData = () => {
    dispatch(refreshConfirmArea({}))
  }

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const showToastr = (status) => {
    if (c) {
      if (status === 'noSelect') c.error("Please Select One Item to Bridge", "Error");
      if (status === 'noResource') c.error('You can not select this resource.');
      if (status === 'noAvailableResource') c.error('You can not add larger amount than available resources.');
      if (status === 'noSelectResourceNum') c.error('Please select valid number.');
    }
  }

  useEffect(() => {
    if (dpsBalance) {
      setAvailDps(Number(dpsBalance.toSignificant()))
    }
  }, [dpsBalance])

  const getAvailableResources = async () => {
    const addresses = [account, account, account, account, account, account, account, account]
    const resourceIds = [0, 1, 2, 3, 4, 5, 6, 7]
    let resources = await dpsResourcesContract.balanceOfBatch(addresses, resourceIds);

    let avail_resources = []
    RESOURCE_LIST.map((item: any, index: number) => {
      const netItem = { ...item, quantity: Number(resources[index]._hex) }
      avail_resources.push(netItem)
    })
    dispatch(setAvailableResources(avail_resources))
  }


  const bridgeOutGame = () => {
    setBrigeOut(true)
    setBrigeInto(false)
    dispatch(reSetConfirmData({ confirmedShips: confirmedShips, confirmResources: confirmResources }))
    getBridgeOutItems()
    setBridgeOutDps('')
  }

  const getBridgeOutItems = async () => {
    const availableItems = await axios.get(`${config.BRIDGE_OUT_APIURI}/BridgeOut/${account}`);

    if (availableItems.data.success) {
      setShowBridgeContent(true)
      const resultData = availableItems.data.bridgableItems
      const availBridgeOutDps = ethers.utils.formatUnits(resultData.dpsBalance, token.decimals)
      setBridgeOutAvailDps(Number(availBridgeOutDps))
      setTempBridgeOutAvailDps(Number(availBridgeOutDps))
      setBridgeOutResources(resultData.resources)
      let refuelIds = [];
      if (availableItems.data.refuelingShips.length > 0) {
        availableItems.data.refuelingShips.map((item) => {
          refuelIds.push(item.shipId)
        })
      }
      setBridgeOutShipIds([...resultData.shipIds, refuelIds])
      setRefuelShips(availableItems.data.refuelingShips)

    } else {
      setShowBridgeContent(false)
      if (availableItems?.data?.errorCode === 4) {
        setBridgeOutMessage('please return to hangar')
      }
      if (availableItems?.data?.errorCode === 3) {
        setBridgeOutMessage('Bridge-out is unavailable while another bridge-out is still processing')
      }
    }
  }

  const bridgeIntoGame = () => {
    setBrigeInto(true)
    setBrigeOut(false)
    setBridgeInDps('')
    setAvailDps(Number(dpsBalance.toSignificant()))
    dispatch(reSetConfirmData({ confirmedShips: confirmedShips, confirmResources: confirmResources }))
  }

  const onChangeQuantity = (e: any) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '') {
      setBridgeInDps('')
      dispatch(setConfirmDps('Confirm DPS'))
      setAvailDps(Number(dpsBalance.toSignificant()))
    } else {
      if (re.test(e.target.value)) {
        if (Number(dpsBalance.toSignificant()) >= Number(e.target.value)) {
          const calAvailableDps = Number(dpsBalance.toSignificant()) - Number(e.target.value)
          setAvailDps(calAvailableDps);
          setBridgeInDps(Number(e.target.value).toString())
          dispatch(setConfirmDps(Number(e.target.value).toString()))
        }
      } else {
        setBridgeInDps('')
      }
    }
  }

  const onClickMax = () => {
    if (dpsBalance) {
      const maxBridgeInDps = dpsBalance.toSignificant()
      setAvailDps(0)
      setBridgeInDps(maxBridgeInDps)
      dispatch(setConfirmDps(maxBridgeInDps))
    }
  }

  const onConfirm = async () => {
    if (brigeInto) {
      if ((confirmDpsValue === 'Confirm DPS' || confirmDpsValue === '0') && confirmedShips?.length === 0 && confirmResources?.length === 0) {
        showToastr('noSelect')
      } else {
        let dpsAmount;
        if (confirmDpsValue === 'Confirm DPS') {
          dpsAmount = ethers.utils.parseUnits('0', token.decimals)
        } else {
          dpsAmount = ethers.utils.parseUnits(confirmDpsValue, token.decimals)
        }
        const shipIds = confirmedShips.map((shipData) => {
          const shipId = Number(shipData?.ship?.tokenId)
          return shipId
        })

        const resourceIds = confirmResources.map((resource) => resource?.pid)
        const resourceAmounts = confirmResources.map((resource) => resource?.quantity)
        const bridgeData = {
          shipIds: shipIds,
          resourceIds: resourceIds,
          resourceAmounts: resourceAmounts,
          dpsAmount: dpsAmount
        }
        setBridgeData(bridgeData)
        setShowModal(true)
      }
    }

    if (brigeOut) {
      if ((confirmDpsValue === 'Confirm DPS' || confirmDpsValue === '0') && confirmedShips?.length === 0 && confirmResources?.length === 0) {
        showToastr('noSelect')
      } else {
        let dpsAmount;
        if (confirmDpsValue === 'Confirm DPS') {
          dpsAmount = ethers.utils.parseUnits('0', token.decimals)
        } else {
          dpsAmount = ethers.utils.parseUnits(confirmDpsValue, token.decimals)
        }
        const shipIds = confirmedShips.map((shipData) => {
          const shipId = Number(shipData?.ship?.tokenId)
          return shipId
        })

        const resourceIds = confirmResources.map((resource) => resource?.pid)
        const resourceAmounts = confirmResources.map((resource) => resource?.quantity)
        const resources = confirmResources.map((resource) => {
          return { "resourceId": resource.pid, 'balance': resource.quantity }
        })
        const bridgeData = { shipIds: shipIds, resourceIds: resourceIds, resourceAmounts: resourceAmounts, dpsAmount: dpsAmount }
        const bridgeItems = { "dpsBalance": BigNumber.from(bridgeData.dpsAmount), "resources": resources, "shipIds": shipIds };

        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signer = provider.getSigner()

        const opts = {
          statement: 'Click "Sign" to begin the bridge out process',
          expire_in: '30m',
          request_id: ethers.utils.id(JSON.stringify(bridgeItems))
        } as SignOpts;

        setLoadSpinner(1);

        const signedWeb3Token = await sign(async (msg: any) => await signer.signMessage(msg), opts)
        if (!signedWeb3Token) {
          setLoadSpinner(3)
          return;
        } else {

          const apiResponse = await axios.post(`${config.BRIDGE_OUT_APIURI}/BridgeOut`, {
            bridgeItems: bridgeItems,
            web3token: signedWeb3Token
          });

          if (apiResponse.data.success) {
            const estimateGas = await resourceBridgeContract.estimateGas.bridgeOut(apiResponse.data.signature, apiResponse.data.deadline, account, bridgeData.shipIds, bridgeData.resourceIds, bridgeData.resourceAmounts, BigNumber.from(bridgeData.dpsAmount));
            let gasLimit = estimateGas.toNumber() + 100000;
            let tx = await resourceBridgeContract.bridgeOut(apiResponse.data.signature, apiResponse.data.deadline, account, bridgeData.shipIds, bridgeData.resourceIds, bridgeData.resourceAmounts, BigNumber.from(bridgeData.dpsAmount), { gasLimit: gasLimit })
            addTransaction(tx, {
              summary: `Bridged Out items from game`,
            })
            setLoadSpinner(2)
            await tx.wait()
            setLoadSpinner(0)
            onResetBridgeOut()
            getBridgeOutItems() //update value for max btn click again
          } else {
            setLoadSpinner(3)
          }
        }
      }
    }
  }

  const onResetBridgeOut = () => {
    setBridgeOutDps('')
    dispatch(reSetBridgeConfirmData(''))
  }

  const onResetBridgeIn = () => {
    setBridgeInDps('')
    dispatch(reSetBridgeIn({}))
  }

  const onReset = () => {
    if (brigeInto) {
      setBridgeInDps('')
      setAvailDps(Number(dpsBalance.toSignificant()));
      dispatch(reSetConfirmData({ confirmedShips: confirmedShips, confirmResources: confirmResources }))
    }

    if (brigeOut) {
      setBridgeOutDps('')
      setBridgeOutAvailDps(tempBridgeOutAvailDps)
      if ((confirmResources.length > 0) && (bridgeOutResources.length > 0)) {
        let brigeOutitems = bridgeOutResources;
        confirmResources.map((confirmItem) => {
          brigeOutitems.map((resourceItem) => {
            if (confirmItem.pid === resourceItem.resourceId) {
              resourceItem.balance = resourceItem.balance + confirmItem.quantity
            }
          })
        })

        setBridgeOutResources([...bridgeOutResources, brigeOutitems])
      }
      dispatch(reSetConfirmData({ confirmedShips: confirmedShips, confirmResources: confirmResources }))
    }
  }

  const onChangeQuantityBridgeOut = (e: any) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '') {
      setBridgeOutDps('')
      dispatch(setConfirmDps('Confirm DPS'))
      setBridgeOutAvailDps(tempBridgeOutAvailDps)
    } else {
      if (re.test(e.target.value)) {
        if (Number(tempBridgeOutAvailDps) >= Number(e.target.value)) {
          const calAvailableBridgeOutDps = Number(tempBridgeOutAvailDps) - Number(e.target.value)
          setBridgeOutAvailDps(calAvailableBridgeOutDps);
          setBridgeOutDps(Number(e.target.value).toString())
          dispatch(setConfirmDps(Number(e.target.value).toString()))
        }
      }
    }
  }

  const onClickMaxBridgeOut = () => {
    setBridgeOutAvailDps(0);
    setBridgeOutDps(tempBridgeOutAvailDps.toString())
    dispatch(setConfirmDps(tempBridgeOutAvailDps.toString()))
  }

  const confirmBridgeOutResource = (resourceItem: any, resouceNum: number) => {
    if (resourceItem.quantity < 1) {
      showToastr('noResource')
    } else {
      let resourceItems = bridgeOutResources
      dispatch(setResourceConfirmWithNumber({ item: resourceItem, resouceNum: resouceNum }))
      // dispatch(setResourceConfirm(resourceItem))
      resourceItems.map((item, index) => {
        if (item.resourceId === resourceItem.pid) {
          item.balance = item.balance - resouceNum;
        }
        return item;
      })
      setBridgeOutResources([...bridgeOutResources, resourceItems])
    }
  }

  return (
    <>
      <BridgeStyle className="block w-full">
        <Head>
          <title> DEEPSPACE - Inventory | Bridge </title>
          <meta property="og:type" content="website" />
          <meta content="summary_large_image" name="twitter:card" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" name="description" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="og:description" />
          <meta content="One of the crown jewels of the DEEPSPACE Metaverse is the Outpost. The Outpost is a decentralized exchange hub where you can buy, sell, and trade your ships, cores, and other upgradeable Smart NFTs with fellow explorers. You can use the marketplace to build limited edition ships and acquire other valuable collectible assets. Build up your fleet to explore, harvest, and fight your way through the DEEPSPACE universe!" property="twitter:description" />
        </Head>
        <div className='bridge-container goldman-font'>
          {account ? (
            <BridgeWrapper>
              <BackGroundWapper>
                <ComImage>
                  <Image src={background} alt="" />
                </ComImage>
                <MobileImage />
                <div className='bridge-left'>

                  <Title>Selection Area</Title>
                  <div className='tab-container'>
                    <BridgeTab bridgeIntoGame={bridgeIntoGame} bridgeOutGame={bridgeOutGame} brigeInto={brigeInto} brigeOut={brigeOut} />
                  </div>
                  <div className='left-content'>
                    {brigeInto && (
                      <>
                        <AmountTitle>Available DPS</AmountTitle>
                        <div className='available-dps'>
                          <AmountContainer><Amount></Amount><AmountValue>{availDps.toFixed(2)} DPS</AmountValue></AmountContainer>
                          <Spancer></Spancer>
                          <QuantityInputBridgeIn onChange={onChangeQuantity} onClick={onClickMax} bridgeInDps={bridgeInDps}></QuantityInputBridgeIn>
                        </div>

                        <div className='resource'>
                          <AmountTitle>Available Resources</AmountTitle>
                          <div className='available-resource'>
                            <ResourceList availResources={availableResources} error={showToastr} />
                          </div>
                        </div>

                        <div className='ships'>
                          <AmountTitle>Available Ships</AmountTitle>
                          <div className='available-ships'>
                            <AvailableShips />
                          </div>
                        </div>
                      </>
                    )}
                    {brigeOut && (
                      <>
                        {showBridgeContent ? (
                          <>
                            <AmountTitle>Available DPS</AmountTitle>
                            <div className='available-dps'>
                              <AmountContainer><Amount></Amount><AmountValue>{bridgeOutAvailDps.toFixed(2)} DPS</AmountValue></AmountContainer>
                              <Spancer></Spancer>
                              <QuantityInputBridgeOut onChange={onChangeQuantityBridgeOut} onClick={onClickMaxBridgeOut} bridgeOutDps={bridgeOutDps} ></QuantityInputBridgeOut>
                            </div>

                            <div className='resource'>
                              <AmountTitle>Available Resources</AmountTitle>
                              <div className='available-resource'>
                                <ResourceList bridgeOutResources={bridgeOutResources} confirmBridgeOutResource={confirmBridgeOutResource} error={showToastr} />
                              </div>
                            </div>

                            <div className='ships'>
                              <AmountTitle>Available Ships</AmountTitle>
                              <div className='available-ships'>
                                <AvailableShipsBridgeOut bridgeOutShipIds={bridgeOutShipIds} refuelShips={refuelShips} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <AmountTitle>{bridgeOutMessage}</AmountTitle>
                        )}

                      </>
                    )}
                  </div>
                </div>
                <div className='bridge-right'>
                  <Title>Confirm Area</Title>
                  <div className='right-content'>
                    <ConfirmDpaWapper>
                      <ShdowConfirmDps></ShdowConfirmDps>
                      <DpsValueContainer>
                        <DpsIcon>
                          <Image unoptimized={true} src={assetURL("icons/icon-72x72.png")} alt="" width="25px" height="25px" />
                          <DpsTitle>DPS</DpsTitle>
                        </DpsIcon>
                        <DpsTitle>{confirmDpsValue}</DpsTitle>
                      </DpsValueContainer>
                    </ConfirmDpaWapper>

                    <div className='confirm-resource'>
                      <AmountTitle>Resources</AmountTitle>
                      <ConfirmResoureList type="confirm" confirmResources={confirmResources} />
                    </div>

                    <div className='confirm-ships'>
                      <AmountTitle>Ships</AmountTitle>
                      <ConfirmShips />
                    </div>

                    <div className='confirm-btngroup'>
                      <TrandeBtn onClick={onConfirm}>
                        <Image src={confirmBtn} height={'30px'} />
                        <div className='confirm-btn'>Confirm</div>
                      </TrandeBtn>
                      <TrandeBtn onClick={onReset}>
                        <Image src={resetBtn} height={'30px'} />
                        <div className='reset-btn'>Reset</div>
                      </TrandeBtn>
                    </div>

                  </div>
                </div>
              </BackGroundWapper>
            </BridgeWrapper>
          ) : (
            <div className="flex items-center justify-center w-full">You must connect to view Bridge</div>
          )}

        </div>
        <MobileFooter />
        <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
        {account && (
          <BridgeConfirmModal show={showModal} onClose={() => setShowModal(false)} showToastr={showToastr} bridgeData={bridgeData} onReset={onResetBridgeIn} />
        )}
      </BridgeStyle>
      {loadSpinner ? <LoadingSpinner status={loadSpinner} handleLoading={handleLoading} /> : ''}
      <InventoryMobileFooter />
    </>
  )
}

Bridge.Layout = InventoryLayout

