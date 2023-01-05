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
  useShipsContract
} from '../../hooks'
import DPS_SHIPS_ABI from '../../constants/abis/DPS_Ships.json'
import { useTokenAllowanceAmount } from '../../hooks/useTokenAllowance'
import { MaxUint256 } from '@ethersproject/constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { CurrencyAmount } from '@deepspace-game/sdk'
import { useAddShipCard, useShipCard } from '../../state/others/hooks';
import config from '../../config'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useDPSToken } from '../../hooks/Tokens'
import { BigNumber, ethers } from 'ethers'
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { MINT_COST, MINT_RAW_COST } from '../../constants'
import LoadingSpinner from '../../components/LoadingSpinner'
import CurrencyInput from '../CurrencyInput'
import { NFTData } from '../../interface/shipcard'
import { useTokenBalance } from '../../state/wallet/hooks'
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
  .bridge-font-title {
    font-size: 15px;
  }

  .bridge-font {
    font-size: 16px;
  }
`

interface ModalCardProps {
  shipCardType?: 'buy-ship' | 'unlist-ship' | 'list-ship' | 'bridge-ship-in' | 'bridge-ship-out' | 'mint-ship' | 'staking-ship'
  show?: {}
  onClose?: () => void
  showToastr?: (param) => void
  onOpen?: () => void
}

export default function Modal({ show, shipCardType, onClose, onOpen, showToastr }: ModalCardProps) {
  const [loadSpinner, setLoadSpinner] = useState(0);
  const [isBrowser, setIsBrowser] = useState(false);
  const [listPrice, setListPrice] = useState<BigNumber>(BigNumber.from(0));
  const [approveStart, setApproveStart] = useState(false);
  const [feeListPrice, setFeeListPrice] = useState('0');
  const [totalShips, setTotalShips] = useState('0');
  const [lastMintedShip, setLastMintedShip] = useState(null);
  const { account, library } = useActiveWeb3React();
  const signer = library.getSigner()
  const addTransaction = useTransactionAdder()
  const deepspaceContract = useDeepspaceContract();
  const deepspaceShipStakingContract = useDeepspaceShipStakingContract();
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
  const addShipCard = useAddShipCard();
  const browserType = detectBrowser();
  const handleCloseClick = (e) => {
    e.preventDefault()
    setFeeListPrice("0");
    onClose()
  }
  useEffect(() => {
    setIsBrowser(true)
    handleGetTotalSupply();
  }, [])
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

      } catch (e) {
        console.log(e, "Approve Error");
        setLoadSpinner(3);
      }
      setApproveStart(true);
      if (approveState === 'APPROVED') {

      }
      setLoadSpinner(0);
    }
  }

  const handleConfirm = async (cardType) => {
    if (cardType === 'mint-ship' && deepspaceContract) {
      if (tokenBalance && Number(tokenBalance.toSignificant()) < 100) {
        showToastr('balanceNotEnough');
      } else {
        setLoadSpinner(1);
        try {
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
          addShipCard(mintedNFT);
          onOpen();
        } catch (error) {
          setLoadSpinner(3);
        }
      }
    }
    if (cardType === 'buy-ship' && deepspaceContract) {
      let shipPrice = ethers.utils.formatUnits(ethers.utils.parseUnits(price.toString(), token.decimals));
      if (tokenBalance && Number(tokenBalance.toSignificant()) < Number(shipPrice)) {
        // showToastr('balanceNotEnough');
      } else {
        setLoadSpinner(1);
        try {
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
    }
    if (cardType === 'list-ship' && deepspaceContract) {
      if (listPrice.eq(0)) { // if listPrice is 0. show message
        showToastr('listPriceError');
      } else {
        setLoadSpinner(1);
        try {
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
    if (cardType == 'unlist-ship' && deepspaceContract) {
      setLoadSpinner(1);
      try {
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
    if (cardType == 'bridge-ship-in' && deepspaceContract) {
      setLoadSpinner(1);
      try {
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
  const handleLoading = (status) => {
    setLoadSpinner(status);
  }
  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <div className={cn('sm:flex sm:flex-row body text-black p-2 items-center mx-2 relative', {
        'browser-1': browserType !== 'Firefox',
        'browser-2': browserType === 'Firefox'
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
                'sm:mb-8 sm:pb-2': shipCardType !== 'list-ship',
                'mt-3': shipCardType === 'mint-ship',
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
                  Mint a ship
                </span>
              )}
            </div>
            <div
              className={cn('text-left', {
                'sm:mb-8 pb-2': shipCardType !== 'list-ship',
              })}
            >
              {shipCardType === 'buy-ship' && (
                <span>
                  Are you sure you want <br /> to buy this ship?
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
              {shipCardType === 'mint-ship' && (
                <>
                  <p className='text-center'>You are about to mint a ship</p>
                  <p className='mt-3 text-center'>it will cost {MINT_COST} DPS</p>
                </>
              )}
            </div>

            {shipCardType === 'list-ship' && (
              <div className="text-left">
                <span className="mb-3 goldman-font" style={{ color: "#00ffff" }}> Listing Amount</span>
                <div className="relative flex flex-row mt-2">
                  <CurrencyInput onChange={onChange} />
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
              shipCardType === 'list-ship') && (
                <div
                  className={cn('flex flex-row  w-full', {
                    'justify-evenly': shipCardType === 'bridge-ship-in',
                    'justify-center': shipCardType !== ('bridge-ship-in' && 'list-ship'),
                    'justify-center sm:justify-end mt-3': shipCardType === 'list-ship',
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
