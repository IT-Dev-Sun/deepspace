import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import ShipCard from '../ShipCard'
import Image from 'next/image'
import mintShipImage from '../../asset/image/mint-ship.png'
import cn from 'classnames'
import {
  useApproveCallback,
  useBridgeContract,
  useDeepspaceContract,
  useDeepspaceShipStakingContract,
  useMarketPlaceContract,
  useShipsContract
} from '../../hooks'
import DPS_SHIPS_ABI from '../../constants/abis/DPS_Ships.json'
import { useTokenAllowanceAmount } from '../../hooks/useTokenAllowance'
import { MaxUint256 } from '@ethersproject/constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { CurrencyAmount } from '@deepspace-game/sdk'
import { useAddMultiShips, useAddShipCard, useShipCard } from '../../state/others/hooks';
import config from '../../config'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useDPSToken } from '../../hooks/Tokens'
import { BigNumber, ethers } from 'ethers'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { MINT_COST, MINT_RAW_COST, PAYMENT_DECIMALS } from '../../constants'
import LoadingSpinner from '../../components/LoadingSpinner'
import CurrencyNumber from '../CurrencyInput/CurrencyNumber'
import AddressInput from '../AddressInput/AddressInput'
import { NFTData } from '../../interface/shipcard'
import { ToastContainer } from 'react-toastr';
import { useTokenBalance } from '../../state/wallet/hooks'
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import { detectBrowser } from '../../functions/deepspace'
import { isAddress } from '../../functions';

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
  .total-mint-value{
    // border-bottom:1px solid white;
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
`

interface ModalCardProps {
  shipCardType?: 'buy-ship' | 'unlist-ship' | 'list-ship' | 'bridge-ship-in' | 'bridge-ship-out' | 'mint-ship' | 'staking-ship' | 'update-ship' | 'transfer-ship'
  show?: {}
  onClose?: () => void
  showToastr?: (param) => void
  onOpen?: () => void
}

export default function CustomModal({ show, shipCardType, onClose, onOpen, showToastr }: ModalCardProps) {
  let container;
  const [toastr, setToastr] = useState(null);
  const [loadSpinner, setLoadSpinner] = useState(0);
  const [isBrowser, setIsBrowser] = useState(false);
  const [listPrice, setListPrice] = useState<BigNumber>(BigNumber.from(0));
  const [approveStart, setApproveStart] = useState(false);
  const [feeListPrice, setFeeListPrice] = useState('0');
  const [totalShips, setTotalShips] = useState('0');
  const [lastMintedShip, setLastMintedShip] = useState(null);
  const [mintAmount, setMintAmount] = useState(1);
  const { account, library } = useActiveWeb3React();
  const [displaySelect, setDisplaySelect] = useState(Array(10).fill(1));
  const [transferAddressChecked, setTransferAddressChecked] = useState(false)
  const [transferAddressValid, setTransferAddressValid] = useState(true)

  const [transferAddress, setTransferAddress] = useState('')

  const signer = library.getSigner()
  const addTransaction = useTransactionAdder()
  const deepspaceContract = useDeepspaceContract();
  const deepspaceShipStakingContract = useDeepspaceShipStakingContract();
  const marketplaceContract = useMarketPlaceContract();
  const shipContract = useShipsContract();
  const bridgeContract = useBridgeContract();
  const token = useDPSToken()
  const tokenBalance = useTokenBalance(account, token);
  const currencyAmount = CurrencyAmount.fromRawAmount(token, BigNumber.from(MaxUint256).toString());
  const [approveState, approve] = useApproveCallback(currencyAmount, config.DPS_APP_ADDRESS);
  const allowanceString = useTokenAllowanceAmount(token, account, config.DPS_APP_ADDRESS);
  const allowance = isBigNumberish(allowanceString) ? BigNumber.from(allowanceString) : BigNumber.from(0)
  const shipCard = useShipCard();

  const price = shipCard.price ? BigNumber.from(shipCard.price) : BigNumber.from("0")
  const formattedPrice = price ? ethers.utils.commify(+ethers.utils.formatUnits(price, PAYMENT_DECIMALS).toString()) : ''

  const addShipCard = useAddShipCard();
  const addMultiShips = useAddMultiShips();
  const browserType = detectBrowser();

  const handleCloseClick = (e) => {
    if (shipCardType === 'transfer-ship') {
      setTransferAddressChecked(false)
      setTransferAddressValid(null)
    }
    e.preventDefault()
    setFeeListPrice("0");
    onClose()
  }

  const handleTransfer = () => {
    if (transferAddressValid) {
      setTransferAddressChecked(true)
    } else {
      setTransferAddressChecked(false)
    }
  }

  useEffect(() => {
    setIsBrowser(true)
    handleGetTotalSupply();
  }, [])

  useEffect(() => {
    if (container) {
      setToastr(container);
    }
  }, [container]);

  useEffect(() => {
    if (showToastr && show && allowanceString === '0' && account) {
      showToastr('aprroveReady');
    }
    if (showToastr && show && !account) {
      showToastr('accountDisconnect');
    }
  }, [showToastr, show])

  useEffect(() => {
    if (showToastr && allowanceString !== '0' && show && approveStart) {
      setApproveStart(false);
      showToastr('approveSuccess');
    }
  }, [allowanceString])

  const handleGetTotalSupply = async () => {
    let d = await shipContract.totalSupply();
    setTotalShips(d.toString());
    let dd = await shipContract.getShip(d.sub(1));
    setLastMintedShip(dd);
  }


  const handleApprove = async (cardType) => {
    if (cardType === 'mint-ship' || cardType === 'buy-ship' || cardType === 'list-ship') {
      setLoadSpinner(1);
      try {
        await approve();
        setLoadSpinner(0);
      } catch (e) {
        console.log(e, "Approve Error");
        setLoadSpinner(3);
      }
      setApproveStart(true);
      if (approveState === 'APPROVED') {

      }
    }
  }

  const handleConfirm = async (cardType) => {

    if (cardType === 'mint-ship' && deepspaceContract) {
      setLoadSpinner(1);
      if (mintAmount == 1) {
        try {
          const estimateGas = await deepspaceContract.estimateGas.mintShip({ gasLimit: 800000 });
          const tx = await deepspaceContract.mintShip({
            gasLimit: 800000,
          })
          addTransaction(tx, {
            summary: `Mint New Ship`,
          })
          let receipt = await tx.wait()
          setLoadSpinner(2);
          const shipsIface = new ethers.utils.Interface(DPS_SHIPS_ABI);
          const shipsEvents = receipt.logs.filter(function (log) {
            return log.address == config.SHIPS_ADDRESS
          }).map(log => {
            return shipsIface.parseLog(log)
          });
          const mintEvent = shipsEvents.filter(function (event) { return event.name == "ShipMinted" })[0]
          const mintedNFT: NFTData = {
            tokenId: mintEvent.args.tokenId.toString(),
            name: mintEvent.args.name,
            owner: mintEvent.args.minter,
            shipType: mintEvent.args.shipType,
            coreType: mintEvent.args.coreType,
            textureNum: mintEvent.args.textureNum,
            textureType: mintEvent.args.textureType,
            shipLocked: false,
            stats: mintEvent.args.stats,
            cosmetics: mintEvent.args.cosmetics
          }
          setLoadSpinner(0);
          onClose()
          // addShipCard([mintedNFT]);
          addMultiShips([mintedNFT]);
          onOpen();
        } catch (error) {
          setLoadSpinner(3);
        }
      } else {
        try {
          const estimateGas = await deepspaceContract.estimateGas.mintShips(mintAmount, {
            gasLimit: 800000 * mintAmount,
          })
          const tx = await deepspaceContract.mintShips(mintAmount, {
            gasLimit: 800000 * mintAmount,
          })
          addTransaction(tx, {
            summary: `Mint New ${mintAmount} Ships`,
          })
          let receipt = await tx.wait()
          setLoadSpinner(2);
          const shipsIface = new ethers.utils.Interface(DPS_SHIPS_ABI);
          const shipsEvents = receipt.logs.filter(function (log) {
            return log.address == config.SHIPS_ADDRESS
          }).map(log => {
            return shipsIface.parseLog(log)
          });
          const MintEventList = shipsEvents.filter(function (event) {
            return event.name == "ShipMinted"
          })
          let arr = [];
          MintEventList.map((mintEvent, key) => {
            let mintedNFT: NFTData = {
              tokenId: mintEvent.args.tokenId.toString(),
              name: mintEvent.args.name,
              owner: mintEvent.args.minter,
              shipType: mintEvent.args.shipType,
              coreType: mintEvent.args.coreType,
              textureNum: mintEvent.args.textureNum,
              textureType: mintEvent.args.textureType,
              shipLocked: false,
              stats: mintEvent.args.stats,
              cosmetics: mintEvent.args.cosmetics
            }
            arr.push(mintedNFT);
          })
          addMultiShips([...arr]);
          setLoadSpinner(0);
          onOpen();
          onClose()
          // addShipCard(mintedNFT);
          // onOpen();
        } catch (error) {
          console.log(error, "Mintships Transaction");
          setLoadSpinner(3);
        }
      }
    }
    if (cardType === 'buy-ship' && deepspaceContract) {
      let shipPrice = ethers.utils.formatUnits(ethers.utils.parseUnits(price.toString(), token.decimals));
      setLoadSpinner(1);
      try {
        const estimateGas = await deepspaceContract.estimateGas.purchaseNFT(shipCard.tokenAddress, shipCard.token.tokenId, price)
        const tx = await deepspaceContract.purchaseNFT(shipCard.tokenAddress, shipCard.token.tokenId, price)
        addTransaction(tx, {
          summary: `Purchase Ship #` + shipCard.token.tokenId,
        })
        setLoadSpinner(2);
        await tx.wait()
        setLoadSpinner(0);
        onClose()
      } catch (error) {
        console.error(error)
        setLoadSpinner(3);
      }
    }
    if (cardType === 'list-ship' && deepspaceContract) {
      if (listPrice.eq(0)) { // if listPrice is 0. show message
        showToastr('listPriceError');
      } else {
        setLoadSpinner(1);
        try {
          const estimateGas = await deepspaceContract.estimateGas.listNFT(config.SHIPS_ADDRESS, shipCard.tokenId, listPrice)
          const tx = await deepspaceContract.listNFT(config.SHIPS_ADDRESS, shipCard.tokenId, listPrice)
          addTransaction(tx, {
            summary: `List Ship #` + shipCard.tokenId,
          })
          setLoadSpinner(2);
          await tx.wait()
          setLoadSpinner(0);
          onClose()
        } catch (error) {
          console.error(error)
          setLoadSpinner(3);
        }
      }


    }
    if (cardType === 'update-ship' && marketplaceContract) {
      setLoadSpinner(1);
      try {
        if (listPrice.eq(0) || !listPrice) {
          showToastr('listPriceError');
        } else {
          const estimateGas = await marketplaceContract.updatePrice(shipCard.tokenAddress, shipCard.token.tokenId, listPrice);
          const tx = await marketplaceContract.updatePrice(shipCard.tokenAddress, shipCard.token.tokenId, listPrice);
          addTransaction(tx, {
            summary: `Update Price Ship #` + shipCard.tokenId,
          });
          setLoadSpinner(2);
          await tx.wait();
          setLoadSpinner(0);
          onClose()
        }

      } catch (error) {
        console.error(error)
        setLoadSpinner(3);
      }
    }
    if (cardType == 'unlist-ship' && deepspaceContract) {
      setLoadSpinner(1);
      try {
        const estimateGas = await deepspaceContract.estimateGas.unlistNFT(config.SHIPS_ADDRESS, shipCard.token.tokenId);
        const tx = await deepspaceContract.unlistNFT(config.SHIPS_ADDRESS, shipCard.token.tokenId);
        addTransaction(tx, {
          "summary": "Unlist Ship #" + shipCard.token.tokenId,
        })
        setLoadSpinner(2);
        await tx.wait()
        setLoadSpinner(0);
        onClose()
      } catch (e) {
        console.log(e);
        setLoadSpinner(3);
      }
    }

    if (cardType == 'transfer-ship' && shipContract) {
      setLoadSpinner(1);
      try {
        const estimateGas = await shipContract.estimateGas.transferFrom(shipCard.owner, transferAddress, shipCard.tokenId);
        let gasLimit = estimateGas.toNumber() + 100000;
        const tx = await shipContract.transferFrom(shipCard.owner, transferAddress, shipCard.tokenId, { gasLimit: gasLimit });
        addTransaction(tx, {
          "summary": "transfer ship" + shipCard.tokenId,
        })
        setLoadSpinner(2);
        await tx.wait()
        setLoadSpinner(0);
        onClose()
      } catch (e) {
        console.log(e);
        setLoadSpinner(3);
      }
    }

    if (cardType == 'bridge-ship-in' && bridgeContract) {
      setLoadSpinner(1);
      try {
        const estimateGas = await bridgeContract.estimateGas.lockShip(shipCard.tokenId)
        const tx = await bridgeContract.lockShip(shipCard.tokenId)
        addTransaction(tx, {
          "summary": "Lock Ship #" + shipCard.tokenId,
        })
        setLoadSpinner(2);
        await tx.wait()
        setLoadSpinner(0);
        onClose()
      } catch (e) {
        console.log(e);
        setLoadSpinner(3);
      }
    }
    if (cardType == 'bridge-ship-out' && deepspaceContract) {
      setLoadSpinner(1);
      const deadline = Math.round(new Date().getTime() / 1000) + 10 * 60  // 1 hour

      let signature;

      // 1) Sign Message

      const message = JSON.stringify({
        owner: account,
        nftAddress: config.SHIPS_ADDRESS,
        tokenId: shipCard.tokenId,
        deadline: deadline
      })

      try {
        signature = await signer.signMessage(message)
      } catch (err) {
        console.log("Error signing transaction: ", err)
        setLoadSpinner(3);
        return
      }

      // 2) Call bridgeOut API

      const response = await fetch(config.BRIDGE_OUT_URI, {
        method: 'POST',
        body: JSON.stringify({
          signature: signature,
          owner: account,
          nftAddress: config.SHIPS_ADDRESS,
          tokenId: shipCard.tokenId,
          deadline: deadline
        }).toString(),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      let responseData;
      try {
        responseData = await response.json()
      } catch (err) {
        console.log("Error processing JSON response")
        setLoadSpinner(3);
      }

      if (!responseData.success) {
        return
      }

      const functionSignature = responseData.signature;

      if (!functionSignature) {
        setLoadSpinner(3);
        return;
      }

      // 3) Call unlock function
      try {
        const estimateGas = await bridgeContract.estimateGas.unlockShip(functionSignature, shipCard.tokenId, account, deadline)
        const tx = await bridgeContract.unlockShip(functionSignature, shipCard.tokenId, account, deadline)
        addTransaction(tx, {
          "summary": "Unlock Ship #" + shipCard.tokenId,
        })
        setLoadSpinner(2);
        await tx.wait()
      } catch (err) {
        console.log("Error in unlockShip contract function")
        setLoadSpinner(3);
        return
      }
      setLoadSpinner(0);
      onClose()
    }
  }

  const calcPrice = (digit: string) => {
    digit = digit.replace(/(,|_)/g, "");
    if (digit[digit.length - 1] === '.') digit = digit.replace(".", "");
    return digit;
  }

  const onChange = (e) => {
    let res = calcPrice(e.target.value);
    if (res) {
      setListPrice(ethers.utils.parseUnits(res, token.decimals));
      setFeeListPrice(ethers.utils.commify(+ethers.utils.formatUnits(ethers.utils.parseUnits(res, token.decimals).mul(9), 10)).toString());
    } else {
      setFeeListPrice("0");
    }
  }

  const handleMintAmount = (e) => {
    let d = e.target.value.trim();
    if ((Number(d) && d <= 10) || d.length === 0) {
      setMintAmount(d);
    }
  }

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const onChangeTransferAddress = (e) => {
    const validAddress = isAddress(e.target.value)
    setTransferAddressValid(validAddress && e.target.value.toLowerCase() === validAddress.toLowerCase())
    setTransferAddress(e.target.value)
  }

  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <ToastContainer ref={ref => container = ref} className="toast-top-right" />
      <div className={cn('sm:flex sm:flex-row body  text-black p-2 items-center mx-2 relative', {
        'browser-1': browserType !== 'Firefox',
        'browser-2': browserType === 'Firefox',
        "mobile-body-1": window.innerWidth <= 768 && browserType !== 'Firefox',
        "mobile-body-2": window.innerWidth <= 768 && browserType === 'Firefox'
      })}>
        <div className="items-center p-3 pt-5 pb-5 sm:flex sm:flex-row sm:pb-0">
          <div className="px-2">
            {shipCardType !== 'mint-ship' && (
              <ShipCard
                modaltype={shipCardType}
                nftData={shipCard['token'] ? shipCard['token'] : shipCard}
                price={''}
                nftFullData={shipCard['token'] ? shipCard['token'] : shipCard}
              />
            )}
            {shipCardType === 'mint-ship' && <Image src={mintShipImage} alt="mint-image" width={300} />}
          </div>
          <div className={cn('flex justify-start items-center text-base flex-col text-white w-full px-2', {})}>
            <div
              className={cn('', {
                'sm:mb-8 sm:pb-2': shipCardType !== 'list-ship' && shipCardType !== 'mint-ship' && shipCardType !== 'update-ship',
                'mt-3 mb-3': shipCardType === 'mint-ship',
                'mb-3': shipCardType === 'update-ship',
              })}
            >
              {shipCardType === 'buy-ship' && (
                <span className="font-extrabold goldman-font" style={{ color: '#00ffff' }}>
                  Buy Ship
                </span>
              )}
              {shipCardType === 'unlist-ship' && (
                <span className="font-extrabold goldman-font" style={{ color: '#00ffff' }}>
                  Unlist Ship
                </span>
              )}
              {shipCardType === 'bridge-ship-in' && (
                <span className="font-extrabold goldman-font bridge-font-title" style={{ color: '#00ffff' }}>
                  Entering DEEPSPACE
                </span>
              )}
              {shipCardType === 'bridge-ship-out' && (
                <span className="font-extrabold goldman-font bridge-font-title" style={{ color: '#00ffff' }}>
                  Leaving DEEPSPACE
                </span>
              )}
              {shipCardType === 'mint-ship' && (
                <span className="font-extrabold goldman-font bridge-font-title" style={{ color: '#00ffff' }}>
                  Mint ship(s)
                </span>
              )}
              {shipCardType === 'update-ship' && (
                <span className="font-extrabold goldman-font bridge-font-title" style={{ color: '#00ffff' }}>
                  Update Price Ship
                </span>
              )}
            </div>
            <div
              className={cn('text-left', {
                'sm:mb-8 pb-2': shipCardType !== 'list-ship' && shipCardType != 'mint-ship' && shipCardType != 'update-ship',
                'mb-3 pb-2': shipCardType == 'mint-ship',
                'mb-7': shipCardType == 'update-ship'
              })}
            >
              {shipCardType === 'buy-ship' && (
                <span>
                  Are you sure you want <br /> to buy this ship for {formattedPrice} DPS?
                </span>
              )}

              {shipCardType === 'unlist-ship' && (
                <span>
                  Are you sure you want <br /> to unlist this ship?
                </span>
              )}
              {shipCardType === 'bridge-ship-in' && (
                <span className="bridge-font">
                  Are you sure you want to send <br /> this ship into DEEPSPACE?
                </span>
              )}
              {shipCardType === 'bridge-ship-out' && (
                <span className="bridge-font">
                  Are you sure you want to withdraw <br /> this ship from DEEPSPACE?
                </span>
              )}
              {shipCardType === 'update-ship' && (
                <span className="bridge-font">
                  Current Price: {ethers.utils.formatUnits(ethers.utils.parseUnits(price.toString(), token.decimals))} DPS
                </span>
              )}
              {shipCardType === 'mint-ship' && (
                <>
                  <p className='text-center' style={{ fontSize: '16px' }}>You’re about to mint <span style={{ color: 'cyan', fontWeight: 'bold', fontSize: '14px' }}>{mintAmount}</span> ship(s)!</p>

                  <p className='mt-2 text-left'>Cost: {MINT_COST} DPS per ship </p>
                  <div className='flex items-center justify-start'>
                    <span>Quantity (10 max): </span>
                    <select className="mintAmount" value={mintAmount} onChange={(e) => { handleMintAmount(e) }}>
                      {
                        displaySelect.map((ele, key) => {
                          return (
                            <option value={key + 1} key={key}>{key + 1}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                  <p className='text-left total-mint-value'>Total Value: <span>{Number(MINT_COST) * mintAmount}</span> DPS</p>
                </>
              )}

              {(shipCardType === 'transfer-ship') && (transferAddressChecked === true) && (
                <span>
                  Are you sure you want to transfer this ship to <br /> {transferAddress} <br /> address?
                </span>
              )}

              {(shipCardType === 'transfer-ship') && (transferAddressChecked === false) && (
                <>
                  <span>
                    Input address for transfering the ship.
                  </span>
                  <div className="relative flex flex-row mt-2">
                    <AddressInput onChange={onChangeTransferAddress} value={transferAddress} />
                  </div>

                  {transferAddressValid === false && (
                    <span style={{ color: 'red' }}>invalid address</span>
                  )}

                  <div className='flex justify-center mt-4'>
                    <button onClick={handleCloseClick} className={cn("glass-button bg-white px-4 py-1 text-black font-bold")}>
                      <span className="glass-button-before"></span>
                      <span>Cancel</span>
                    </button>

                    <button onClick={handleTransfer} className={cn("glass-button bg-white px-4 py-1 text-black font-bold ml-4")}>
                      <span className="glass-button-before"></span>
                      <span>Transfer</span>
                    </button>
                  </div>

                </>
              )}

            </div>

            {shipCardType === 'list-ship' && (
              <div className="text-left">
                <span className="mb-3 goldman-font" style={{ color: "#00ffff" }}> Listing Amount</span>
                <div className="relative flex flex-row mt-2">
                  <CurrencyNumber onChange={onChange} val={listPrice.div(Math.pow(10, token.decimals)).toString()} />
                  <div className="absolute right-0 px-3 text-base font-bold text-white border-none top-2" style={{ marginTop: '2px' }}> DPS</div>
                </div>
                {
                  feeListPrice !== '0' && (
                    <div className="mt-2">
                      <div className="mb-3 goldman-font" style={{ color: "#00ffff" }}>Amount to receive</div>
                      <div className='font-bold text-right' style={{ borderBottom: "2px solid #bcbfc5" }}>{feeListPrice} DPS</div>
                    </div>
                  )
                }
              </div>
            )}

            {shipCardType === 'update-ship' && (
              <div className="text-left">
                <span className="mb-3 goldman-font" style={{ color: "#00ffff" }}> Listing Amount</span>
                <div className="relative flex flex-row mt-2">
                  <CurrencyNumber onChange={onChange} val={listPrice.div(Math.pow(10, token.decimals)).toString()} />
                  <div className="absolute right-0 px-3 text-base font-bold text-white border-none top-2" style={{ marginTop: '2px' }}> DPS</div>
                </div>
                {
                  feeListPrice !== '0' && (
                    <div className="mt-2">
                      <div className="mb-3 goldman-font" style={{ color: "#00ffff" }}>Amount to receive</div>
                      <div className='font-bold text-right' style={{ borderBottom: "2px solid #bcbfc5" }}>{feeListPrice} DPS</div>
                    </div>
                  )
                }
              </div>
            )}

            {(shipCardType === 'unlist-ship' ||
              shipCardType === 'buy-ship' ||
              shipCardType === 'mint-ship' ||
              shipCardType === 'bridge-ship-in' ||
              shipCardType === 'bridge-ship-out' ||
              shipCardType === 'list-ship' ||
              (shipCardType === 'transfer-ship' && transferAddressChecked) ||
              shipCardType === 'update-ship') && (
                <div
                  className={cn('flex flex-row  w-full', {
                    'justify-evenly': shipCardType === 'bridge-ship-in',
                    'justify-center': shipCardType !== ('bridge-ship-in' && 'list-ship'),
                    'justify-center sm:justify-end mt-3': shipCardType === 'list-ship' || shipCardType === 'update-ship',
                  })}
                >
                  <button onClick={handleCloseClick} className={cn("glass-button bg-white px-4 py-1 text-black font-bold", {
                    'mb-3': shipCardType === 'mint-ship'
                  })}>
                    <span className="glass-button-before"></span>
                    <span>Cancel</span>
                  </button>
                  {(
                    (shipCardType === 'mint-ship' && allowance.gte(MINT_RAW_COST)) ||
                    (shipCardType === 'buy-ship' && allowance.gte(price)) ||
                    shipCardType === 'unlist-ship' ||
                    shipCardType === 'list-ship' ||
                    shipCardType === 'transfer-ship' ||
                    shipCardType === 'update-ship' ||
                    shipCardType === 'bridge-ship-in' ||
                    shipCardType === 'bridge-ship-out'
                  ) ? (
                    <button
                      onClick={() => { handleConfirm(shipCardType) }}
                      className={cn('glass-button bg-white px-4 py-1 text-black font-bold ml-2', {
                        'mb-3': shipCardType === 'mint-ship',
                      })}
                      style={!account ? { cursor: "not-allowed", 'pointerEvents': 'all' } : {}}
                      disabled={!account ? true : false}
                    >
                      <span className="glass-button-before"></span>
                      <span>Confirm</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { handleApprove(shipCardType) }}
                      className={cn('glass-button bg-white px-4 py-1 text-black font-bold ml-2', {
                        'mb-3': shipCardType === 'mint-ship',
                      })}
                      style={!account ? { cursor: "not-allowed", 'pointerEvents': 'all' } : {}}
                      disabled={!account ? true : false}
                    >
                      <span className="glass-button-before"></span>
                      <span>Approve</span>
                    </button>
                  )
                  }
                </div>
              )}
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
