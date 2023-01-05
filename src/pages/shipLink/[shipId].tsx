import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import ShipCard from '../../components/ShipCard';
import ShipLinkLayout from '../../layouts/ShipLinkLayout';
import styled from 'styled-components'
import config from '../../config';
import { useSingleShip } from '../../services/graph/hooks/deepspace';
import { PAYMENT_DECIMALS } from '../../constants';
import { usePurchaseDetails } from '../../services/graph/hooks/deepspace'
import { assetURL, detectBrowser, getDateDifferent, getNFTImageURL } from '../../functions/deepspace';
import { ethers } from 'ethers';
import { useActiveWeb3React } from '../../hooks';

const PageStyle = styled.div`
    .purchase-detail{
        max-width:650px;
        background-image:url(${config.ASSETS_BASE_URI}app/modals/modal-6.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width:100%;
        // color:#b5b5b5;
        color:white;
    }
    .purchase-detail-header{
        font-size:21px;
        color:cyan;
        margin-top:12px;
        font-weight:500;

    }
    .order-num{
        width:32px;
        text-align:center;
    }
    .from-address, .to-address{
        width:calc( 50% - 96px );
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .from-address > a , .to-address > a {
        width:90%;
        text-align:center;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
        color:#a8ffc7;
        display:inline-block;
    }
    .ship-price{
        width:70px;
        text-align:center;
    }
    .tx-time{
        width:100px;
    }
    .tx-time > div{
        text-align:right;
    }
    .ship-title{
        padding: 6px 12px;
        font-size:14p;
        color:#b5b5b5;

    }
    .ship-list{
        max-height:350px;
        // min-height:200px;
        overflow:auto;
        font-size:14px;
        margin-bottom:18px;
    }
    .ship-list::-webkit-scrollbar {
        width: 6px;
    }
    .ship-list::-webkit-scrollbar-track {
        background-color:transparent;
        border-radius:6px;
        border:1px solid gray;
        overflow:hidden;
    }
    .ship-list::-webkit-scrollbar-thumb {
        background-color:#0A1014;
        border-radius:6px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
    .ship-item {
        // background-color:#127997;
        background-color: #00c7ff6b;
        box-shadow: 0px 0px 4px 1px rgb(44 37 24);
        border-radius:3px;
        margin-top:12px;
        padding:6px 12px;
    }
    @media(max-width:630px){
        .purchase-detail{
          width:100%;
        }
        .purchase-detail-header{
            font-size:18px;
            margin-top:0;
        }
        .ship-title{
            padding:3px 6px;
            font-size:11px;
        }
        .ship-list{
            font-size:11px;
            max-height:200px;
            // min-height:120px;
        }
        .from-address, .to-address{
            width:calc( 50% - 96px );
        }
        .from-address > a , .to-address > a {
            width:90%;
            text-align:center;
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: ellipsis;
            color:#a8ffc7;
        }
        .ship-item{
            padding:3px 6px;
        }
        .ship-price{
            text-align:right;
        }
        .tx-time{
            width:85px;
        }
      }
`
export default function ShipLink() {
    const [ship, setShip] = useState(null);
    const account = useActiveWeb3React();
    const route = useRouter();
    const [imageURL, setImageURL] = useState(null);
    const [cardType, setCardType] = useState(null);
    const shipData = useSingleShip(route.query.shipId);
    const { data: purchaseList, mutate, error } = usePurchaseDetails(Number(route.query.shipId));
    useEffect(() => {
        if (shipData && shipData.length) {
            setShip(shipData[0]);
            setImageURL(getNFTImageURL(shipData[0]['ship'].shipType, shipData[0]['ship'].textureType, shipData[0]['ship'].textureNum));
            if (shipData[0]['listing']) {
                setCardType('shipsoutpost');
            } else {
                setCardType('inventory');
            }
        }
    }, [shipData]);
    return (
        <PageStyle className="w-full">
            <div className='flex justify-center w-full sm:mt-10'>
                {/* <Head>
                <meta name="twitter:description" content={'Share ship & NFT marketplace'} key="twitter:description" />
                <meta name="twitter:image" content={'https://dev-assets.deepspace.game/nfts/0/2/1/3/nft.png'} key="twitter:image" />
                <meta key="og:image" property="og:image" content={'https://dev-assets.deepspace.game/nfts/0/2/1/3/nft.png'} />
            </Head> */}
                <div>
                    {
                        ship && cardType && (
                            <ShipCard
                                cardType={cardType}
                                nftData={cardType === 'inventory' ? ship['ship'] : ship['listing']['token']}
                                price={ship['listing'] ? ship['listing'].price : '0'}
                                nftFullData={cardType === 'inventory' ? ship['ship'] : ship['listing']}
                            />
                        )
                    }
                </div>
            </div>
            <div className='flex justify-center'>
                <div className='purchase-detail goldman-font mt-5 p-3 sm:p-5'>
                    <div className='text-center goldman-font purchase-detail-header pt-3'> Purchase History </div>
                    {
                        purchaseList && purchaseList.length ? (

                            <div className='flex justify-between w-full mt-3 ship-title'>
                                <div className='order-num'>No</div>
                                <div className='from-address'>From</div>
                                <div className='to-address'>To</div>
                                <div className='ship-price'>Price</div>
                                <div className='tx-time'><div>Time</div></div>
                            </div>
                        ) : ('')
                    }
                    <div className='w-full ship-list '>
                        {
                            purchaseList && purchaseList.map((ship, key) => {
                                let fullBuyer, fullSeller, len, buyer, seller, purchaseDate, formattedPrice, shipImage, m_buyer, m_seller;

                                const id = ship.tokenId;
                                fullBuyer = ship.buyer;
                                fullSeller = ship.seller;
                                len = fullBuyer.length;
                                buyer = fullBuyer.slice(0, 6) + "..." + fullBuyer.slice(len - 4);
                                seller = fullSeller.slice(0, 6) + "..." + fullSeller.slice(len - 4);

                                m_buyer = fullBuyer.slice(0, 4) + "..." + fullBuyer.slice(len - 2);
                                m_seller = fullSeller.slice(0, 4) + "..." + fullSeller.slice(len - 2);

                                formattedPrice = ethers.utils.commify(+ethers.utils.formatUnits(ship.price, PAYMENT_DECIMALS).toString())
                                purchaseDate = getDateDifferent(ship.purchaseDate);
                                return (
                                    <div key={key} className="flex justify-between w-full ship-item items-center py-2">
                                        <div className='order-num'>{key + 1}</div>
                                        <div className='from-address' title={fullSeller}><a href={`https://bscscan.com/address/${fullSeller}`} target={"blank"}>{window.innerWidth <= 435 ? m_seller : seller}</a></div>
                                        <div className='to-address' title={fullBuyer}><a href={`https://bscscan.com/address/${fullBuyer}`} target={"blank"}>{window.innerWidth <= 435 ? m_buyer : m_buyer}</a></div>
                                        <div className='flex items-center justify-end sm:justify-center ship-price'>
                                            <div>{formattedPrice}</div>
                                            <div className='pl-1 mt-1 sm:mt-2'>
                                                <Image
                                                    unoptimized={true}
                                                    src={assetURL("DPS-icon-96x96-1.png")}
                                                    alt="DEEPSPACE"
                                                    width="15px"
                                                    height="15px"
                                                    objectFit="contain"
                                                    className=""
                                                />
                                            </div>
                                        </div>
                                        <div className='text-right tx-time'>{purchaseDate}</div>
                                    </div>
                                )
                            })
                        }
                        {
                            !purchaseList || (purchaseList && !purchaseList.length) ? (
                                <div className='w-full text-center mt-5'>No past transaction history for this ship.</div>
                            ) : ('')
                        }
                    </div>
                </div>
            </div>
        </PageStyle>

    )
}
ShipLink.Layout = ShipLinkLayout;