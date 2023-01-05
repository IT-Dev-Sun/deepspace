import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useActiveWeb3React } from '../../hooks'
import StakingDashboardImage from '../../asset/image/staking_dashboard.png'
import LevelOneImage from '../../asset/image/star_1-2_rating.png';
import LevelTwoImage from '../../asset/image/star_3-5_rating.png';
import SafeImage from '../../asset/image/Asset_15.png';
import RiskImage from '../../asset/image/Asset_17.png';
import { StakingHeader } from '../StakingHeader';
import cn from 'classnames';
import styled from 'styled-components';
import { IoHelpCircleSharp } from 'react-icons/io5'
import { useLostShips } from '../../services/graph/hooks/deepspace';
import { AiTwotoneGift } from 'react-icons/ai';
import StakingDashboardSkeleton from '../SkeletonLoading/StakingDashboardSkeleton';

const StakingDashboardDeskTopComponentStyle = styled.div`
    .pool-data-section{
        width:calc( 100% - 220px );
    }
    .staking-button-section{
        width:130px;
    }
    @media(max-width:1030px){
      .staking-container {
        margin-top: 35px;
      }
    }
    
`
interface ComponentProps {
  stakingPools: any
  activeItem: any
  handleActiveItem: any
  checkedShipList: any
  showModal: any
  totalReward: string
  handleClaim: () => void
}
const StakingDashboardDeskTopComponent: React.FC<ComponentProps> = ({ stakingPools, activeItem, handleActiveItem, checkedShipList, showModal, totalReward, handleClaim }) => {
  const { account } = useActiveWeb3React()
  const { data: shipsLost, mutate } = useLostShips();
  const [burn, setBurn] = useState(0);
  useEffect(() => {
    if (shipsLost) {
      setBurn(shipsLost['shipsLost'])
    }
  }, [shipsLost])
  return (
    <StakingDashboardDeskTopComponentStyle className="flex justify-center w-full">
      <div className='staking-container'>
        <div className="relative hidden w-full px-12 staking-dashboard p-7 md:block">
          <IoHelpCircleSharp className='absolute help-document' onClick={() => showModal('helper')} />
          <div className='absolute top-0 left-0 w-full h-full dashboard-image' style={{ zIndex: -1 }}>
            <Image className="" src={StakingDashboardImage} layout={'fill'} alt={'Staking Dashboard Image'} />
          </div>
          <div className='pt-7 lg:pt-5'>
            <StakingHeader className="pt-12 text-xl font-bold lg:text-2xl" content={'The Vault - Ship Staking Dashboard'} />
          </div>
          {
            account ? (
              <div className='flex justify-end mb-2 mr-5'>
                {
                  totalReward != '0' && (
                    <div className='mt-3 mr-3' style={{ fontSize: '12px', color: 'cyan' }}>Claim Amount: <span>{totalReward} DPS</span></div>
                  )
                }
                <div className='flex items-center justify-center staking-button claim-button' onClick={() => handleClaim()}><div className='flex items-center justify-center'><AiTwotoneGift style={{ fontSize: '18px' }} /><div className='mt-1 ml-1'>Claim</div></div></div>
              </div>
            ) : (<div className='mt-5'></div>)
          }
          <div className="px-2 pb-3 dashboard-table lg:px-5">
            {
              (!stakingPools || stakingPools.length === 0) && [...Array(4)].map((item, key) => {
                return (
                  <StakingDashboardSkeleton key={key} />
                )
              })
            }
            {
              stakingPools && stakingPools.map((pool, key) => {
                return (

                  <div className={cn('flex w-full justify-between pool-info mb-5', {
                    'pool-active': key == activeItem.key
                  })} key={key} onClick={handleActiveItem(key, 'any')}>
                    <div className='flex items-center justify-center'>
                      <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                        <Image src={pool.minStars == 1 ? LevelOneImage : LevelTwoImage} width={'95px'} height={'100px'} alt={'Staking Pool Level Image'} />
                      </div>
                    </div>
                    <div className='flex flex-wrap items-center justify-around pool-data-section'>
                      <div>
                        <div style={{ color: 'cyan' }}>{pool.minStars} - {pool.maxStars} Star {pool.safe ? 'Safe' : 'High Risk'} Pool</div>
                        <div className='flex flex-wrap items-center justify-around'>
                          <div className='flex items-center justify-center'>
                            <div className='flex items-center justify-center w-full text-left pool-description'>
                              <div>
                                <div className='px-2 pool-key'>Avg Daily DPS Distr. Per Ship&nbsp;:</div>
                                <div className='px-2 pool-key'># of Your Ships Staked&nbsp;:</div>
                                <div className='px-2 pool-key'># of Total Ships Staked&nbsp;:</div>
                                <div className='px-2 pool-key'>DPS Earned&nbsp;:</div>
                              </div>
                            </div>
                            <div className='flex items-center justify-center w-full text-left'>
                              <div>
                                <div className='pool-value'>{pool.apr}</div>
                                <div className='pool-value'>{pool.qty}</div>
                                <div className='pool-value'>{pool.nft_pool}</div>
                                <div className='pool-value'>{pool.earned}</div>
                              </div>
                            </div>
                          </div>
                          {
                            account && (

                              <div className='flex items-center justify-center md:block staking-button-group'>

                                <div className='w-full px-2 staking-button-section'>
                                  {
                                    key === activeItem.key && activeItem.type === 'Stake' && checkedShipList.length === 0 ? (
                                      <div className="flex items-center justify-center w-full staking-button">
                                        <div>Select Ships</div>
                                      </div>
                                    ) : ('')

                                  }
                                  {
                                    key === activeItem.key && activeItem.type === 'Stake' && checkedShipList.length ? (
                                      <div className={cn("staking-button flex items-center justify-center w-full active-button")} onClick={() => { showModal('staking') }}>
                                        <div>Stake</div>
                                      </div>
                                    ) : ('')
                                  }
                                  {
                                    (key !== activeItem.key || activeItem.type !== 'Stake') ? (
                                      <div className={cn("staking-button flex items-center justify-center w-full")} onClick={handleActiveItem(key, 'Stake')}>
                                        <div>Stake</div>
                                      </div>
                                    ) : ('')
                                  }
                                </div>
                                <div className='w-full px-2 staking-button-section'>
                                  {
                                    key === activeItem.key && activeItem.type === 'Unstake' && checkedShipList.length === 0 ? (
                                      <>
                                        {

                                          pool.qty > 0 && (
                                            <div className="flex items-center justify-center w-full staking-button">
                                              <div>Select Ships</div>
                                            </div>
                                          )
                                        }
                                      </>
                                    ) : ('')
                                  }
                                  {
                                    key === activeItem.key && activeItem.type === 'Unstake' && checkedShipList.length ? (
                                      <div className="flex items-center justify-center w-full staking-button active-button" onClick={() => { showModal('unstaking') }}>
                                        <div>Unstake</div>
                                      </div>
                                    ) : ('')
                                  }
                                  {
                                    (key !== activeItem.key || activeItem.type !== 'Unstake') ? (
                                      <>
                                        {
                                          pool.qty > 0 && (
                                            <div className="flex items-center justify-center w-full staking-button" onClick={handleActiveItem(key, 'Unstake')}>
                                              <div>Unstake</div>
                                            </div>
                                          )

                                        }
                                      </>
                                    ) : ('')
                                  }
                                </div>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div style={{ width: '80px', height: '100px' }}>
                        <Image src={pool.safe ? SafeImage : RiskImage} width={'80px'} height={'100px'} />
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

        </div>
        <div className='hidden p-5 pb-0 mt-3 text-left staking-dashboard md:inline-block px-7' style={{ minHeight: 'unset' }}>
          <p style={{ fontSize: '15px' }}><b>WARNING:</b> High Risk pools carry a chance to destroy your ship. There is a 25% - 75% chance, based on ship Luck, any Ship NFT submitted to a high risk pool will be burned. Please review the confirmation dialog carefully when submitting to High Risk pools.</p>
          <p className='mt-3' style={{ color: 'cyan' }}><span></span>{burn} ships have been burned to date</p>
        </div>
      </div>
    </StakingDashboardDeskTopComponentStyle>
  )
}

export default StakingDashboardDeskTopComponent;