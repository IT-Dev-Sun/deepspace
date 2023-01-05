import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import Head from 'next/head'
import styled from 'styled-components';
import Default from "../../layouts/Default";
import { useActiveWeb3React, useDeepspaceContract, useDeepspaceShipStakingContract } from '../../hooks'
import {
  useAddFilterBox,
  useFilterBox,
  useFilterData,
  useRemoveFilterBox,
  useShipSelects,
  useUpdateFilterData,
  useUpdateShipSelects
} from '../../state/others/hooks';
import { StakingToggle } from '../../components/StakingToggle';
import { usePoolList, useStakingList, useStakingPoolUser } from '../../services/graph/hooks/deepspace'
import ShipCard from '../../components/ShipCard';
import StakingDashboardMobileComponent from '../../components/StakingDashboardMobileComponent';
import FilterShips from '../../components/FilterShips';
import Pagination from '../../components/Pagination'
import { PAYMENT_DECIMALS } from '../../constants';
import { assetURL } from '../../functions/deepspace'
import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';
import { useTokenAllowanceAmount } from '../../hooks/useTokenAllowance';
import { useDPSToken } from '../../hooks/Tokens';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import { CurrencyAmount } from '@deepspace-game/sdk';
import { MaxUint256, Zero } from '@ethersproject/constants';
import StakingDashboardDeskTopComponent from '../../components/StakingDashboardDesktopComponent';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ToastContainer } from 'react-toastr';
import { BigNumber, ethers } from 'ethers'
import DPS_SHIP_STAKING_ABI from '../../constants/abis/DPS_Ship_Staking.json'
import "toastr/build/toastr.css";
import "animate.css/animate.css";
import StakingModal from '../../components/Modal/StakingModal';
import HelperModal from '../../components/Modal/HelperModal';
import Lottie from 'react-lottie';
import * as LoadingLottie from '../../components/LoadingSpinner/Loading_1.json';
import SkeletonLoading from '../../components/SkeletonLoading';
import TimerComponent from '../../components/TimerComponent';
import axios from 'axios'

const pageId = 'staking'

