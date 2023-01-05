import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useActiveWeb3React } from '../../hooks'
import StakingDashboardImage from '../../asset/image/staking_dashboard_mobile_2.png';
import StakingDashboardActiveImage from '../../asset/image/staking_dashboard_mobile_active.png';
import { StakingHeader } from '../StakingHeader';
import LevelOneImage from '../../asset/image/star_1-2_rating.png';
import LevelTwoImage from '../../asset/image/star_3-5_rating.png';
import SafeImage from '../../asset/image/Asset_15.png';
import RiskImage from '../../asset/image/Asset_17.png';
import styled from 'styled-components';
import cn from 'classnames';
import { IoHelpCircleSharp } from 'react-icons/io5'
import { useLostShips } from '../../services/graph/hooks/deepspace'
import { AiTwotoneGift } from 'react-icons/ai';
const StakingDashboardMobileComponentStyle = styled.div`
    .mobile-dashboard{
        width:280px;
        height:400px;
        margin:0px!important;
    }
    .mobile-header{
        padding-top:9px;
    }
    .select-pool{
        opacity:0;
        transition:.5s;
    }
    .mobile-dashboard:hover .select-pool{
        opacity:1;
    }
    .pool-key{
        font-size:12px;
    }
    // @media(max-width:310px){
    //     .mobile-dashboard{
    //         width:220px;
    //         height:300px;
    //         margin:0px!important;
    //     }
        
    //     .mobile-header{
    //         font-size:11px;
    //         line-height:1.3;
    //         padding-top:6px;
    //     }
    //     .mobile-content{
    //         font-size:10px;
    //     }
    //     .held-until{
    //         font-size:10px;
    //     }
    // }
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
const StakingDashboardMobileComponent: React.FC<ComponentProps> = ({ stakingPools, activeItem, handleActiveItem, checkedShipList, showModal, totalReward, handleClaim }) => {
    const { data: shipsLost, mutate } = useLostShips();
    const { account } = useActiveWeb3React();
    const [burn, setBurn] = useState(0);
    useEffect(() => {
        if (shipsLost) {
            setBurn(shipsLost['shipsLost'])
        }
    }, [shipsLost])
    return (
        <StakingDashboardMobileComponentStyle>
            <div className='relative flex flex-wrap justify-center md:hidden'>
                <IoHelpCircleSharp className='absolute help-document' onClick={() => showModal('helper')} />
                {
                    account ? (
                        <div className='absolute flex claim-button'>
                            {
                                totalReward != '0' && (
                                    <div className='mt-3 mr-3' style={{ fontSize: '12px', color: 'gray' }}>Claim Amount: <span style={{ color: 'cyan' }}>{totalReward} DPS</span></div>
                                )
                            }
                            <div className='flex items-center justify-center staking-button' onClick={() => handleClaim()}>
                                <div className='flex items-center justify-center'><AiTwotoneGift style={{ fontSize: '18px' }} />
                                    <div className='mt-1 ml-1'>Claim</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )
                }
                {
                    stakingPools && stakingPools.map((pool, key) => {
                        return (
                            <div className='p-2 py-0 mt-5' key={key}>
                                <div className='relative flex justify-center cursor-pointer mobile-dashboard' key={key} onClick={handleActiveItem(key, 'any')}>
                                    <div className='absolute top-0 left-0 z-10 w-full h-full mobile-image' style={{ zIndex: '-1' }}>
                                        <Image src={key == activeItem.key ? StakingDashboardActiveImage : StakingDashboardImage} layout='fill' alt='' />
                                    </div>
                                    <div className='p-3'>
                                        <div className='flex justify-center mt-7'>
                                            <StakingHeader className={"pt-5 text-lg mobile-header"} content={`${pool.minStars == 1 ? 'Low' : 'High'} Level ${pool.safe ? 'Safe' : 'Risky'}`} />
                                        </div>
                                        <div className='flex items-center justify-around w-full mt-3'>
                                            <div className='px-5'>
                                                <Image src={pool.minStars == 1 ? LevelOneImage : LevelTwoImage} width={'85px'} height={'90px'} alt='' />
                                            </div>
                                            <div className='px-5'>
                                                <Image src={pool.safe ? SafeImage : RiskImage} width={'70px'} height={'80px'} alt='' />
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <div>
                                                <StakingHeader className={"pt-5 text-lg mobile-header"} content={'Pool Info'} />
                                            </div>
                                            <div className='mt-3'>
                                                <div className='flex justify-center pool-key'>
                                                    <div>Avg Daily DPS Distr. Per Ship:&nbsp;&nbsp;</div>
                                                    <div><b style={{ color: 'cyan' }}>{pool.apr}</b></div>
                                                </div>
                                                <div className='flex justify-center pool-key'>
                                                    <div>#of Your Ships Staked:&nbsp;&nbsp;</div>
                                                    <div><b style={{ color: 'cyan' }}>{pool.qty}</b></div>
                                                </div>
                                                <div className='flex justify-center pool-key'>
                                                    <div># of Total Ships Staked:&nbsp;&nbsp;</div>
                                                    <div><b style={{ color: 'cyan' }}>{pool.nft_pool}</b></div>
                                                </div>
                                                <div className='flex justify-center pool-key'>
                                                    <div>DPS Earned:&nbsp;&nbsp;</div>
                                                    <div><b style={{ color: 'cyan' }}>{pool.earned}</b></div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='flex justify-center mt-3'>
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
                                            {
                                                key === activeItem.key && activeItem.type === 'Unstake' && checkedShipList.length === 0 ? (
                                                    <div className="flex items-center justify-center w-full ml-3 staking-button">
                                                        <div>Select Ships</div>
                                                    </div>
                                                ) : ('')
                                            }
                                            {
                                                key === activeItem.key && activeItem.type === 'Unstake' && checkedShipList.length ? (
                                                    <div className="flex items-center justify-center w-full ml-3 staking-button active-button" onClick={() => { showModal('unstaking') }}>
                                                        <div>Unstake</div>
                                                    </div>
                                                ) : ('')
                                            }
                                            {
                                                (key !== activeItem.key || activeItem.type !== 'Unstake') ? (
                                                    <>
                                                        {

                                                            pool.qty > 0 && (<div className="flex items-center justify-center w-full ml-3 staking-button" onClick={handleActiveItem(key, 'Unstake')}>
                                                                <div>Unstake</div>
                                                            </div>
                                                            )
                                                        }
                                                    </>
                                                ) : ('')
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='px-3 pt-5 md:hidden'>
                <p style={{ fontSize: '12px' }}><b>WARNING:</b> High Risk pools carry a chance to destroy your ship. There is a 25% - 75% chance, based on ship Luck, any Ship NFT submitted to a high risk pool will be burned. Please review the confirmation dialog carefully when submitting to High Risk pools.</p>
                <p className='mt-3' style={{ color: 'cyan' }}>{burn} ships have been burned to date</p>
            </div>
        </StakingDashboardMobileComponentStyle>
    )
}
export default StakingDashboardMobileComponent;