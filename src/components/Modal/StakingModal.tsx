import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import cn from 'classnames';
import '@babylonjs/loaders/glTF';
import { ToastContainer } from 'react-toastr';
import { useTransactionAdder } from '../../state/transactions/hooks';
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import { useActiveWeb3React, useApproveCallback, useDeepspaceContract, useDeepspaceShipStakingContract } from '../../hooks';
import config from '../../config';
import { detectBrowser, getNFTImageURL, getStarCount, getStarLevel, getTextureRarityColor } from '../../functions/deepspace';
import { CurrencyAmount } from '@deepspace-game/sdk';
import { MaxUint256 } from '@ethersproject/constants';
import { useDPSToken } from '../../hooks/Tokens';
import { BigNumber } from '@ethersproject/bignumber';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import { useTokenAllowanceAmount } from '../../hooks/useTokenAllowance';
import { StakingHeader } from '../StakingHeader';
import LoadingSpinner from '../LoadingSpinner';
import { ethers } from 'ethers'
import Image from 'next/image'
import DPS_SHIP_STAKING_ABI from '../../constants/abis/DPS_Ship_Staking.json'
import burnShipImage from '../../asset/image/burned ship.png';
import { useTokenBalance } from '../../state/wallet/hooks';
import { PAYMENT_DECIMALS, UNSTAKING_FEE } from '../../constants';


const StyledCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  
  .body {
    justify-content: center;
    width: auto;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color:white;
  }
  .browser-1{
    background-image:url(${config.ASSETS_BASE_URI}app/modals/modal-6.png);
  }
  .browser-2{
    background-image:url(../images/modal_1.png);
  }
  .staking-table table{
    width:100%;
    // border:1px solid gray;
    border-collapse:collapse;
    max-height:300px;
    overflow:auto;
    min-width:420px;
  }
  .texture-color{
      width:20px;
      height:20px;
      border-radius:50%;
      overflow:hidden;
      display:inline-block;
  }
  .staking-table table tr td,th{
    //   border-bottom:1px solid gray;
      font-size:14px;
      padding:3px 12px;
      border:1px solid gray;
      border-collapse:collapse;
  }
  .warning-message{
      font-size:14px;
  }
  .block-number{
      transition:.4s;
      color:#11A6E9;
  }
  .block-number:hover{
      color:#00b0ff;
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
  @media(max-width:380px){
      .rating{
          display:none;
      }
  }
  @media(max-width:315px){
    .texture{
        display:none;
    }
  }
`
export interface ComponentProps {
  show: boolean,
  onClose: (params) => void,
  PoolInfo: any
  shipList: any
  modalType: 'staking' | 'unstaking'
  rarity: []
  showToastr: any
}
export default function StakingModal({ show, onClose, PoolInfo, shipList, modalType, rarity, showToastr }: ComponentProps) {
  let container;
  const [toastr, setToastr] = useState(null);
  const { account } = useActiveWeb3React()
  const [isBrowser, setIsBrowser] = useState(false);
  const addTransaction = useTransactionAdder();
  const [loadSpinner, setLoadSpinner] = useState(0);
  const [displayShipList, setDisplayShipList] = useState([]);
  const [payUnstakingFee, setPayUnstakingFee] = useState(false);
  const deepspaceShipStakingContract = useDeepspaceShipStakingContract();
  const deepspaceContract = useDeepspaceContract();
  const browserType = detectBrowser();
  const token = useDPSToken();
  const tokenBalance = useTokenBalance(account, token);

  const currencyAmount = CurrencyAmount.fromRawAmount(token, BigNumber.from(MaxUint256).toString());

  const [approveState, approve] = useApproveCallback(currencyAmount, config.STAKING_ADDRESS);
  const [lostShipList, setLostShipList] = useState([]);

  const allowanceString = useTokenAllowanceAmount(token, account, config.STAKING_ADDRESS);
  const allowance = isBigNumberish(allowanceString) ? BigNumber.from(allowanceString) : BigNumber.from(0);
  useEffect(() => {
    if (container) {
      setToastr(container);
    }
  }, [container])
  useEffect(() => {
    (async function () {
      if (PoolInfo && shipList && shipList.length) {
        let arr = [];
        for (let i = 0; i < shipList.length; i++) {
          let ship = shipList[i];
          if (PoolInfo.luckFactor) {
            ship.burn = PoolInfo.lossBaseChance + (100 - ship.stats[4]) / PoolInfo.luckFactor;
          } else {
            ship.burn = 0;
          }
          const { poolBalance, allocatedRewardsPerBlock } = await getExpectRewardData(PoolInfo.id);
          let { currentLevel: level } = getStarLevel(ship.stats);
          let textureRarity = rarity != null ? rarity[ship.textureType] : 0;
          let d = allocatedRewardsPerBlock.mul(20 * 60 * 24 * textureRarity * level / 100).div(poolBalance.gt(0) ? poolBalance : 1).div(Math.pow(10, 7)).mul(Math.pow(10, 7));
          d = ethers.utils.commify(ethers.utils.formatUnits(d.toString(), PAYMENT_DECIMALS).toString())
          if (Number(d) && Number(d) > 2) {
            d = Number(d).toFixed(0);
          }
          ship.rewards = d;
          ship.image = getNFTImageURL(ship.shipType, ship.textureType, ship.textureNum);
          ship.textureColor = getTextureRarityColor(ship.textureType);
          ship.stars = getStarCount(ship.stats)
          arr.push(ship);
        }
        setDisplayShipList([...arr]);
      }
    })();
    setIsBrowser(true);
  }, [PoolInfo, shipList])

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const handleClose = () => {
    setLostShipList([]);
    onClose(modalType);
  }

  const getExpectRewardData = async (poolId) => {
    const rewardsPerBlock = await deepspaceShipStakingContract.rewardsPerBlock();
    const totalAllocPoint = await deepspaceShipStakingContract.totalAllocPoint();
    const poolInfo = await deepspaceShipStakingContract.poolInfo(poolId);
    const allocatedRewardsPerBlock = rewardsPerBlock.mul(poolInfo.allocPoint).div(totalAllocPoint);
    const poolBalance = poolInfo.balance;
    return { poolBalance, allocatedRewardsPerBlock };
  }
  const handleStaking = async (type) => {
    if (!displayShipList.length) { showToastr.error('Please select ships', "Error") }
    else if (displayShipList.length > 10) { showToastr.error('You can select max 10 ships', "error") }
    else if (deepspaceShipStakingContract) {
      // let PoolID = stakingPools[activeItem.key].id;
      const stakingInterface = new ethers.utils.Interface(DPS_SHIP_STAKING_ABI)
      if (Number(tokenBalance.toSignificant()) < displayShipList.length * UNSTAKING_FEE && type === 'unstaking') {
        showToastr("Balance is not enough DPS", "error");
      }
      else if (displayShipList.length == 1) {
        setLoadSpinner(1);
        try {
          const estimateGas = type === 'staking' ? await deepspaceShipStakingContract.estimateGas.depositShip(PoolInfo.id, displayShipList[0].tokenId, { gasLimit: 400000 }) : await deepspaceShipStakingContract.estimateGas.withdrawShip(PoolInfo.id, displayShipList[0].tokenId, { gasLimit: 500000 });
          const tx = type === 'staking' ? await deepspaceShipStakingContract.depositShip(PoolInfo.id, displayShipList[0].tokenId, { gasLimit: 400000 }) : await deepspaceShipStakingContract.withdrawShip(PoolInfo.id, displayShipList[0].tokenId, { gasLimit: 500000 });
          addTransaction(tx, {
            'summary': `${type} Ship #` + displayShipList[0].tokenId
          });
          setLoadSpinner(2);
          let receipt = await tx.wait();
          let stakingEvents = receipt.logs.filter((log) => {
            return log.address.toUpperCase() == config.STAKING_ADDRESS.toUpperCase()
          }).map((log) => {
            return stakingInterface.parseLog(log);
          });
          let arr = [];
          const shipLost = stakingEvents.filter((event) => {
            return event.name === 'ShipLost';
          }).map((event) => {
            displayShipList.map((ship) => {
              if (ship.tokenId === event.args.tokenId.toString()) {
                arr.push(ship);
              }
            })
          });
          setLostShipList([...arr]);
          if (!arr.length) {
            handleClose();
          }
          setLoadSpinner(0);
        } catch (error) {
          console.log(error, `single ship ${type} error`);
          setLoadSpinner(3);
        }

      } else if (displayShipList.length > 1) {
        setLoadSpinner(1);
        let tokenIdList = [];
        displayShipList.map((ship, key) => {
          tokenIdList.push(ship.tokenId);
        });
        try {
          const estimateGas = type === 'staking' ? await deepspaceShipStakingContract.estimateGas.depositShips(PoolInfo.id, tokenIdList, { gasLimit: 400000 * tokenIdList.length }) : await deepspaceShipStakingContract.estimateGas.withdrawShips(PoolInfo.id, tokenIdList, { gasLimit: 500000 * tokenIdList.length });
          const tx = type === 'staking' ? await deepspaceShipStakingContract.depositShips(PoolInfo.id, tokenIdList, { gasLimit: 400000 * tokenIdList.length }) : await deepspaceShipStakingContract.withdrawShips(PoolInfo.id, tokenIdList, { gasLimit: 500000 * tokenIdList.length });
          addTransaction(tx, {
            'summary': `${tx} Ship #` + tokenIdList.join(',')
          });
          setLoadSpinner(2);
          let receipt = await tx.wait();
          let stakingEvents = receipt.logs.filter((log) => {
            return log.address.toUpperCase() == config.STAKING_ADDRESS.toUpperCase()
          }).map((log) => {
            return stakingInterface.parseLog(log);
          });
          let arr = [];
          const shipLost = stakingEvents.filter((event) => {
            return event.name === 'ShipLost';
          }).map((event) => {
            displayShipList.map((ship) => {
              if (ship.tokenId === event.args.tokenId.toString()) {
                arr.push(ship);
              }
            })
          });

          setLostShipList([...arr]);
          if (!arr.length) {
            handleClose();
          }
          setLoadSpinner(0);
        } catch (error) {
          console.log(error, `Multi ships ${type} error`);
          setLoadSpinner(3);
          handleClose();
        }
      }
    }

  }
  const handleApprove = async () => {
    // toastr.info("You should pass approve step. Please try again after approve");
    setLoadSpinner(1);
    try {
      await approve();
      setLoadSpinner(0);
    } catch (e) {
      console.log(e, "Approve Error");
      setLoadSpinner(3);
    }
  }
  const handlePayUnstakingFee = (e) => {
    if (payUnstakingFee) {
      setPayUnstakingFee(false)
    } else {
      setPayUnstakingFee(true)
    }
  }
  const modalContent = show ? (
    <StyledCard className="z-50 Modal">
      <ToastContainer ref={ref => container = ref} className="toast-top-right" />
      <div className={cn('flex px-5 py-5 body sm:py-7 sm:px-7', {
        'browser-1': browserType !== 'Firefox',
        'browser-2': browserType === 'Firefox',
      })}>
        <div>
          <div>
            {!lostShipList.length ? (<StakingHeader className={'text-2xl text-center goldman-font'} content={`${modalType === 'staking' ? 'Stake Ships' : 'Unstake Ships'}`} />) : ('')}
          </div>
          {
            lostShipList.length ? (
              <>
                <div className='mt-2 text-center'><Image src={burnShipImage} width={'90px'} height={'90px'} /></div>
                <div className='text-sm font-bold text-center sm:text-lg' style={{ color: 'cyan' }}>You lost {lostShipList.length === 1 ? 'a' : ''} {lostShipList.length !== 1 ? lostShipList.length : ''} {lostShipList.length !== 1 ? 'ships' : 'ship'}</div>
              </>
            ) : (
              ''
            )
          }
          {
            !lostShipList.length ? (
              <>

                <div className='flex justify-center pt-3 staking-table'>
                  <table className='text-center'>
                    <thead>
                      <tr>
                        <th>Ship ID</th>
                        <th>Ship Image</th>
                        <th className='texture'>Texture</th>
                        <th className='rating'>Rating</th>
                        {
                          displayShipList.length && displayShipList[0].burn != 0 && modalType === 'staking' ? (<th>% Chance to Burn</th>) : ('')
                        }

                        {
                          modalType === 'staking' ? (<th>Est. DPS/Day</th>) : ('')
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        displayShipList.map((ship, key) => {
                          return (
                            <tr key={key}>
                              <td>{ship.tokenId}</td>
                              <td><Image src={ship.image} width='50px' height='40px' /></td>
                              <td className='texture'><div className='texture-color' style={{ backgroundColor: `${ship.textureColor}` }}></div></td>
                              <td className='rating'>
                                {[...Array(ship.stars)].map((v, i) => (
                                  <span className="rarity-star" key={i}>
                                    ★
                                  </span>
                                ))}
                              </td>
                              {
                                ship.burn != 0 && modalType === 'staking' ? (<td>{ship.burn}</td>) : ('')
                              }
                              {

                                modalType === 'staking' ? (<td>{ship.rewards}</td>) : ('')
                              }
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
                {
                  modalType === 'unstaking' && (
                    <div>
                      <div className='mt-2 text-sm text-center sm:text-base'>
                        <b>NOTE:</b> Fee removed for unstaking on 6/19/2022. (<a className='block-number' href="https://bscscan.com/block/countdown/18860361"><u>Block #18860361</u></a>)
                      </div>
                    </div>
                  )
                }
                {
                  (PoolInfo.lossBaseChance || PoolInfo.luckFactor) && modalType === 'staking' ? (
                    <div className='mt-5 warning-message'>
                      <div>WARNING: You are entering a high risk Vault pool.</div>
                      <div>There is a chance your ship NFTs may be removed from your wallet and burned.</div>
                      <div>Refer to the table above for risk</div>
                    </div>
                  ) : ('')
                }
              </>
            ) : (
              <div className='flex justify-center pt-3 staking-table'>
                <table className='text-center'>
                  <thead>
                    <tr>
                      <th>Ship ID</th>
                      <th>Ship Image</th>
                      <th>Texture</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      lostShipList.map((ship, key) => {
                        return (
                          <tr key={key}>
                            <td>{ship.tokenId}</td>
                            <td><Image src={ship.image} width='50px' height='40px' /></td>
                            <td><div className='texture-color' style={{ backgroundColor: `${ship.textureColor}` }}></div></td>
                            <td>
                              {[...Array(ship.stars)].map((v, i) => (
                                <span className="rarity-star" key={i}>
                                  ★
                                </span>
                              ))}
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            )
          }
          <div className='flex justify-around mt-5'>
            {
              !lostShipList.length ? (
                <>
                  {
                    allowance.gt(0) === false ? (

                      <button className="px-6 py-1 font-bold text-black bg-white glass-button" onClick={() => { handleApprove() }}>
                        <span className="glass-button-before"></span>
                        <span>Approve</span>
                      </button>
                    ) : (
                      <button className="px-6 py-1 font-bold text-black bg-white glass-button" onClick={() => { handleStaking(modalType) }}>
                        <span className="glass-button-before"></span>
                        <span>Submit</span>
                      </button>
                    )
                  }
                </>
              ) : ('')
            }
            <button className="px-6 py-1 ml-3 font-bold text-black bg-white glass-button" onClick={() => { handleClose() }}>
              <span className="glass-button-before"></span>
              <span>Exit</span>
            </button>
          </div>
        </div>
        {loadSpinner ? <LoadingSpinner status={loadSpinner} handleLoading={handleLoading} /> : ''}
      </div>

    </StyledCard >
  ) : null
  if (!isBrowser) {
    return null
  } else {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'))
  }
}