const StakingStyle = styled.div`
    & {
      overflow: auto;
      height: calc(100vh - 120px);
      padding-bottom: 0 !important;
      /* width */
      ::-webkit-scrollbar {
        width: 5px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: #f1f1f1; 
      }
      
      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #888; 
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: #555; 
      }
    }
    .loading-lottie{
        left:50%;
        top:200px;
        transform:translate(-50%,0%);
    }
    .staking-dashboard{
        min-height:600px;
        width:950px;
    }
    tbody tr>td:first-child> div{
        border-left:12px solid #58079A;
    }
    .dashboard-table{
        overflow:auto;
    }
    .dashboard-table::-webkit-scrollbar {
        width: 10px;
    }
    .dashboard-table::-webkit-scrollbar-track {
        background-color:transparent;
        border-radius:6px;
        border:1px solid gray;
        overflow:hidden;
    }
    .dashboard-table::-webkit-scrollbar-thumb {
        background-color:#0A1014;
        border-radius:6px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
    
    .pool-info{
        background-color:rgba(0,0,0,0.1);
        padding:9px 12px;
        font-size:14px;
        border:2px dotted #DC00A5;
        border-radius:12px;
        cursor:pointer;
        transition:.5s;
    }
    .pool-info:hover{
        border-color:cyan;
    }
    .pool-active{
        border-color:cyan;
    }
    .pool-key{
        width:260px;
        border-bottom:1px solid rgba(255,255,255,0.4);
    }
    .pool-value{
        text-align:left;
        padding:0px 9px;
        width:120px;
        border-bottom:1px solid rgba(255,255,255,0.4);
    }
    .staking-list-section{
        width:100%;
        max-width:1560px;
    }
    .staking-filter{
    }
    .staking-ships{
        width:100%;
        min-width:calc( 100% - 263px );
    }
    .staking-button{
        width:120px;
        background-color:transparent;
        text-align:center;
        border-radius:3x;
        transition:.5s;
        padding:0px 3px;
        cursor:pointer;
        background-color:#DC00A5;
        box-shadow: 0px 0px 3px 1px rgb(255 255 255 / 80%);
        border-radius:3px;
        margin-top:6px;
        height:27px;
        font-size:13px;
    }
    .staking-button:hover{
        box-shadow: 0px 0px 6px 2px rgb(255 255 255 / 80%);
    }
    .staking-button.active-button{
        background-color:#7d17c9;
    }
    .staking-list{
        width: calc( 100% - 263px );
    }
    .pool-approve{
        position:fixed;
        right:12px;
        top:90px;
    }
    .pool-approve-title{
        font-size:16px;
    }
    .pool-approve-button{
        border:2px solid #DC00A5;
        border-radius:9px;
        width:180px;
        font-size:14px;
        height:32px;
        cursor:pointer;
        transition:.7s;
    }
    .pool-approve-button:hover{
        background-color:#DC00A5;
        
    }
    .help-document{
        top:78px;
        right: 54px;
        font-size: 32px;
        font-weight: bold; 
        cursor:pointer;
        transition:.5s;
        color:white;
    }
    .help-document:hover{
        color:#DC00A5;
    }
    @media(max-width:1024px){
        .staking-dashboard{
            width:930px;
            min-height:567px;
        }
        .dashboard-table{
            // height:515px;
        }
    }
    @media(max-width:992px){
        .staking-dashboard{
            width:725px;
            min-height:443px;
            padding-left:35px;
            padding-right:35px;
        }
        .dashboard-table{
        }
        .emptyTd{
            width:50px;
        }
        .pool-data-section > div{
            margin-top:3px;
        }
        .staking-button-section{
            width:unset;
        }
        .staking-button-group{
            display:flex;
            width:100%;
        }
        .help-document{
            top: 65px;
            right: 42px;
        }
    }
    @media(max-width:768px){
        .staking-filter{
            width:100%;
            display:flex;
            justify-content:center;
        }
        .staking-list{
            width:100%;
        }
        .staking-ships{
            width:100%;
        }
        .staking-button{
            font-size: 12px;
            width: 90px;
            height: 25px;
        }
        pool-value, .pool-key{
            border-bottom:unset;
        }
        .help-document{
            right:0!important;
            top:-27px!important;
        }
        .claim-button{
            top: -28px;
            right: 49px;
        }
        .loading-lottie{
            left:0;
            top:0;
            transform:unset;
            position:static;
            display:flex;
            justify-content:center;
            align-items:center;
            position:fixed;
            width:100vw;
            height:100vh;
            background-color:rgba(0,0,0,0.9);
        }
        .loading-lottie > div{

        }
    }
    @media(min-width:992px){
        .staking-button{
            position:relative;
            top:-12px;
            margin-top:6px;

        }
        .claim-button{
            position:static;
        }
    }
`
class PoolData {
  id: string;
  rating: string;
  minStars: number;
  maxStars: number;
  safe: boolean;
  qty: string = '0';
  nft_pool: string;
  apr: string
  earned: string
  checked: boolean
  rarity: any

}
export default function Staking() {

  var container;
  const [toastr, setToastr] = useState(null)
  const { account } = useActiveWeb3React()
  const filterData = useFilterData();
  const fBox = useFilterBox();
  const addTransaction = useTransactionAdder()
  const updateFilterData = useUpdateFilterData();
  const updateShipSelects = useUpdateShipSelects();
  const addFilterBox = useAddFilterBox();
  const shipSelects = useShipSelects();
  const removeFilterBox = useRemoveFilterBox();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  const [widths, setWidths] = useState([]);
  const [activeItem, setActiveItem] = useState({ key: -1, type: 'Stake' });
  const [rarity, setRarity] = useState(null);
  const [isStaking, setIsStaking] = useState(false)
  const [browserWidth, setBrowserWidth] = useState(0)
  const [pagination, setPagination] = useState(0);
  const [stakingPools, setStakingPools] = useState([]);
  const [shipList, setShipList] = useState([]);
  const [checkedShipList, setCheckedShipList] = useState([]);
  const [loadSpinner, setLoadSpinner] = useState(0);
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [showUnstakingModal, setShowUnstakingModal] = useState(false);
  const [showHelperModal, setShowHeloperModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [totalReward, settotalReward] = useState('0');
  const [countDownTime, setCountDownTime] = useState(null);

  const bannerAlert = config.BANNER_ALERT;
  const token = useDPSToken();
  const currencyAmount = CurrencyAmount.fromRawAmount(token, BigNumber.from(MaxUint256).toString());

  const allowanceString = useTokenAllowanceAmount(token, account, config.STAKING_ADDRESS);
  const allowance = isBigNumberish(allowanceString) ? BigNumber.from(allowanceString) : BigNumber.from(0);

  const { data: ListData, mutate: userShipsList, error: shipError } = useStakingList(isStaking, pagination, stakingPools.length > 0 && activeItem.key != -1 ? stakingPools[activeItem.key].id : -1);
  const { data: poolList, mutate: userPoolList, error: poolError } = usePoolList();
  const { data: poolInfo, mutate: userPoolInfo, error: poolInfoError } = useStakingPoolUser();
  const tHeaderRef = useRef([]);
  const deepspaceContract = useDeepspaceContract();
  const deepspaceShipStakingContract = useDeepspaceShipStakingContract();

  useEffect(() => {
    async function setListData() {
      if (ListData && isStaking && poolList && rarity && poolInfo) {
        var arr = [];
        ListData.map((ship, key) => {
          let data = ship['ship'];
          data.checked = false;
          data.rarity = rarity;
          data.stakingPoolId = Number(ship.stakingPoolId);
          arr.push(data);
        })
        setShipList([...arr]);
      } else if (ListData && !isStaking && poolList && rarity) {
        var arr = [];
        ListData.map((ship, key) => {
          let data = ship['ship'];
          data.checked = false;
          arr.push(data);
        })
        setShipList([...arr]);
      }
    }
    setListData();
  }, [ListData, poolList, rarity, poolInfo]);

  useEffect(() => {
    (async function () {
      await handleUpdatePool();
    })();
  }, [poolList, poolInfo, userPoolInfo, activeItem]);

  useEffect(() => {
    let arr = [];
    let ct = 0;
    shipList.map((ship, key) => {
      if (ship.checked) {
        ct++;
        if (ct > 10) {
          toastr.error("You can select max 10 ships", "error");
        } else {
          arr.push(ship);
        }
      }
    });
    setCheckedShipList(arr);
    handlePagination(0);
  }, [shipList])

  useEffect(() => {
    if (container) {
      setToastr(container);
    }
  }, [container])

  useEffect(() => {
    checkEndBlockTime();
    getTextureMultiplier();
    if (bannerAlert) {
      setShowBanner(true);
    }
  }, [])

  useEffect(() => {
    setPagination(0);
  }, [isStaking, shipSelects]);

  const checkEndBlockTime = async () => {
    const api_key = config.BSCSCAN_API_KEY
    const response = await axios.get(`https://api.bscscan.com/api?module=block&action=getblockcountdown&blockno=18860361&apikey=${api_key}`)
    if (response.data.message === 'OK' && response.data.status === '1') {
      let d = new Date();
      const currentTime = d.getTime();
      setCountDownTime(currentTime + (response.data.result.EstimateTimeInSec * 1000))
    } else {

    }
  }

  const handleUpdatePool = async () => {
    if (poolList && poolList.length) {
      var arr = [];
      var reward = BigNumber.from('0');
      var rewardData = { earned: '0', rawEarned: BigNumber.from('0') };
      for (let j = 0; j < poolList.length; j++) {
        let p = poolList[j];
        var data = new PoolData();
        data.id = p.id;
        data.rating = p.minStars;
        data.minStars = p.minStars;
        data.maxStars = p.maxStars;
        data.safe = p.lossBaseChance == 0 && p.luckFactor == 0 ? true : false;
        const poolInfoData = await deepspaceShipStakingContract.poolInfo(p.id);
        data.nft_pool = poolInfoData.numShips.toString();
        if (poolInfo) {
          for (let i = 0; i < poolInfo.length; i++) {
            if (poolInfo[i].user.toUpperCase() === account.toUpperCase() && poolInfo[i].stakingPoolId === p.id) {
              data.qty = poolInfo[i].numShips;
              break;
            }
          }
          rewardData = await getPendingRewards(p.id);
          data.earned = rewardData.earned;
        } else {
          data.qty = '0';
          data.earned = '0';
        }
        data.apr = await getAPR(p.id);
        reward = reward.add(rewardData.rawEarned);
        arr.push(data);
      }
      setStakingPools([...arr]);
      settotalReward(ethers.utils.commify(ethers.utils.formatUnits(reward.toString(), PAYMENT_DECIMALS).toString()));
    }
  }
  const getTextureMultiplier = async () => {
    const tx = await deepspaceShipStakingContract.getTextureMultiplier();
    setRarity(tx);
  }
  const getExpectRewardData = async (poolId) => {
    const rewardsPerBlock = await deepspaceShipStakingContract.rewardsPerBlock();
    const totalAllocPoint = await deepspaceShipStakingContract.totalAllocPoint();
    const poolInfo = await deepspaceShipStakingContract.poolInfo(poolId);
    const allocatedRewardsPerBlock = rewardsPerBlock.mul(poolInfo.allocPoint).div(totalAllocPoint);
    const poolBalance = poolInfo.balance;
    return { poolBalance, allocatedRewardsPerBlock };
  }
  const getAPR = async (poolId) => {
    const rewardsPerBlock = await deepspaceShipStakingContract.rewardsPerBlock();
    const totalAllocPoint = await deepspaceShipStakingContract.totalAllocPoint();
    const poolInfo = await deepspaceShipStakingContract.poolInfo(poolId);
    const allocatedRewardsPerBlock = rewardsPerBlock.mul(poolInfo.allocPoint).div(totalAllocPoint);
    const d = allocatedRewardsPerBlock.mul(20 * 60 * 24).div(poolInfo.numShips.toString() === '0' ? 1 : poolInfo.numShips).div(Math.pow(10, 7)).mul(Math.pow(10, 7));
    let dd = ethers.utils.commify(+ethers.utils.formatUnits(d.toString(), PAYMENT_DECIMALS).toString());
    if (Number(dd) && Number(dd) > 2) {
      dd = Number(dd).toFixed(0);
    }
    const avgPayoutPerDay = dd;
    return avgPayoutPerDay;
  }
  const getPendingRewards = async (poolId) => {
    let d = BigNumber.from(0)
    try {
      d = await deepspaceShipStakingContract.pendingRewards(poolId, account);
    } catch { }
    let rawEarned = d.div(Math.pow(10, 7)).mul(Math.pow(10, 7));
    const earned = ethers.utils.commify(+ethers.utils.formatUnits(rawEarned.toString(), PAYMENT_DECIMALS).toString())
    return { earned, rawEarned };
  }
  const handleActiveItem = (key, type) => (event) => { // type is 'Stake'|'Unstake' 
    // var height = window.innerHeight;
    var scrollHeight = window.scrollY;
    var height = document.getElementsByClassName("ship-list-section")[0].getBoundingClientRect().top;
    window.scrollTo({
      left: 0,
      top: scrollHeight + height,
      behavior: 'smooth'
    });
    event.stopPropagation();
    let arr = [];
    shipList.map((ship, key) => {
      arr.push({ ...ship, checked: false });
    })
    if (type == 'any') {
      setActiveItem({ key: key, type: isStaking ? 'Unstake' : 'Stake' });
    } else {
      if (type === 'Unstake') {
        setIsStaking(true);
      } else {
        setIsStaking(false);
      }
      setActiveItem({ key: key, type: type });
    }
    setShipList([...arr]);
    setCheckedShipList([]);
  }
  const showModal = (type) => {
    if (type === 'staking') setShowStakingModal(true);
    if (type === 'unstaking') setShowUnstakingModal(true)
    if (type === 'helper') setShowHeloperModal(true);
  }
  const handleIsStaking = async (type) => {
    setIsStaking(type);
    await handleUpdatePool();
  }
  const handlePagination = (dir) => {
    if (!shipList || (shipList.length != shipSelects + 1 && dir > 0)) {
      dir = 0;
    }
    let d = pagination + dir;
    d = Math.max(0, d);
    setPagination(d);
  }
  const handleStatus = (tokenId) => {
    let arr = [];
    var ct = 0;
    shipList.map((ship, key) => {
      if (ship.checked) ct++;
      if (ship.tokenId == tokenId) {
        if (!ship.checked) {
          ct++;
        }
        ship.checked = ship.checked ? false : true;
      }
      arr.push(ship);
    });
    if (ct > 10) toastr.error("You can select max 10 ships", "error");
    else {
      setShipList([...arr]);
    }
  }
  const handleClaim = async () => {
    let p_id = [];
    poolList && poolList.map((pool, key) => {
      p_id.push(Number(pool.id));
    });
    if (!account) {
      toastr.error("Please connect wallet");
    } else if (p_id.length === 0) {
      toastr.error("Pool is not exist");
    }

    else if (p_id.length > 0) {
      try {
        setLoadSpinner(1);
        let gasLimit = 600000;
        const stakingInterface = new ethers.utils.Interface(DPS_SHIP_STAKING_ABI)
        const estimateGas = await deepspaceShipStakingContract.estimateGas.harvestPools(p_id);
        gasLimit = estimateGas.toNumber() + 100000;
        const tx = await deepspaceShipStakingContract.harvestPools(p_id, { gasLimit: gasLimit });
        setLoadSpinner(2);
        let receipt = await tx.wait();
        let stakingEvents = receipt.logs.filter((log) => {
          return log.address == config.STAKING_ADDRESS
        }).map((log) => {
          return stakingInterface.parseLog(log);
        });
        let arr = [];
        let RewardAmount = BigNumber.from(Zero);
        const shipLost = stakingEvents.filter((event) => {
          return event.name === 'Harvested';
        }).map((event) => {
          RewardAmount = RewardAmount.add(event.args.amount);
        });
        RewardAmount = RewardAmount.div(Math.pow(10, 7)).mul(Math.pow(10, 7));
        const RewardResult = ethers.utils.commify(ethers.utils.formatUnits(RewardAmount.toString(), PAYMENT_DECIMALS).toString());
        if (Number(RewardResult) != 0) {
          toastr.success("You get rewards of total " + RewardResult + " DPS", "Rewards");
        } else {
          toastr.error("Transaction failed", "Error");
        }
        setLoadSpinner(0);
      } catch (e) {
        console.log(e, "Claim Error")
        setLoadSpinner(3);
      }

    }
    await handleUpdatePool();
  }

  const handleLoading = (status) => {
    setLoadSpinner(status);
  }

  const modalClose = (type) => {
    type === 'staking' ? setShowStakingModal(false) : setShowUnstakingModal(false);
    setCheckedShipList([]);
    setActiveItem({ key: activeItem.key, type: 'any' });
    if (isStaking) {
      setIsStaking(false);
    } else {
      setIsStaking(true);
    }
  }

  const showToastr = (msg, type) => {
    toastr.error(msg, type);
  }

  if (!config.PAGES.includes(pageId)) {
    return '';
  }

  const configMetaData = () => {
    let val;
    if (config.ENVIRONMENT === 'DEVELOPMENT') {
      val = "Dev"
    } else if (config.ENVIRONMENT === 'PRODUCTION') {
      val = "DPS"
    } else {
      val = "Test"
    }
    return val
  }

  return (
    <>
      <Head>
        <title>DEEPSPACE - Vault | {configMetaData()}</title>
        <meta content={"DEEPSPACE - Outpost | " + `${configMetaData()}`} property="og:title" />
        <meta content={"DEEPSPACE - Outpost | " + `${configMetaData()}`} property="twitter:title" />
      </Head>
      <ToastContainer ref={ref => container = ref} className="toast-top-right" />
      <StakingStyle className="block w-full pb-20 text-center mt-7 md:pb-14">
        {/* {
          showBanner && (
            <div className='px-3 py-3 mx-3 text-lg text-center goldman-font top-banner-alert' onClick={() => { setShowBanner(false) }}>{bannerAlert}</div>
          )
        } */}

        <div className='px-3 py-3 mx-3 text-lg text-center goldman-font top-banner-alert'> The Vault has ended for now </div>

        <div className='relative px-2 text-center xl:px-5 goldman-font'>
          {
            countDownTime && (
              <div className='end-block-timer'>
                <TimerComponent
                  expiryTimestamp={countDownTime}
                  content={'The Vault Closes In'}
                />
              </div>
            )
          }
          <StakingDashboardDeskTopComponent
            stakingPools={stakingPools}
            activeItem={activeItem}
            handleActiveItem={handleActiveItem}
            checkedShipList={checkedShipList}
            showModal={showModal}
            totalReward={totalReward}
            handleClaim={handleClaim}
          />
          <div className={`${allowance.eq(0) && account ? 'mt-10' : ''}`}>
            <StakingDashboardMobileComponent
              stakingPools={stakingPools}
              activeItem={activeItem}
              handleActiveItem={handleActiveItem}
              checkedShipList={checkedShipList}
              showModal={showModal}
              totalReward={totalReward}
              handleClaim={handleClaim}
            />
          </div>
          {
            stakingPools.length === 0 ? (
              <div className='absolute z-50 block loading-lottie md:hidden'>
                <div>
                  <Lottie options={defaultOptions}
                    height={120}
                    width={120}
                    isStopped={false}
                    isPaused={false} />
                </div>
              </div>
            ) : ('')
          }

        </div>
        <div className="flex justify-center w-full mb-7">
          <div className='w-full mt-7 px-7 staking-list-section'>
            <div className="flex items-end justify-between goldman-font">
              <div className="pl-5">
                <Image unoptimized={true} className="cursor-pointer lg:block" src={assetURL("updownarrow.png")} alt="upanddownlogo" width={18} height={21} onClick={() => {
                  addFilterBox()
                }} />
              </div>
              <div className="goldman-font">
                <StakingToggle
                  status={isStaking}
                  handleClick={handleIsStaking}
                />
              </div>
            </div>
            <hr className="my-2" style={{ borderColor: 'cyan' }} />
            <div className='w-full mt-5 text-center md:flex md:mt-3 ship-list-section'>
              {
                fBox && shipList && (
                  <div className="mt-3 staking-filter sm:mt-5">
                    <FilterShips
                      filterType="staking"
                    />
                  </div>
                )
              }
              <div className='flex flex-wrap justify-center staking-ships'>
                {shipList && shipList.map((nft, key) => {
                  if (key == shipSelects) return;
                  let canAction = (!isStaking && activeItem.type === 'Stake' || isStaking && activeItem.type === 'Unstake' || key === -1) ? true : false;
                  return (
                    <div className='px-3 pt-7' key={key}>
                      <ShipCard
                        cardType={isStaking ? 'staking' : 'unstaking'}
                        key={key}
                        nftData={nft}
                        price={'0'}
                        nftFullData={nft}
                        handleStatus={handleStatus}
                        PoolId={activeItem.key !== -1 && poolList ? Number(poolList[activeItem.key].id) : null}
                        canAction={canAction}
                        selectPool={activeItem.key !== -1 ? stakingPools[activeItem.key] : null}
                      />
                    </div>
                  )
                })
                }
                {
                  account && ListData == null && !shipError && (
                    <div className='flex flex-wrap justify-center'>
                      {

                        [...Array(5)].map((item, key) => {
                          return (
                            <div className='px-3' key={key}>
                              <SkeletonLoading />
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                }
                {
                  !account && !shipError && (<h4 className="text-center mt-7">Please connect wallet</h4>)
                }
                {
                  account && shipError && (<h4 className="text-center mt-7">Server Error</h4>)
                }
                {
                  account && !shipError && shipList.length === 0 && ListData && activeItem.key == -1 && (<h4 className="text-center mt-7">Please select pool to view available ships. </h4>)
                }
                {
                  account && !shipError && shipList.length === 0 && ListData && activeItem.key != -1 && (<h4 className="text-center mt-7">No Matching ships. </h4>)
                }
              </div>
            </div>
          </div>
        </div>
        <Pagination handlePagination={handlePagination} data={{ 'cur_pos': pagination }} pageName='staking' />
        <StakingModal
          show={showStakingModal}
          onClose={modalClose}
          PoolInfo={poolList && activeItem.key != -1 ? poolList[activeItem.key] : null}
          shipList={checkedShipList}
          modalType='staking'
          rarity={rarity}
          showToastr={showToastr}
        />
        <StakingModal
          show={showUnstakingModal}
          onClose={modalClose}
          PoolInfo={poolList && activeItem.key != -1 ? poolList[activeItem.key] : null}
          shipList={checkedShipList}
          modalType='unstaking'
          rarity={rarity}
          showToastr={showToastr}
        />
        <HelperModal show={showHelperModal} onClose={() => { setShowHeloperModal(false) }} />
      </StakingStyle >
      {loadSpinner ? <LoadingSpinner status={loadSpinner} handleLoading={handleLoading} /> : ''}
    </>
  )
}

Staking.Layout = Default;
