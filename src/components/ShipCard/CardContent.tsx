import React, { useEffect, useState } from 'react';
import cn from 'classnames'
import { PAYMENT_DECIMALS } from '../../constants'
import { useAddShipCard } from '../../state/others/hooks';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { ethers } from 'ethers'
import CustomModal from '../../components/Modal/CustomModal'
import { ToastContainer } from 'react-toastr';
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import { NFTData } from '../../interface/shipcard';
import { AnimateCheckBox } from '../AnimateCheckBox';
import { useDeepspaceShipStakingContract } from '../../hooks';
import { getStarCount, getStarLevel } from '../../functions/deepspace';
import config from '../../config'
import lockImg from '../../asset/image/icons/lock_icon.svg'
import Image from 'next/image'
import transferIcon from '../../asset/image/transfer_icon.svg'
import TooltipAlt from "../TooltipAlt";


interface CardContentProps {
  cardType?: 'inventory' | 'shipsoutpost' | 'my-listing' | 'in-game-asset' | 'staking' | 'unstaking' | 'ship-link'
  nftData: NFTData
  price?: string
  modaltype?: 'buy-ship' | 'unlist-ship' | 'list-ship' | 'bridge-ship-in' | 'bridge-ship-out' | 'mint-ship'
  nftFullData: any
  PoolId?: number
  handleStatus?: any
  canAction: boolean
  selectPool?: any
}

