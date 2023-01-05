import React, { useEffect, useState } from 'react';
import { assetURL, getDateDifferent, getNFTImageURL, getStarCount, getStarLevel } from '../../functions/deepspace';
import styled from 'styled-components'
import cn from 'classnames';
import Image from 'next/image';
import StarRatingComponent from 'react-star-rating-component';
import { MdShoppingCart, MdOutlinePublishedWithChanges } from 'react-icons/md';
import { TextureColors, PAYMENT_DECIMALS } from '../../constants';
import { GrFormAdd } from 'react-icons/gr';
import { HiMinusSm } from 'react-icons/hi';
import Pagination from '../Pagination';
import { ethers, BigNumber } from 'ethers'
import { useShipSelects } from '../../state/others/hooks';
import CustomModal from '../../components/Modal/CustomModal'
import { useAddShipCard, useShipCard } from '../../state/others/hooks';
import { BiLinkExternal } from 'react-icons/bi';
import { ToastContainer } from 'react-toastr';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'


import "toastr/build/toastr.css";
import "animate.css/animate.css";

const ComponentStyle = styled.div`
    .ship-section{
        font-size:13px;
        color:black;
        opacity:0.8;
        padding:6px;
        transition:.3s;
        // box-shadow:0px 0px 2px 4px rgba(0,0,0,0.5);
        border:1px solid transparent;
    }
    .ship-section:hover{
        box-shadow:0px 0px 8px 4px rgb(125 216 221 / 50%);
        border:1px solid cyan;
        opacity:1;
    }
    .ship-image{
        background-color:rgba(0,0,0,0.4);
        height:60px;
        width:80px;
        display:flex;
        justify-content:center;
        align-items:center;
        border-radius:12px;
    }
    .ship-rating .dv-star-rating{
        font-size:18px;
        display:flex!important;
        flex-direction: row-reverse;
        align-items:center;
        justify-content:center;
        line-height:1.0;
    }
    .ship-status{
        color:#708EB5;
    }
    .expand-section{
        border-top:1px dashed gray;
        margin-top:6px;
    }
`
export default function SoldShipCardMobile({ listingData, filterType }) {
    let container;
    const { account } = useActiveWeb3React();
    const [cardExpand, setCardExpand] = useState(-1);
    const [c, setC] = useState(null)
    const shipSelects = useShipSelects();
    const [showUnListModal, setShowUnListModal] = useState(false)
    const [showBuyModal, setShowBuyModal] = useState(false)
    const addShipCard = useAddShipCard();
    useEffect(() => {
        if (container) {
            setC(container);
        }
    }, [container])

    const handleCardExpand = (id) => (event) => {
        event.stopPropagation();
        if (id == cardExpand) {
            setCardExpand(-1);
        } else {
            setCardExpand(id);
        }
    }
    const handleClick = (fType, ship) => {
        addShipCard(ship);
        if (fType === 'outpostNewListing') {
            setShowBuyModal(true);
        }
        if (fType === 'outpostMyListing') {
            setShowUnListModal(true);
        }
    }
    const showToastr = (status) => {
        if (c) {
            let msg_type = "";
            switch (filterType) {
                case 'outpostNewListing':
                    msg_type = 'buy this ship';
                    break;
                case 'outpostMyListing':
                    msg_type = 'unlist this ship';
                    break;
            }
            if (status === 'aprroveReady') c.info("A one-time Approve request is required before getting started", "Message");
            if (status === 'approveSuccess') c.success(`Approve success. You can ${msg_type}. Please click confirm.`, 'Success');
            if (status === 'listPriceError') c.error("List price is not valid.", "Error");
            if (status === 'balanceNotEnough') c.error("Balance is not enough", "Error");
        }
    }
    const handleGoShipLink = (shipId) => (event) => {
        window.open(
            window.location.origin + "/shipLink/" + shipId,
            "_blank"
        );
        event.stopPropagation();
    }
    return (
        <>
            <ToastContainer ref={ref => container = ref} className="toast-top-right" style={{ zIndex: '100000' }} />
            <ComponentStyle>
                {
                    listingData ? listingData.map((list, key) => {
                        if (key == shipSelects) return;
                        let ship, imageURL, shipId, rating, textureType, currentLevel, maxLevel, dateTime, price, displayStatus, m_buyer, m_seller, buyer, seller, len, fullBuyer, fullSeller;
                        if (filterType === 'outpostNewListing') {
                            displayStatus = "Listing";
                        } else if (filterType === 'outpostMyListing') {
                            displayStatus = "My Listing";
                        } else if (filterType === 'outpostSale') {
                            displayStatus = "Sale";
                        } else if (filterType === 'outpostMySale') {
                            displayStatus = "My Sale";
                        }


                        if ((filterType === 'outpostNewListing' || filterType === 'outpostMyListing') && list['listing']) {
                            ship = list['listing'];
                            imageURL = getNFTImageURL(ship.token.shipType, ship.token.textureType, ship.token.textureNum);
                            shipId = ship.token.tokenId;
                            rating = getStarCount(ship.token.stats);
                            textureType = ship.token.textureType;
                            currentLevel = getStarLevel(ship.token.stats).currentLevel;
                            maxLevel = getStarLevel(ship.token.stats).maxLevel;
                            price = ethers.utils.commify(+ethers.utils.formatUnits(ship.price, PAYMENT_DECIMALS).toString());
                            dateTime = getDateDifferent(ship.listDate);

                        } else if ((filterType === 'outpostSale' || filterType === 'outpostMySale') && list['ship']) {
                            ship = list['ship'];
                            imageURL = getNFTImageURL(ship.shipType, ship.textureType, ship.textureNum);
                            shipId = ship.tokenId;
                            rating = getStarCount(ship.stats);
                            textureType = ship.textureType;
                            currentLevel = getStarLevel(ship.stats).currentLevel;
                            maxLevel = getStarLevel(ship.stats).maxLevel;
                            price = ethers.utils.commify(+ethers.utils.formatUnits(list.purchasePrice, PAYMENT_DECIMALS).toString());
                            dateTime = getDateDifferent(list.purchaseDate);
                            fullBuyer = list.purchaseDetail.buyer;
                            fullSeller = list.purchaseDetail.seller;
                            len = fullBuyer.length;
                            buyer = "0x" + fullBuyer.charAt(2) + "..." + list.purchaseDetail.buyer.slice(len - 2);
                            m_buyer = fullBuyer.slice(0, 6) + "..." + list.purchaseDetail.buyer.slice(len - 4);
                            seller = "0x" + fullSeller.charAt(2) + "..." + list.purchaseDetail.seller.slice(len - 2);
                            m_seller = fullSeller.slice(0, 6) + "..." + list.purchaseDetail.seller.slice(len - 4);
                        } else {
                            return;
                        }
                        return (

                            <div className={cn('mt-5 ship-section goldman-font', {
                                'cursor-pointer': (filterType === 'outpostNewListing' || filterType === 'outpostMyListing')
                            })} key={key} style={{ backgroundColor: `${TextureColors[textureType]}` }} onClick={() => handleClick(filterType, ship)}>

                                <div className='flex justify-between'>
                                    <div className='flex'>
                                        <div className='ship-image mr-2'>
                                            <Image alt={"shipImage"} src={imageURL} width={65} height={60} />
                                        </div>
                                        <div className='flex items-center'>
                                            <div>
                                                <div className='flex'>
                                                    <div className='pr-1'>{shipId}</div>
                                                    <div className='cursor-pointer' style={{ marginTop: '3px' }}><BiLinkExternal style={{ fontSize: '12px' }} onClick={handleGoShipLink(shipId)} /></div>
                                                </div>
                                                <div className='flex ship-rating'>
                                                    <StarRatingComponent
                                                        name="shipRating"
                                                        starCount={5}
                                                        value={Number(rating)}
                                                        emptyStarColor={'#D1D5DB'}
                                                    />
                                                </div>
                                                {
                                                    filterType !== 'outpostNewListing' && filterType !== 'outpostMyListing' ? (
                                                        <div className='flex justify-start items-center' onClick={handleCardExpand(key)}>
                                                            <div className='flex items-center' style={{ marginLeft: "-3px" }}>
                                                                {
                                                                    cardExpand === key ? (
                                                                        <HiMinusSm fontSize={18} />
                                                                    ) : (
                                                                        <GrFormAdd fontSize={18} />
                                                                    )
                                                                }
                                                            </div>
                                                            <div style={{ marginTop: '2px' }}>More</div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {currentLevel} / {maxLevel}
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='ship-status flex items-center justify-end'>
                                            <div className='mr-1'>
                                                {
                                                    filterType === 'outpostNewListing' ? (
                                                        <MdOutlinePublishedWithChanges fontSize={13} />
                                                    ) : (
                                                        <MdShoppingCart fontSize={13} />
                                                    )
                                                }
                                            </div>
                                            <div>{displayStatus}</div>
                                        </div>
                                        <div className='flex justify-end items-center ship-price'>
                                            <Image
                                                unoptimized={true}
                                                src={assetURL("DPS-icon-96x96-1.png")}
                                                alt="DEEPSPACE"
                                                width="13px"
                                                height="13px"
                                                objectFit="contain"
                                                className=""
                                            />
                                            <div className='ml-1'>{price}</div>
                                        </div>
                                        <div className='transaction-time text-right'>{dateTime}</div>
                                    </div>
                                </div>
                                {
                                    cardExpand === key && filterType !== 'outpostNewListing' && filterType !== 'outpostMyListing' ? (
                                        <div className='expand-section'>
                                            <div className='flex justify-center px-3'>
                                                <div className='text-center px-5'>
                                                    <div>From</div>
                                                    <div className='cursor-pointer' style={{ color: '#4A097E' }} title={fullSeller}>{window.innerWidth <= 768 ? m_seller : seller}</div>
                                                </div>
                                                <div className='text-center px-5'>
                                                    <div>To</div>
                                                    <div className='cursor-pointer' style={{ color: '#4A097E' }} title={fullBuyer}>{window.innerWidth <= 768 ? m_buyer : buyer}</div>
                                                </div>
                                            </div>
                                            {
                                                !account && (
                                                    <div className='flex justify-center w-full'>
                                                        <div className='text-center'>Please connect your wallet.</div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : ('')
                                }
                            </div>
                        )
                    }) : ('')
                }
                <CustomModal show={showUnListModal} onClose={() => { setShowUnListModal(false); }} shipCardType="unlist-ship" showToastr={showToastr} />
                <CustomModal show={showBuyModal} onClose={() => { setShowBuyModal(false); }} shipCardType="buy-ship" showToastr={showToastr} />
            </ComponentStyle>
        </>
    )
}