const CardContent: React.FC<CardContentProps> = ({
                                                   cardType,
                                                   price,
                                                   nftData,
                                                   modaltype,
                                                   nftFullData,
                                                   handleStatus,
                                                   PoolId,
                                                   canAction,
                                                   selectPool
                                                 }) => {
  let container;
  const [c, setC] = useState(null)
  const addShipCard = useAddShipCard();
  const deepspaceShipStakingContract = useDeepspaceShipStakingContract();
  const {account} = useActiveWeb3React()

  const formattedPrice = price ? ethers.utils.commify(+ethers.utils.formatUnits(price, PAYMENT_DECIMALS).toString()) : ''
  const stars = getStarCount(nftData.stats)
  const [showUnListModal, setShowUnListModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [showtransferModal, setShowTransferModal] = useState(false)
  const [showLockModal, setShowLockModal] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [showStakingShipModal, setShowStakingShipModal] = useState(false);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);
  const [rewards, setRewards] = useState(null);

  useEffect(() => {
    setC(container);
  }, [container])

  const showToastr = (status) => {
    if (c) {
      let msg_type = "";
      switch (modaltype) {
        case 'buy-ship':
          msg_type = 'buy this ship';
          break;
        case 'list-ship':
          msg_type = 'list this ship';
          break;
        case 'mint-ship':
          msg_type = 'mint a ship';
          break;
      }
      if (status === 'accountDisconnect') c.error("Please connect wallet", "Error");
      if (status === 'aprroveReady') c.info("A one-time Approve request is required before getting started", "Message");
      if (status === 'approveSuccess') c.success(`Approve success. You can ${msg_type}. Please click confirm.`, 'Success');
      if (status === 'listPriceError') c.error("List price is not valid.", "Error");
      if (status === 'balanceNotEnough') c.error("Balance is not enough", "Error");
    }
  }
  useEffect(() => {
    (async () => {
      if (nftData.stakingPoolId != null) {
        const {poolBalance, allocatedRewardsPerBlock} = await getExpectRewardData(nftData?.stakingPoolId);
        let {currentLevel: level} = getStarLevel(nftData.stats);
        let textureRarity = nftData.rarity != null ? nftData.rarity[nftData.textureType] : 0;
        let rewardPrice = allocatedRewardsPerBlock.mul(20 * 60 * 24 * textureRarity * level / 100).div(poolBalance).div(Math.pow(10, 7)).mul(Math.pow(10, 7));
        let d = ethers.utils.commify(+ethers.utils.formatUnits(rewardPrice.toString(), PAYMENT_DECIMALS).toString())
        setRewards(d);
      }
    })();
  }, [nftData])

  const getExpectRewardData = async (poolId) => {
    const rewardsPerBlock = await deepspaceShipStakingContract.rewardsPerBlock();
    const totalAllocPoint = await deepspaceShipStakingContract.totalAllocPoint();
    const poolInfo = await deepspaceShipStakingContract.poolInfo(poolId);
    const allocatedRewardsPerBlock = rewardsPerBlock.mul(poolInfo.allocPoint).div(totalAllocPoint);
    const poolBalance = poolInfo.balance;
    return {poolBalance, allocatedRewardsPerBlock};
  }

  return (
    <div onClick={(e) => {
      e.stopPropagation();
    }}>
      <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{zIndex: '100000'}}/>
      <div
        className={cn('text-center', {
          'flex items-center justify-center mt-2 mb-1 sm:pt-0': cardType === 'shipsoutpost' || cardType === 'inventory' || cardType === "my-listing",
        })}
      >
        {cardType === 'inventory' && account?.toLowerCase() === nftFullData.owner && (
          <div className="flex flex-row justify-evenly w-full" style={{gridGap: '8px'}}>
            {nftData.shipLocked ? (
              <>
                {
                  config.BUTTONS.filter((button) => {
                    return button === 'Ship Locked'
                  }).map((buttonName, key) => {
                    return (
                      <TooltipAlt label="This ship is locked" key={key}>
                        <button
                          onClick={() => {
                          }}
                          className="flex items-center justify-center w-24 py-1 font-medium transition-all rounded inv-btn animation-btn"
                          key={key}
                          style={{height: 34,}}
                        >
                          <Image alt={'lockImg'} src={lockImg}/>
                        </button>
                      </TooltipAlt>
                    )
                  })
                }
              </>
            ) : (
              <>
                <div className="flex items-center relative w-full justify-center">
                  <button
                    onClick={() => {
                      addShipCard(nftData);
                      setShowListModal(true)
                    }}
                    className="w-24 py-1 font-medium transition-all rounded inv-btn animation-btn"
                  >
                    List
                  </button>
                  <TooltipAlt label="Transfer this ship"
                              className="absolute"
                              style={{right: '23px'}}
                              innerClassName="flex items-center cursor-pointer">
                    <Image src={transferIcon}
                           width="35px"
                           height="35px"
                           onClick={() => {
                             addShipCard(nftData);
                             setShowTransferModal(true)
                           }}/>
                  </TooltipAlt>
                </div>
              </>
            )}
          </div>
        )}

        {cardType === 'shipsoutpost' && (
          <div className='w-full'>
            <p
              className={cn('font-bold ', {
                'mb-1 text-xs md:text-sm': cardType === 'shipsoutpost',
              })}
            >
              Price: {formattedPrice} DPS
            </p>
            {
              (account && account.toLowerCase() === nftFullData['seller'].toLowerCase()) ? (
                <div className='flex justify-around w-full'>

                  <button
                    onClick={() => {
                      addShipCard(nftFullData);
                      setShowUnListModal(true)
                    }}
                    className={cn('w-24 py-1 font-medium transition-all rounded inv-btn animation-btn', {})}
                  >
                    Unlist
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      addShipCard(nftFullData);
                      setShowModal(true)
                    }}
                    className="w-24 py-1 font-medium transition-all rounded inv-btn animation-btn"
                  >
                    Buy
                  </button>
                </>
              )
            }
          </div>
        )}

        {modaltype === 'buy-ship' && (
          <div className="flex items-center justify-center">
            {' '}
            <p className="pt-2 text-sm font-bold xl:pt-1">Price: {formattedPrice} DPS</p>
          </div>
        )}

        {modaltype === 'list-ship' && (
          <div className="flex items-center justify-center">
            {' '}
            <p className="pt-2 text-sm font-bold lg:mb-4 xl:pt-1">Price: {formattedPrice} DPS</p>
          </div>
        )}

        {cardType === 'my-listing' && (
          <div className='w-full'>
            <p className="mb-1 text-sm font-bold lg:mb-1">Price: {formattedPrice} DPS</p>
            <div className='flex justify-around w-full mb-1'>

              <button
                onClick={() => {
                  addShipCard(nftFullData);
                  setShowUnListModal(true)
                }}
                className="w-24 py-1 font-medium transition-all rounded inv-btn animation-btn"
              >
                Unlist
              </button>

            </div>
          </div>
        )}
        {cardType === 'staking' && (
          <>
            <div
              className="flex justify-center mt-1 mb-1"
            >
              <div>Rewards/Day: {rewards ? rewards : ""} DPS</div>
            </div>
            <div
              className="flex justify-center"
            >
              {
                PoolId !== nftData.stakingPoolId && PoolId != null || canAction === false ? (
                  ''
                ) : (
                  <AnimateCheckBox
                    handleStatus={handleStatus}
                    nftData={nftData}
                  />
                )
              }
            </div>

          </>
        )}
        {cardType === 'unstaking' && (
          <div
            className="flex mt-3 mb-2"
            style={{
              gridGap: '8px',
            }}
          >
            {
              PoolId != null && selectPool.minStars <= stars && stars <= selectPool.maxStars && canAction ? (
                <AnimateCheckBox
                  handleStatus={handleStatus}
                  nftData={nftData}
                />
              ) : ('')
            }
          </div>
        )}
        {
          cardType === 'ship-link' && formattedPrice != '0' && formattedPrice.length ? (
            <p className="pt-3 mb-2 text-sm font-bold ">Price: {formattedPrice} DPS</p>
          ) : ('')
        }
        <CustomModal show={showModal} onClose={() => setShowModal(false)} shipCardType="buy-ship"
                     showToastr={showToastr}/>
        <CustomModal show={showUnListModal} onClose={() => setShowUnListModal(false)} shipCardType="unlist-ship"
                     showToastr={showToastr}/>
        <CustomModal show={showLockModal} onClose={() => {
          setShowLockModal(false);
        }} shipCardType="bridge-ship-in" showToastr={showToastr}/>
        <CustomModal show={showUnListModal} onClose={() => {
          setShowUnListModal(false);
        }} shipCardType="unlist-ship" showToastr={showToastr}/>
        <CustomModal show={showListModal} onClose={() => {
          setShowListModal(false);
        }} shipCardType="list-ship" showToastr={showToastr}/>
        <CustomModal show={showtransferModal} onClose={() => {
          setShowTransferModal(false);
        }} shipCardType="transfer-ship" showToastr={showToastr}/>
        <CustomModal show={showUnlockModal} onClose={() => {
          setShowUnlockModal(false);
        }} shipCardType="bridge-ship-out" showToastr={showToastr}/>
        <CustomModal show={showStakingShipModal} onClose={() => {
          setShowStakingShipModal(false);
        }} shipCardType="staking-ship" showToastr={showToastr}/>
        <CustomModal show={showUpdatePriceModal} onClose={() => {
          setShowUpdatePriceModal(false);
        }} shipCardType="update-ship" showToastr={showToastr}/>
      </div>
    </div>
  )
}
export default CardContent;